import { useState, useEffect } from 'react';

const BOOKS_READ_STORAGE_KEY = 'bacondo-books-read';

const loadBooksRead = (): number[] => {
  try {
    const stored = localStorage.getItem(BOOKS_READ_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading books read from localStorage:', error);
  }
  return []; // Start with empty array instead of hardcoded values
};

const saveBooksRead = (booksRead: number[]) => {
  try {
    localStorage.setItem(BOOKS_READ_STORAGE_KEY, JSON.stringify(booksRead));
  } catch (error) {
    console.error('Error saving books read to localStorage:', error);
  }
};

export const useBooksRead = () => {
  const [booksReadList, setBooksReadList] = useState<number[]>(() => loadBooksRead());

  // Save to localStorage whenever booksReadList changes
  useEffect(() => {
    saveBooksRead(booksReadList);
  }, [booksReadList]);

  const addToBooksRead = (bookId: number) => {
    setBooksReadList(prev => {
      if (prev.includes(bookId)) {
        console.log(`Removing book ${bookId} from Books read`);
        return prev.filter(id => id !== bookId);
      } else {
        console.log(`Adding book ${bookId} to Books read`);
        return [...prev, bookId];
      }
    });
  };

  const isInBooksRead = (bookId: number): boolean => {
    return booksReadList.includes(bookId);
  };

  const getBooksReadCount = (): number => {
    return booksReadList.length;
  };

  return {
    booksReadList,
    addToBooksRead,
    isInBooksRead,
    getBooksReadCount
  };
};