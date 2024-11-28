import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditNavigationItem from "./EditNavigationItem";

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
}) => {
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
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`p-2 border rounded-lg bg-white ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab px-2 py-1 hover:bg-gray-100 rounded"
          >
            ⋮⋮
          </button>
          <span>{item.label}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item.id)}
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            Edytuj
          </button>
          <button
            onClick={() => onDeleteItem(item.id, isSubItem, parentId)}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            Usuń
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
      {item.subItems && item.subItems.length > 0 && (
        <div className="ml-8 mt-2 border-l-2 pl-4">
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
    </li>
  );
};
