"use client";

import React, { useState } from "react";
import NavigationList from "@/components/NavigationList";
import AddNavigationItem from "@/components/AddNavigationItem";

const initialItems = [];
// { id: "1", label: "Home", url: "/" },
// { id: "2", label: "About", url: "/about" }

export default function Home() {
  const [items, setItems] = useState(initialItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (newItem) => {
    setItems([...items, { id: Date.now().toString(), ...newItem }]);
    setShowAddItem(false);
  };

  const handleEditItem = (id) => {
    setEditingItemId(id);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Navigation</h1>
      {items.length === 0 ? (
        <>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Menu jest puste</h2>
            <p>W tym menu nie ma jeszcze żadnych linków.</p>
            <button
              onClick={() => setShowAddItem(true)}
              className="mt-4 bg-purple-600 text-white p-2 rounded"
            >
              Dodaj pozycję menu
            </button>
          </div>
          {showAddItem && <AddNavigationItem onAdd={handleAddItem} />}
        </>
      ) : (
        <>
          <NavigationList
            items={items}
            onEdit={handleEditItem}
            editingItemId={editingItemId}
            onUpdate={handleUpdateItem}
            onCancel={handleCancelEdit}
          />
          <button
            onClick={() => setShowAddItem(true)}
            className="mt-4 bg-purple-600 text-white p-2 rounded"
          >
            Dodaj pozycję menu
          </button>
          {showAddItem && <AddNavigationItem onAdd={handleAddItem} />}
        </>
      )}
    </main>
  );
}
