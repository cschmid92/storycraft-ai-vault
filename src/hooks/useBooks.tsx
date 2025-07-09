
import { useState, useEffect } from 'react';
import { Book } from '../types/entities';
import { BookService } from '../services/bookService';

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
  return BookService.getAllBooks();
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

  // These are now handled by separate hooks

  return {
    books,
    updateBook
  };
};
