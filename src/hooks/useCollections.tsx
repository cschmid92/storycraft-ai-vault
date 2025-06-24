
import { useState, useEffect } from 'react';
import { Collection } from '../types/entities';

const defaultCollections: Collection[] = [
  { 
    id: 2, 
    name: "To Read 📚", 
    count: 3, 
    color: "bg-blue-500", 
    bookIds: [1, 3, 4],
    description: "Books I want to read"
  },
  { 
    id: 3, 
    name: "Classics", 
    count: 3, 
    color: "bg-amber-500", 
    bookIds: [1, 2, 4],
    description: "Classic literature collection"
  },
  { 
    id: 4, 
    name: "Sci-Fi Adventures", 
    count: 2, 
    color: "bg-purple-500", 
    bookIds: [2, 3],
    description: "Science fiction favorites"
  }
];

const STORAGE_KEY = 'bacondo-collections';

const loadCollections = (): Collection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading collections from localStorage:', error);
  }
  return defaultCollections;
};

const saveCollections = (collections: Collection[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (error) {
    console.error('Error saving collections to localStorage:', error);
  }
};

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>(() => loadCollections());

  // Save to localStorage whenever collections change
  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  const addCollection = (name: string, color: string, description?: string) => {
    const newCollection: Collection = {
      id: Date.now(),
      name,
      count: 0,
      color,
      bookIds: [],
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const deleteCollection = (collectionId: number | string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };

  const updateCollection = (collectionId: number | string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, ...updates, updatedAt: new Date() } : c
    ));
  };

  const addBookToCollection = (collectionId: number | string, bookId: number) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        const bookIds = c.bookIds || [];
        if (!bookIds.includes(bookId)) {
          const newBookIds = [...bookIds, bookId];
          return { ...c, bookIds: newBookIds, count: newBookIds.length, updatedAt: new Date() };
        }
      }
      return c;
    }));
  };

  const removeBookFromCollection = (collectionId: number | string, bookId: number) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        const bookIds = c.bookIds || [];
        const newBookIds = bookIds.filter(id => id !== bookId);
        return { ...c, bookIds: newBookIds, count: newBookIds.length, updatedAt: new Date() };
      }
      return c;
    }));
  };

  return {
    collections,
    addCollection,
    deleteCollection,
    updateCollection,
    addBookToCollection,
    removeBookFromCollection
  };
};
