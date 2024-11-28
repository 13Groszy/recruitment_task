"use client";

import React, { useState } from "react";
import NavigationList from "@/components/NavigationList";
import AddNavigationItem from "@/components/AddNavigationItem";

const initialItems = [
  {
    id: "1",
    label: "Test",
    url: "https://www.google.com",
    subItems: [],
  },
  {
    id: "2",
    label: "John",
    url: "https://www.google.com",
    subItems: [
      {
        id: "2-1",
        label: "Premiere",
        url: "https://www.google.com",
        subItems: [],
      },
      {
        id: "2-2",
        label: "Ultra",
        url: "https://www.google.com",
        subItems: [],
      },
    ],
  },
  {
    id: "3",
    label: "Placeholder",
    url: "https://www.google.com",
    subItems: [
      {
        id: "3-1",
        label: "Consulting",
        url: "https://www.google.com",
        subItems: [],
      },
      {
        id: "3-2",
        label: "Development",
        url: "https://www.google.com",
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
  const addSubItemRecursively = (items: NavigationItem[]): NavigationItem[] => {
    return items.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: [
            ...item.subItems,
            { id: Date.now().toString(), ...newItem, subItems: [] },
          ],
        };
      }
      if (item.subItems && item.subItems.length > 0) {
        return {
          ...item,
          subItems: addSubItemRecursively(item.subItems),
        };
      }
      return item;
    });
  };

  setItems(addSubItemRecursively(items));
};

  const handleDeleteItem = (
    id: string,
    isSubItem: boolean = false,
    parentId?: string
  ) => {
    const deleteItemRecursively = (
      items: NavigationItem[]
    ): NavigationItem[] => {
      return items.reduce((acc: NavigationItem[], item) => {
        if (item.id === id) {
          return acc;
        }

        const newItem = { ...item };
        if (item.subItems && item.subItems.length > 0) {
          newItem.subItems = deleteItemRecursively(item.subItems);
        }

        if (item.id === parentId) {
          newItem.subItems = item.subItems.filter(
            (subItem) => subItem.id !== id
          );
        }

        acc.push(newItem);
        return acc;
      }, []);
    };

    setItems(deleteItemRecursively(items));
  };

  return (
    <main className="p-4 w-full max-w-screen-lg mx-auto">
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
            className="mt-4 px-4 py-2 text-gray-700 font-medium bg-white hover:bg-gray-50 border rounded-xl"
          >
            Dodaj pozycję menu
          </button>
          {showAddItem && <AddNavigationItem onAdd={handleAddItem} />}
        </>
      )}
    </main>
  );
}