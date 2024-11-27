'use client'
import React, { useState } from "react";
import NavigationList from "@/components/NavigationList";
import AddNavigationItem from "@/components/AddNavigationItem";

const initialItems = [
  { id: "1", label: "Home", url: "/" },
  { id: "2", label: "About", url: "/about" },
];

export default function Home() {
  const [items, setItems] = useState(initialItems);

  const handleAddItem = (newItem) => {
    setItems([...items, { id: Date.now().toString(), ...newItem }]);
  };

  const handleEditItem = (id) => {
    //TODO: edit functionality here
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Navigation</h1>
      <AddNavigationItem onAdd={handleAddItem} />
      <NavigationList items={items} onEdit={handleEditItem} />
    </main>
  );
}
