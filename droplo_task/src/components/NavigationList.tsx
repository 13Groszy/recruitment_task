import React from "react";
import EditNavigationItem from "./EditNavigationItem";

interface NavigationItem {
  id: string;
  label: string;
  url?: string;
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
    <ul className="space-y-2">
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          isEditing={editingItemId === item.id}
          onUpdate={onUpdate}
          onCancel={onCancel}
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
}> = ({ item, onEdit, isEditing, onUpdate, onCancel }) => {
  return (
    <li className="flex flex-col p-2 border rounded">
      <div className="flex justify-between items-center">
        <span>{item.label}</span>
        <button onClick={() => onEdit(item.id)} className="text-blue-500">
          Edit
        </button>
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
    </li>
  );
};

export default NavigationList;
