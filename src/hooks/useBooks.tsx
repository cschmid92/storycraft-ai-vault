
import { useState, useEffect } from 'react';
import { Book } from '../types/entities';
import { BookService } from '../services/bookService';
import { useUserRatings } from './useUserRatings';

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
  const { userRatings } = useUserRatings();

  // Save to localStorage whenever books change
  useEffect(() => {
    saveBooks(books);
  }, [books]);

  // Calculate average rating including user ratings
  const calculateAverageRating = (bookId: number, originalRating: number): number => {
    const bookUserRatings = userRatings.filter(rating => rating.bookId === bookId);
    
    if (bookUserRatings.length === 0) {
      return originalRating;
    }

    // Combine original rating with user ratings
    // Assume original rating represents some base number of ratings (e.g., 10)
    const baseRatingWeight = 10;
    const totalRatingSum = (originalRating * baseRatingWeight) + 
                          bookUserRatings.reduce((sum, r) => sum + r.rating, 0);
    const totalRatingCount = baseRatingWeight + bookUserRatings.length;
    
    return Math.round((totalRatingSum / totalRatingCount) * 10) / 10;
  };

  // Get books with updated average ratings
  const getBooksWithUpdatedRatings = (): Book[] => {
    return books.map(book => ({
      ...book,
      rating: calculateAverageRating(book.id, book.rating)
    }));
  };

  const updateBook = (bookId: number, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    ));
  };

  const rateBook = (bookId: number, rating: number) => {
    // This will trigger a re-render which will update the average rating
    // The actual user rating is handled by useUserRatings hook
    setBooks(prev => [...prev]); // Force re-render to recalculate ratings
  };

  return {
    books: getBooksWithUpdatedRatings(),
    updateBook,
    rateBook
  };
};
