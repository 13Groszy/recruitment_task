"use client";

import React, { useState } from "react";
import NavigationList from "@/components/NavigationList";
import AddNavigationItem from "@/components/AddNavigationItem";

const initialItems = [
  {
    id: "1",
    label: "Home",
    url: "/",
    subItems: [],
  },
  {
    id: "2",
    label: "About",
    url: "/about",
    subItems: [
      {
        id: "2-1",
        label: "Team",
        url: "/about/team",
        subItems: [],
      },
      {
        id: "2-2",
        label: "History",
        url: "/about/history",
        subItems: [],
      },
    ],
  },
  {
    id: "3",
    label: "Services",
    url: "/services",
    subItems: [
      {
        id: "3-1",
        label: "Consulting",
        url: "/services/consulting",
        subItems: [],
      },
      {
        id: "3-2",
        label: "Development",
        url: "/services/development",
        subItems: [],
      },
    ],
  },
];

type NavigationItem = {
  id: string;
  label: string;
  url: string;
  subItems: NavigationItem[];
};

export default function Home() {
  const [items, setItems] = useState(initialItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (newItem, parentId?: string) => {
    if (parentId) {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subItems: [
                ...item.subItems,
                { id: Date.now().toString(), ...newItem, subItems: [] },
              ],
            };
          }
          return item;
        })
      );
    } else {
      setItems([
        ...items,
        { id: Date.now().toString(), ...newItem, subItems: [] },
      ]);
    }
    setShowAddItem(false);
  };

  const handleEditItem = (id: string) => {
    setEditingItemId(id);
  };

  const handleReorder = (newItems: NavigationItem[]) => {
    setItems(newItems);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.map((subItem) =>
              subItem.id === updatedItem.id ? updatedItem : subItem
            ),
          };
        }
        return item;
      })
    );
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleAddSubItem = (newItem, parentId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            subItems: [
              ...item.subItems,
              { id: Date.now().toString(), ...newItem },
            ],
          };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (
    id: string,
    isSubItem: boolean = false,
    parentId?: string
  ) => {
    setItems((prevItems) => {
      if (isSubItem && parentId) {
        return prevItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subItems: item.subItems.filter((subItem) => subItem.id !== id),
            };
          }
          return item;
        });
      }
      return prevItems.filter((item) => item.id !== id);
    });
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
            onAddSubItem={handleAddSubItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorder}
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
