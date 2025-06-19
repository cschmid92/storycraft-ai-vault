
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
  isOwnedForSale?: boolean;
  salePrice?: number;
  isbn10?: string;
  isbn13?: string;
  publicationDate?: string;
  publisher?: string;
  binding?: string;
  pages?: number;
  listPrice?: number;
  language?: string;
  edition?: string;
  format?: string;
  synopsis?: string;
  subject?: string;
  weight?: string;
  dimensions?: string;
}
