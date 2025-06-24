
import { Book } from '../types/entities';

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
    isOwnedForSale: true,
    salePrice: 12.99,
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
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    rating: 3.8,
    genre: "Coming-of-age Fiction",
    year: 1951,
    description: "A controversial novel about teenage rebellion and alienation.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 8.99,
    condition: "Good",
    location: "New York, NY",
    distance: 2.3,
    isbn10: "0316769174",
    isbn13: "978-0316769174",
    publisher: "Little, Brown and Company",
    pages: 277,
    language: "English"
  }
];

export const mockUsedBooks: Book[] = mockBooks.filter(book => book.isOwnedForSale).map(book => ({
  ...book,
  condition: book.condition || "Very Good",
  location: book.location || "Local Area",
  distance: book.distance || Math.random() * 10 + 1
}));
