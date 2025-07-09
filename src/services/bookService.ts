import { Book, SearchFilters, Collection } from '../types/entities';
import { mockBooks, booksForSale } from '../data/mockData';

export class BookService {
  static getAllBooks(): Book[] {
    return mockBooks;
  }

  static getUsedBooks(): Book[] {
    return booksForSale.filter(sale => sale.book).map(sale => sale.book!);
  }

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

  static getLanguages(): string[] {
    return [...new Set(mockBooks.map(book => book.language).filter(Boolean))];
  }

  static advancedSearch(filters: SearchFilters): Book[] {
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
      const matchesCondition = !filters.condition;
      const matchesDistance = !filters.maxDistance;

      return matchesTitle && matchesAuthor && matchesIsbn && matchesGenre && 
             matchesPublisher && matchesYearFrom && matchesYearTo && 
             matchesLanguage && matchesRating && matchesCondition && 
             matchesDistance;
    });
  }

  static getBooksByIds(bookIds: number[]): Book[] {
    return mockBooks.filter(book => bookIds.includes(book.id));
  }

  // These functions are now handled by specialized hooks
  static getFavoriteBooks(favoriteBookIds: number[]): Book[] {
    return mockBooks.filter(book => favoriteBookIds.includes(book.id));
  }

  static getBooksForSale(): Book[] {
    // This is now handled by useBooksForSale hook
    return [];
  }
}

export class CollectionService {
  static getCollectionBooks(collection: Collection, favoriteBookIds: number[] = [], ratedBookIds: number[] = []): Book[] {
    if (String(collection.id) === 'favorites') {
      return BookService.getFavoriteBooks(favoriteBookIds);
    } else if (String(collection.id) === 'books-read') {
      return BookService.getBooksByIds(ratedBookIds);
    } else {
      return BookService.getBooksByIds(collection.bookIds);
    }
  }
}
