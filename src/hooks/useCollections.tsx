import { useState, useEffect } from 'react';
import { Collection } from '../types/entities';

const defaultCollections: Collection[] = [
  { 
    id: 2, 
    name: "To Read 📚", 
    count: 0, 
    color: "bg-blue-500", 
    bookIds: [],
    description: "Books I want to read",
    userId: 999
  },
  { 
    id: 3, 
    name: "Classics", 
    count: 0, 
    color: "bg-amber-500", 
    bookIds: [],
    description: "Classic literature collection",
    userId: 999
  },
  { 
    id: 4, 
    name: "Sci-Fi Adventures", 
    count: 0, 
    color: "bg-purple-500", 
    bookIds: [],
    description: "Science fiction favorites",
    userId: 999
  }
];

// Export collectionBookMappings for backward compatibility
export const collectionBookMappings: Record<number, number[]> = {};

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
    // Update collectionBookMappings for backward compatibility
    collections.forEach(collection => {
      if (typeof collection.id === 'number') {
        collectionBookMappings[collection.id] = collection.bookIds || [];
      }
    });
  }, [collections]);

  const addCollection = (name: string, color: string, description?: string) => {
    const newCollection: Collection = {
      id: Date.now(),
      name,
      count: 0,
      color,
      bookIds: [],
      description,
      userId: 999,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCollections(prev => [...prev, newCollection]);
    console.log('Created new collection:', name);
  };

  const deleteCollection = (collectionId: number | string) => {
    console.log('Deleting collection with ID:', collectionId, 'Type:', typeof collectionId);
    
    setCollections(prev => {
      const filtered = prev.filter(c => {
        const matches = String(c.id) === String(collectionId);
        console.log(`Collection ${c.id} (${c.name}) matches ${collectionId}:`, matches);
        return !matches;
      });
      
      console.log('Collections before deletion:', prev.length);
      console.log('Collections after deletion:', filtered.length);
      
      return filtered;
    });
    
    console.log('Deleted collection:', collectionId);
  };

  const updateCollection = (collectionId: number | string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, ...updates, updatedAt: new Date() } : c
    ));
    console.log('Updated collection:', collectionId, updates);
  };

  const addBookToCollection = (collectionId: number | string, bookId: number) => {
    console.log(`addBookToCollection called: ${collectionId}, ${bookId}`);
    setCollections(prev => {
      const updated = prev.map(c => {
        if (c.id === collectionId) {
          const bookIds = c.bookIds || [];
          if (!bookIds.includes(bookId)) {
            const newBookIds = [...bookIds, bookId];
            console.log(`Added book ${bookId} to collection ${c.name}. New count: ${newBookIds.length}`);
            return { ...c, bookIds: newBookIds, count: newBookIds.length, updatedAt: new Date() };
          } else {
            console.log(`Book ${bookId} already in collection ${c.name}`);
          }
        }
        return c;
      });
      console.log('Collections after add:', updated.map(c => ({ name: c.name, count: c.bookIds?.length || 0 })));
      return updated;
    });
  };

  const removeBookFromCollection = (collectionId: number | string, bookId: number) => {
    console.log(`removeBookFromCollection called: ${collectionId}, ${bookId}`);
    setCollections(prev => {
      const updated = prev.map(c => {
        if (c.id === collectionId) {
          const bookIds = c.bookIds || [];
          const newBookIds = bookIds.filter(id => id !== bookId);
          console.log(`Removed book ${bookId} from collection ${c.name}. New count: ${newBookIds.length}`);
          return { ...c, bookIds: newBookIds, count: newBookIds.length, updatedAt: new Date() };
        }
        return c;
      });
      console.log('Collections after remove:', updated.map(c => ({ name: c.name, count: c.bookIds?.length || 0 })));
      return updated;
    });
  };

  const isBookInCollection = (collectionId: number | string, bookId: number): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    const result = collection?.bookIds?.includes(bookId) || false;
    return result;
  };

  const getCollectionBooks = (collectionId: number | string): number[] => {
    const collection = collections.find(c => c.id === collectionId);
    return collection?.bookIds || [];
  };

  return {
    collections,
    addCollection,
    deleteCollection,
    updateCollection,
    addBookToCollection,
    removeBookFromCollection,
    isBookInCollection,
    getCollectionBooks
  };
};

// Re-export Collection type for components
export type { Collection };
