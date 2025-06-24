
import { useState, useEffect } from 'react';
import { Book } from '../types/Book';

// Mock books data
const defaultBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    isFavorite: true,
    isOwnedForSale: false,
    isbn10: "0743273567",
    isbn13: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    language: "English"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    rating: 4.5,
    genre: "Fiction",
    year: 1960,
    description: "A powerful story of racial injustice and childhood innocence in the American South.",
    isFavorite: true,
    isOwnedForSale: false,
    isbn10: "0061120081",
    isbn13: "978-0061120084",
    publisher: "Harper Perennial Modern Classics",
    pages: 376,
    language: "English"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    rating: 4.4,
    genre: "Classic Literature",
    year: 1949,
    description: "A dystopian social science fiction novel about totalitarian control.",
    isFavorite: false,
    isOwnedForSale: false,
    isbn10: "0451524934",
    isbn13: "978-0451524935",
    publisher: "Signet Classics",
    pages: 328,
    language: "English"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.3,
    genre: "Classic Literature",
    year: 1813,
    description: "A romantic novel of manners set in Georgian England.",
    isFavorite: false,
    isOwnedForSale: false,
    isbn10: "0141439513",
    isbn13: "978-0141439518",
    publisher: "Penguin Classics",
    pages: 432,
    language: "English"
  }
];

const BOOKS_STORAGE_KEY = 'bacondo-books';

const loadBooks = (): Book[] => {
  try {
    const stored = localStorage.getItem(BOOKS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading books from localStorage:', error);
  }
  return defaultBooks;
};

const saveBooks = (books: Book[]) => {
  try {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving books to localStorage:', error);
  }
};

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>(() => loadBooks());

  // Save to localStorage whenever books change
  useEffect(() => {
    saveBooks(books);
  }, [books]);

  const updateBook = (bookId: number, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    ));
  };

  const toggleFavorite = (bookId: number) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
    ));
  };

  const toggleOwnedForSale = (bookId: number, price?: number) => {
    setBooks(prev => prev.map(book =>
      book.id === bookId 
        ? { ...book, isOwnedForSale: !book.isOwnedForSale, salePrice: price }
        : book
    ));
  };

  const rateBook = (bookId: number, rating: number) => {
    setBooks(prev => prev.map(book =>
      book.id === bookId 
        ? { ...book, userRating: rating }
        : book
    ));
  };

  return {
    books,
    updateBook,
    toggleFavorite,
    toggleOwnedForSale,
    rateBook
  };
};
