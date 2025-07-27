import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BooksRead } from '../types/entities';
import { mockBooksRead } from '../data/mockData';

const BOOKS_READ_STORAGE_KEY = 'bacondo-books-read';

const loadBooksRead = (): BooksRead => {
  try {
    const stored = localStorage.getItem(BOOKS_READ_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
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

interface BooksReadContextType {
  booksRead: BooksRead;
  booksReadList: number[];
  addToBooksRead: (bookId: number) => void;
  isInBooksRead: (bookId: number) => boolean;
  getBooksReadCount: () => number;
  getBooksReadList: () => number[];
}

const BooksReadContext = createContext<BooksReadContextType | undefined>(undefined);

export const BooksReadProvider = ({ children }: { children: ReactNode }) => {
  const [booksRead, setBooksRead] = useState<BooksRead>(() => loadBooksRead());

  // Save to localStorage whenever booksRead changes
  useEffect(() => {
    saveBooksRead(booksRead);
  }, [booksRead]);

  const addToBooksRead = (bookId: number) => {
    setBooksRead(prev => {
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

  return (
    <BooksReadContext.Provider value={{
      booksRead,
      booksReadList: booksRead?.bookIds || [],
      addToBooksRead,
      isInBooksRead,
      getBooksReadCount,
      getBooksReadList
    }}>
      {children}
    </BooksReadContext.Provider>
  );
};

export const useBooksRead = () => {
  const context = useContext(BooksReadContext);
  if (context === undefined) {
    throw new Error('useBooksRead must be used within a BooksReadProvider');
  }
  return context;
};