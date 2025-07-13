
// Base entity interface
export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Book entity
export interface Book extends BaseEntity {
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  year: number;
  description: string;
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
}

// Collection entity
export interface Collection extends BaseEntity {
  name: string;
  count: number;
  color: string;
  bookIds: number[];
  description?: string;
  isPublic?: boolean;
  userId: number;
}

// Favorites entity
export interface Favorites extends BaseEntity {
  userId: number;
  bookIds: number[];
}

// Books read entity
export interface BooksRead extends BaseEntity {
  userId: number;
  bookIds: number[];
}

// User ratings entity
export interface UserRating extends BaseEntity {
  userId: number;
  bookId: number;
  rating: number;
}

// User entity
export interface User extends BaseEntity {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rating?: number;
  totalSales?: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteGenres: string[];
  readingGoal?: number;
  privacySettings: {
    showReadingActivity: boolean;
    showFavorites: boolean;
    showCollections: boolean;
  };
}

// Search and filter types
export interface SearchFilters {
  title?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  publisher?: string;
  yearFrom?: number;
  yearTo?: number;
  language?: string;
  ratingMin?: number;
  condition?: BookCondition;
  priceMax?: number;
  location?: string;
  maxDistance?: number;
}

// Book for sale entity
export interface BookForSale extends BaseEntity {
  sellerId: number;
  bookId: number;
  price: number;
  condition: BookCondition;
  location?: string;
  seller?: User;
  distance?: number;
  status: BookForSaleStatus;
  book?: Book;
}

// Supporting types
export type BookCondition = 'New' | 'Like New' | 'Very Good' | 'Good' | 'Fair' | 'Poor' | 'Excellent';

// Book for sale status type
export type BookForSaleStatus = 'Available' | 'Sold' | 'Picked';

// Message and conversation entities
export interface Message extends BaseEntity {
  conversationId: string;
  senderId: number;
  content: string;
  seen: boolean;
}

export interface Conversation extends BaseEntity {
  user1Id: number;
  user2Id: number;
  bookId: number;
  lastMessageId?: number;
  book?: Book;
  participant?: User;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  messages: Message[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
