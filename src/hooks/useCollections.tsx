
import { useState } from 'react';

export interface Collection {
  id: number | string;
  name: string;
  count: number;
  color: string;
  bookIds?: number[]; // Add bookIds to track which books are in this collection
}

// Mock collection mappings - in a real app this would come from a database
export const collectionBookMappings: { [key: number]: number[] } = {
  2: [1, 3, 4], // "To Read" collection has books 1, 3, 4
  3: [1, 2, 4], // "Classics" collection has books 1, 2, 4
  4: [2, 3] // "Sci-Fi Adventures" collection has books 2, 3
};

const mockCollections = [
  { id: 2, name: "To Read 📚", count: 3, color: "bg-blue-500", bookIds: [1, 3, 4] },
  { id: 3, name: "Classics", count: 3, color: "bg-amber-500", bookIds: [1, 2, 4] },
  { id: 4, name: "Sci-Fi Adventures", count: 2, color: "bg-purple-500", bookIds: [2, 3] }
];

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);

  const addCollection = (name: string, color: string) => {
    const newCollection = {
      id: Date.now(),
      name,
      count: 0,
      color,
      bookIds: []
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const deleteCollection = (collectionId: number | string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };

  const updateCollection = (collectionId: number | string, name: string, color: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, name, color } : c
    ));
  };

  const updateCollectionCount = (collectionId: number | string, count: number) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, count } : c
    ));
  };

  const addBookToCollection = (collectionId: number | string, bookId: number) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        const bookIds = c.bookIds || [];
        if (!bookIds.includes(bookId)) {
          const newBookIds = [...bookIds, bookId];
          return { ...c, bookIds: newBookIds, count: newBookIds.length };
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
        return { ...c, bookIds: newBookIds, count: newBookIds.length };
      }
      return c;
    }));
  };

  return {
    collections,
    addCollection,
    deleteCollection,
    updateCollection,
    updateCollectionCount,
    addBookToCollection,
    removeBookFromCollection
  };
};
