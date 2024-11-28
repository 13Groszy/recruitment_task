import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
  onDeleteItem: (id: string) => void;
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
  const sensors = useSensors(
    useSensor(PointerSensor),
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
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
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2" role="navigation">
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
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default NavigationList;
