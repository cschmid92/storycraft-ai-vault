
export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  year: number;
  description: string;
  isFavorite: boolean;
  isOwnedForSale: boolean;
  salePrice?: number;
  userRating?: number;
  isbn10?: string;
  isbn13?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  binding?: string;
  listPrice?: number;
  synopsis?: string;
  subject?: string;
  condition?: string;
}
