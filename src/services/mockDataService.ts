
// Legacy service - kept for backward compatibility
// New code should use BookService from bookService.ts
import { Book } from '../types/entities';
import { mockBooks } from '../data/mockData';
import { BookService } from './bookService';

// Re-export for backward compatibility
export { mockBooks };

// Search Service - delegating to new BookService
export class SearchService {
  static searchBooks(query: string, genre?: string): Book[] {
    return BookService.searchBooks(query, genre);
  }

  static getGenres(): string[] {
    return BookService.getGenres();
  }

  static advancedSearch(filters: {
    title?: string;
    author?: string;
    isbn?: string;
    genre?: string;
    publisher?: string;
    yearFrom?: number;
    yearTo?: number;
    language?: string;
    ratingMin?: number;
  }): Book[] {
    return BookService.advancedSearch(filters);
  }
}
