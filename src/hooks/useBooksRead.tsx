import { useState, useEffect } from 'react';
import { BooksRead } from '../types/entities';
import { mockBooksRead } from '../data/mockData';

const BOOKS_READ_STORAGE_KEY = 'bacondo-books-read';

const loadBooksRead = (): BooksRead => {
  try {
    const stored = localStorage.getItem(BOOKS_READ_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure the structure is correct
      if (parsed && Array.isArray(parsed.bookIds)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading books read from localStorage:', error);
  }
  return mockBooksRead;
};

const saveBooksRead = (booksRead: BooksRead) => {
  try {
    localStorage.setItem(BOOKS_READ_STORAGE_KEY, JSON.stringify(booksRead));
  } catch (error) {
    console.error('Error saving books read to localStorage:', error);
  }
};

export const useBooksRead = () => {
  const [booksRead, setBooksRead] = useState<BooksRead>(() => loadBooksRead());

  // Save to localStorage whenever booksRead changes
  useEffect(() => {
    saveBooksRead(booksRead);
  }, [booksRead]);

  const addToBooksRead = (bookId: number) => {
    setBooksRead(prev => {
      // Ensure prev has the correct structure
      const currentBookIds = prev?.bookIds || [];
      
      if (currentBookIds.includes(bookId)) {
        console.log(`Removing book ${bookId} from Books read`);
        return {
          ...prev,
          bookIds: currentBookIds.filter(id => id !== bookId)
        };
      } else {
        console.log(`Adding book ${bookId} to Books read`);
        return {
          ...prev,
          bookIds: [...currentBookIds, bookId]
        };
      }
    });
  };

  const isInBooksRead = (bookId: number): boolean => {
    return booksRead?.bookIds?.includes(bookId) || false;
  };

  const getBooksReadCount = (): number => {
    return booksRead?.bookIds?.length || 0;
  };

  const getBooksReadList = (): number[] => {
    return booksRead?.bookIds || [];
  };

  return {
    booksRead,
    booksReadList: booksRead?.bookIds || [],
    addToBooksRead,
    isInBooksRead,
    getBooksReadCount,
    getBooksReadList
  };
};