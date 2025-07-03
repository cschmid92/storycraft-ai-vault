import { useState, useEffect } from 'react';
import { BookForSale } from '../types/entities';
import { booksForSale as mockBooksForSale } from '../data/mockData';

const BOOKS_FOR_SALE_STORAGE_KEY = 'bacondo-books-for-sale';

const loadBooksForSale = (): BookForSale[] => {
  try {
    const stored = localStorage.getItem(BOOKS_FOR_SALE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading books for sale from localStorage:', error);
  }
  return mockBooksForSale;
};

const saveBooksForSale = (booksForSale: BookForSale[]) => {
  try {
    localStorage.setItem(BOOKS_FOR_SALE_STORAGE_KEY, JSON.stringify(booksForSale));
  } catch (error) {
    console.error('Error saving books for sale to localStorage:', error);
  }
};

export const useBooksForSale = () => {
  const [booksForSale, setBooksForSale] = useState<BookForSale[]>(() => loadBooksForSale());

  // Save to localStorage whenever books for sale change
  useEffect(() => {
    saveBooksForSale(booksForSale);
  }, [booksForSale]);

  // Get my books for sale (sellerId === 999)
  const getMyBooksForSale = (): BookForSale[] => {
    return booksForSale.filter(sale => sale.sellerId === 999 && sale.isActive);
  };

  // Get community books for sale (sellerId !== 999)
  const getCommunityBooksForSale = (): BookForSale[] => {
    return booksForSale.filter(sale => sale.sellerId !== 999 && sale.isActive);
  };

  // Add book to sale
  const addBookToSale = (bookForSale: Omit<BookForSale, 'id'>) => {
    const newBookForSale: BookForSale = {
      ...bookForSale,
      id: Date.now()
    };
    setBooksForSale(prev => [...prev, newBookForSale]);
  };

  // Remove book from sale
  const removeBookFromSale = (saleId: number) => {
    setBooksForSale(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, isActive: false } : sale
    ));
  };

  // Update book for sale
  const updateBookForSale = (saleId: number, updates: Partial<BookForSale>) => {
    setBooksForSale(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, ...updates } : sale
    ));
  };

  // Reset to initial mock data
  const resetToMockData = () => {
    setBooksForSale(mockBooksForSale);
    localStorage.removeItem(BOOKS_FOR_SALE_STORAGE_KEY);
  };

  return {
    booksForSale,
    getMyBooksForSale,
    getCommunityBooksForSale,
    addBookToSale,
    removeBookFromSale,
    updateBookForSale,
    resetToMockData
  };
};