import {useState} from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

interface NavigationItem {
  id: string;
  label: string;
  url?: string;
  subItems: NavigationItem[];
}

interface NavigationListProps {
  items: NavigationItem[];
  onEdit: (id: string) => void;
  editingItemId: string | null;
  onUpdate: (updatedItem: NavigationItem) => void;
  onCancel: () => void;
  onAddSubItem: (newItem: FormData, parentId: string) => void;
  onDeleteItem: (id: string, isSubItem?: boolean, parentId?: string) => void;
  onReorder: (items: NavigationItem[]) => void;
}

const NavigationList: React.FC<NavigationListProps> = ({
  items,
  onEdit,
  editingItemId,
  onUpdate,
  onCancel,
  onAddSubItem,
  onDeleteItem,
  onReorder,
}) => {

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [overDirection, setOverDirection] = useState<
    "top" | "bottom" | "inside" | null
  >(null);

   const sensors = useSensors(
     useSensor(PointerSensor, {
       activationConstraint: {
         distance: 5,
       },
     }),
     useSensor(KeyboardSensor, {
       coordinateGetter: sortableKeyboardCoordinates,
     })
   );

  const findItemPath = (items: NavigationItem[], id: string): number[] => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) return [i];
      if (items[i].subItems) {
        const path = findItemPath(items[i].subItems, id);
        if (path.length) return [i, ...path];
      }
    }
    return [];
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = findItemById(items, active.id as string);
    const overItem = findItemById(items, over.id as string);

    if (!activeItem || !overItem) return;

    // Get mouse position relative to the over item
    const overRect = (over.data.current as any)?.rect;
    if (!overRect) return;

    const mouseY = event.clientY;
    const threshold = 5; // pixels from top/bottom to trigger nesting
    const relativeY = mouseY - overRect.top;

    let direction: "top" | "bottom" | "inside" = "bottom";

    if (relativeY < threshold) {
      direction = "top";
    } else if (relativeY > overRect.height - threshold) {
      direction = "bottom";
    } else {
      direction = "inside";
    }

    setOverDirection(direction);
    setActiveId(active.id as string);
    setOverId(over.id as string);
  };

   const moveItemAsChild = (
     items: NavigationItem[],
     activeId: string,
     overId: string
   ): NavigationItem[] => {
     const newItems = [...items];
     const activeItem = findItemById(items, activeId);
     if (!activeItem) return newItems;

     const filteredItems = removeItemById(newItems, activeId);

     return addItemAsChild(filteredItems, activeItem, overId);
   };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (overDirection === "inside") {
      const newItems = moveItemAsChild(
        items,
        active.id as string,
        over.id as string
      );
      onReorder(newItems);
    } else {
      const activePath = findItemPath(items, active.id as string);
      const overPath = findItemPath(items, over.id as string);

      let newItems = [...items];

      // Remove item from its original position
      let itemToMove: NavigationItem | undefined;
      let currentItems = newItems;
      let parentItems = newItems;

      for (let i = 0; i < activePath.length - 1; i++) {
        parentItems = currentItems;
        currentItems = currentItems[activePath[i]].subItems;
      }

      itemToMove = currentItems[activePath[activePath.length - 1]];
      if (activePath.length === 1) {
        newItems.splice(activePath[0], 1);
      } else {
        parentItems[activePath[activePath.length - 2]].subItems.splice(
          activePath[activePath.length - 1],
          1
        );
      }

      // Insert item at new position
      currentItems = newItems;
      for (let i = 0; i < overPath.length - 1; i++) {
        currentItems = currentItems[overPath[i]].subItems;
      }

      if (overPath.length === 1) {
        newItems.splice(overPath[0], 0, itemToMove);
      } else {
        parentItems[overPath[overPath.length - 2]].subItems.splice(
          overPath[overPath.length - 1],
          0,
          itemToMove
        );
      }

      onReorder(newItems);
      setActiveId(null);
      setOverId(null);
      setOverDirection(null);
    }
  };

  const getAllItemIds = (items: NavigationItem[]): string[] => {
    return items.reduce((acc: string[], item) => {
      acc.push(item.id);
      if (item.subItems && item.subItems.length > 0) {
        acc.push(...getAllItemIds(item.subItems));
      }
      return acc;
    }, []);
  };

  const findItemById = (
    items: NavigationItem[],
    id: string
  ): NavigationItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.subItems) {
        const found = findItemById(item.subItems, id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeItemById = (
    items: NavigationItem[],
    id: string
  ): NavigationItem[] => {
    return items.reduce((acc: NavigationItem[], item) => {
      if (item.id !== id) {
        const newItem = { ...item };
        if (item.subItems) {
          newItem.subItems = removeItemById(item.subItems, id);
        }
        acc.push(newItem);
      }
      return acc;
    }, []);
  };

  const addItemAsChild = (
    items: NavigationItem[],
    itemToAdd: NavigationItem,
    parentId: string
  ): NavigationItem[] => {
    return items.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: [...(item.subItems || []), { ...itemToAdd, subItems: [] }],
        };
      }
      if (item.subItems) {
        return {
          ...item,
          subItems: addItemAsChild(item.subItems, itemToAdd, parentId),
        };
      }
      return item;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={getAllItemIds(items)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2" role="navigation">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              isEditing={editingItemId === item.id}
              onUpdate={onUpdate}
              onCancel={onCancel}
              editingItemId={editingItemId}
              onAddSubItem={onAddSubItem}
              onDeleteItem={onDeleteItem}
              isBeingDraggedOver={overId === item.id}
              dragOverDirection={overDirection}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default NavigationList;
