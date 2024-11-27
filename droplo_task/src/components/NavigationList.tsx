import React from "react";
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
