import React from "react";
import { useDraggable } from '@dnd-kit/core';
import EditNavigationItem from "./EditNavigationItem";

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
}

const NavigationList: React.FC<NavigationListProps> = ({ items, onEdit, editingItemId, onUpdate, onCancel }) => {
  return (
    <ul className="space-y-2" role="navigation">
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          isEditing={editingItemId === item.id}
          onUpdate={onUpdate}
          onCancel={onCancel}
          editingItemId={editingItemId}
        />
      ))}
    </ul>
  );
};

const ListItem: React.FC<{
  item: NavigationItem;
  onEdit: (id: string) => void;
  isEditing: boolean;
  onUpdate: (updatedItem: NavigationItem) => void;
  onCancel: () => void;
  editingItemId: string | null;
}> = ({ item, onEdit, isEditing, onUpdate, onCancel, editingItemId }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
  });

  return (
    <li ref={setNodeRef} className="flex flex-col p-2 border rounded">
      <div className="flex items-center">
        <div {...attributes} {...listeners} className="cursor-grab p-2">
          <span className="drag_icon">+</span>
        </div>
        <div className="flex justify-between items-center flex-grow">
          <div className="flex flex-col">
            <span className="font-bold">{item.label}</span>
            <span>{item.url}</span>
          </div>
          <button onClick={() => onEdit(item.id)} className="text-blue-500">
            Edit
          </button>
        </div>
      </div>
      {isEditing && (
        <EditNavigationItem
          item={item}
          onUpdate={(updatedItem) => {
            onUpdate({ ...updatedItem, id: item.id });
            onCancel();
          }}
          onCancel={onCancel}
        />
      )}
      {item.subItems.length > 0 && (
        <NavigationList
          items={item.subItems}
          onEdit={onEdit}
          editingItemId={editingItemId}
          onUpdate={onUpdate}
          onCancel={onCancel}
        />
      )}
    </li>
  );
};

export default NavigationList;
