import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import EditNavigationItem from "./EditNavigationItem";
import { useForm } from "react-hook-form";

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
}

const NavigationList: React.FC<NavigationListProps> = ({
  items,
  onEdit,
  editingItemId,
  onUpdate,
  onCancel,
  onAddSubItem,
  onDeleteItem,
}) => {
  return (
    <DndContext onDragEnd={() => console.log("drag finished")}>
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
            onAddSubItem={onAddSubItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>
    </DndContext>
  );
};

const ListItem: React.FC<{
  item: NavigationItem;
  onEdit: (id: string) => void;
  isEditing: boolean;
  onUpdate: (updatedItem: NavigationItem) => void;
  onCancel: () => void;
  editingItemId: string | null;
  onAddSubItem: (newItem: FormData, parentId: string) => void;
  onDeleteItem: (id: string) => void;
}> = ({
  item,
  onEdit,
  isEditing,
  onUpdate,
  onCancel,
  editingItemId,
  onAddSubItem,
  onDeleteItem,
}) => {
  return (
    <li>
      <div>
        <span>{item.label}</span>
        <button onClick={() => onEdit(item.id)}>Edit</button>
        <button onClick={() => onDeleteItem(item.id)}>Usuń</button>
      </div>
      {isEditing && editingItemId === item.id && (
        <EditNavigationItem
          item={item}
          onUpdate={(updatedItem) => {
            onUpdate({ ...updatedItem, id: item.id });
            onCancel();
          }}
          onCancel={onCancel}
        />
      )}
      {item.subItems && item.subItems.length > 0 && (
        <div className="ml-4">
          {item.subItems.map((subItem) => (
            <div className="flex justify-between" key={subItem.id}>
              <span>{subItem.label}</span>
              <div className="space-x-4">
                <button onClick={() => onEdit(subItem.id)}>Edit Sub-item</button>
                <button onClick={() => onDeleteItem(subItem.id, true, item.id)}>
                  Usuń Sub-item
                </button>
              </div>
              {editingItemId === subItem.id && (
                <EditNavigationItem
                  item={subItem}
                  onUpdate={(updatedItem) => {
                    onUpdate({ ...updatedItem, id: subItem.id });
                    onCancel();
                  }}
                  onCancel={onCancel}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

export default NavigationList;
