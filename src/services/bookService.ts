
import { Book, SearchFilters, Collection } from '../types/entities';
import { mockBooks, mockUsedBooks } from '../data/mockData';

export class BookService {
  static getAllBooks(): Book[] {
    return mockBooks;
  }

  static getUsedBooks(): Book[] {
    return mockUsedBooks;
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
      const matchesCondition = !filters.condition || book.condition === filters.condition;
      const matchesPrice = !filters.priceMax || !book.salePrice || book.salePrice <= filters.priceMax;
      const matchesDistance = !filters.maxDistance || !book.distance || book.distance <= filters.maxDistance;

      return matchesTitle && matchesAuthor && matchesIsbn && matchesGenre && 
             matchesPublisher && matchesYearFrom && matchesYearTo && 
             matchesLanguage && matchesRating && matchesCondition && 
             matchesPrice && matchesDistance;
    });
  }

  static getBooksByIds(bookIds: number[]): Book[] {
    return mockBooks.filter(book => bookIds.includes(book.id as number));
  }

  static getFavoriteBooks(): Book[] {
    return mockBooks.filter(book => book.isFavorite);
  }

  static getBooksForSale(): Book[] {
    return mockBooks.filter(book => book.isOwnedForSale && book.salePrice);
  }
}

export class CollectionService {
  static getCollectionBooks(collection: Collection): Book[] {
    if (collection.id === 'favorites') {
      return BookService.getFavoriteBooks();
    } else if (collection.id === 'books-read') {
      return mockBooks.filter(book => book.userRating && book.userRating > 0);
    } else {
      return BookService.getBooksByIds(collection.bookIds);
    }
  }
}
