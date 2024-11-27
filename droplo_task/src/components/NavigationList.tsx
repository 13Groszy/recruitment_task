import React from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

interface NavigationItem {
  id: string;
  label: string;
  url?: string;
}

interface NavigationListProps {
  items: NavigationItem[];
  onEdit: (id: string) => void;
}

const NavigationList: React.FC<NavigationListProps> = ({ items, onEdit }) => {
  return (
    <DndContext>
      <ul className="space-y-2">
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} onEdit={onEdit} />
        ))}
      </ul>
    </DndContext>
  );
};

const DraggableItem: React.FC<{
  item: NavigationItem;
  onEdit: (id: string) => void;
}> = ({ item, onEdit }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex justify-between items-center p-2 border rounded"
    >
      <span>{item.label}</span>
      <button onClick={() => onEdit(item.id)} className="text-blue-500">
        Edit
      </button>
    </li>
  );
};

export default NavigationList;
