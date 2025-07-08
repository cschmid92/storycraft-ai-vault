import { useState, useEffect } from 'react';
import { BookForSale, BookForSaleStatus } from '../types/entities';
import { booksForSale as mockBooksForSale } from '../data/mockData';
import { useBooks } from './useBooks';

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
  const { books } = useBooks();

  // Save to localStorage whenever booksForSale change
  useEffect(() => {
    saveBooksForSale(booksForSale);
  }, [booksForSale]);

  const addBookForSale = (bookId: number, price: number, condition = 'Good') => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const newBookForSale: BookForSale = {
      id: Date.now(),
      sellerId: 999, // Current user ID
      bookId,
      price,
      condition: condition as any,
      location: 'My Location',
      distance: 0,
      status: 'Available',
      book
    };

    setBooksForSale(prev => [...prev, newBookForSale]);
  };

  const removeBookForSale = (bookId: number) => {
    setBooksForSale(prev => prev.filter(sale => 
      !(sale.sellerId === 999 && sale.bookId === bookId)
    ));
  };

  const updateBookForSaleStatus = (saleId: number, status: BookForSaleStatus) => {
    setBooksForSale(prev => prev.map(sale =>
      sale.id === saleId ? { ...sale, status } : sale
    ));
  };

  const updateBookForSale = (saleId: number, updates: Partial<BookForSale>) => {
    setBooksForSale(prev => prev.map(sale =>
      sale.id === saleId ? { ...sale, ...updates } : sale
    ));
  };

  const isBookForSale = (bookId: number): boolean => {
    return booksForSale.some(sale => 
      sale.sellerId === 999 && 
      sale.bookId === bookId && 
      sale.status === 'Available'
    );
  };

  const getMyBooksForSale = () => {
    return booksForSale.filter(sale => sale.sellerId === 999);
  };

  const getCommunityBooksForSale = () => {
    return booksForSale.filter(sale => sale.sellerId !== 999);
  };

  return {
    booksForSale,
    addBookForSale,
    removeBookForSale,
    updateBookForSaleStatus,
    updateBookForSale,
    isBookForSale,
    getMyBooksForSale,
    getCommunityBooksForSale
  };
};