
import { Book } from '../types/Book';

// Mock Books Data - Single source of truth
export const mockBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    isFavorite: false,
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
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    isFavorite: true,
    isOwnedForSale: false,
    isbn10: "0061120081",
    isbn13: "978-0061120084",
    publisher: "Harper Perennial",
    pages: 376,
    language: "English"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    rating: 4.4,
    genre: "Dystopian Fiction",
    year: 1949,
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 12.99,
    isbn10: "0451524934",
    isbn13: "978-0451524935",
    publisher: "Signet Classic",
    pages: 328,
    language: "English"
  }
];

// Search Service
export class SearchService {
  static searchBooks(query: string, genre?: string): Book[] {
    return mockBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(query.toLowerCase()) ||
                           book.author.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = !genre || book.genre === genre;
      return matchesSearch && matchesGenre;
    });
  }

  static getGenres(): string[] {
    return [...new Set(mockBooks.map(book => book.genre))];
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
    return mockBooks.filter(book => {
      const matchesTitle = !filters.title || book.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchesAuthor = !filters.author || book.author.toLowerCase().includes(filters.author.toLowerCase());
      const matchesIsbn = !filters.isbn || book.isbn10?.includes(filters.isbn) || book.isbn13?.includes(filters.isbn);
      const matchesGenre = !filters.genre || book.genre === filters.genre;
      const matchesPublisher = !filters.publisher || book.publisher?.toLowerCase().includes(filters.publisher.toLowerCase());
      const matchesYearFrom = !filters.yearFrom || book.year >= filters.yearFrom;
      const matchesYearTo = !filters.yearTo || book.year <= filters.yearTo;
      const matchesLanguage = !filters.language || book.language === filters.language;
      const matchesRating = !filters.ratingMin || book.rating >= filters.ratingMin;

      return matchesTitle && matchesAuthor && matchesIsbn && matchesGenre && 
             matchesPublisher && matchesYearFrom && matchesYearTo && 
             matchesLanguage && matchesRating;
    });
  }
}

// Data Service - centralized data management
export class DataService {
  static getBooks(): Book[] {
    return mockBooks;
  }

  static getBook(id: number): Book | undefined {
    return mockBooks.find(book => book.id === id);
  }

  static getFavoriteBooks(): Book[] {
    return mockBooks.filter(book => book.isFavorite);
  }

  static getBooksForSale(): Book[] {
    return mockBooks.filter(book => book.isOwnedForSale && book.salePrice);
  }
}
