import {useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditNavigationItem from "./EditNavigationItem";
import AddNavigationItem from "./AddNavigationItem";
import MoveIcon from "./MoveIcon";

interface SortableItemProps {
  item: NavigationItem;
  onEdit: (id: string) => void;
  isEditing: boolean;
  onUpdate: (updatedItem: NavigationItem) => void;
  onCancel: () => void;
  editingItemId: string | null;
  onAddSubItem: (newItem: FormData, parentId: string) => void;
  onDeleteItem: (id: string, isSubItem?: boolean, parentId?: string) => void;
  parentId?: string;
  isSubItem?: boolean;
  isBeingDraggedOver?: boolean;
  dragOverDirection?: "top" | "bottom" | "inside" | null;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  item,
  onEdit,
  isEditing,
  onUpdate,
  onCancel,
  editingItemId,
  onAddSubItem,
  onDeleteItem,
  parentId,
  isSubItem = false,
  isBeingDraggedOver,
  dragOverDirection,
}) => {
    const [showAddSubItem, setShowAddSubItem] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    width: "100%",
    maxWidth: "100%",
    transformOrigin: "0 0",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-lg bg-white w-full ${
        isDragging ? "shadow-lg z-50" : ""
      } 
  ${
    isBeingDraggedOver && dragOverDirection === "inside"
      ? "border-2 border-blue-500"
      : ""
  }`}
    >
      {isBeingDraggedOver && dragOverDirection === "top" && (
        <div className="absolute top-0 left-0 right-0 h-1 -translate-y-1" />
      )}
      {isBeingDraggedOver && dragOverDirection === "bottom" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 translate-y-1" />
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab px-2 py-1 hover:bg-gray-100 rounded mt-1"
          >
            <MoveIcon />
          </button>
          <div className="flex flex-col">
            <span className="font-medium">{item.label}</span>
            {item.url && (
              <span className="text-sm text-gray-500">{item.url}</span>
            )}
          </div>
        </div>
        <div className="flex border rounded-xl">
          <button
            onClick={() => onDeleteItem(item.id, isSubItem, parentId)}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-l-xl"
          >
            Usuń
          </button>
          <button
            onClick={() => onEdit(item.id)}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 border-x"
          >
            Edytuj
          </button>
          <button
            onClick={() => setShowAddSubItem(true)}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-r-xl"
          >
            Dodaj pozycję menu
          </button>
        </div>
      </div>
      {isEditing && editingItemId === item.id && (
        <div className="mt-2">
          <EditNavigationItem
            item={item}
            onUpdate={(updatedItem) => {
              onUpdate({ ...updatedItem, id: item.id });
              onCancel();
            }}
            onCancel={onCancel}
          />
        </div>
      )}
      {showAddSubItem && (
        <div className="mt-2">
          <AddNavigationItem
            onAdd={(newItem) => {
              onAddSubItem(newItem, item.id);
              setShowAddSubItem(false);
            }}
            parentId={item.id}
          />
        </div>
      )}
      {item.subItems && item.subItems.length > 0 && (
        <div className="ml-8 mt-6 pl-4 flex flex-col gap-2">
          {item.subItems.map((subItem) => (
            <SortableItem
              key={subItem.id}
              item={subItem}
              onEdit={onEdit}
              isEditing={editingItemId === subItem.id}
              onUpdate={onUpdate}
              onCancel={onCancel}
              editingItemId={editingItemId}
              onAddSubItem={onAddSubItem}
              onDeleteItem={onDeleteItem}
              parentId={item.id}
              isSubItem={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
