
import { Book, Collection, BookForSale, User, Favorites, BooksRead, Conversation, Message, UserRating } from '../types/entities';

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
    isbn10: "0743273567",
    isbn13: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    language: "English",
    synopsis: "Set in the summer of 1922, the novel follows Nick Carraway as he observes the decadent world of his mysterious neighbor Jay Gatsby."
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    rating: 4.5,
    genre: "Classic Literature",
    year: 1960,
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    isbn10: "0061120081",
    isbn13: "978-0061120084",
    publisher: "Harper Perennial Modern Classics",
    pages: 376,
    language: "English",
    synopsis: "Through the eyes of Scout Finch, we see the complexities of human nature and moral courage."
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
    isbn10: "0452284236",
    isbn13: "978-0452284234",
    publisher: "Plume",
    pages: 328,
    language: "English",
    synopsis: "Winston Smith struggles against a totalitarian regime in a world of perpetual war and surveillance."
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
    isbn10: "0141439513",
    isbn13: "978-0141439518",
    publisher: "Penguin Classics",
    pages: 432,
    language: "English",
    synopsis: "Elizabeth Bennet navigates issues of marriage, morality, and misconceptions in 19th century England."
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
    isbn10: "0316769487",
    isbn13: "978-0316769488",
    publisher: "Little, Brown and Company",
    pages: 277,
    language: "English",
    synopsis: "Holden Caulfield's journey through New York City after being expelled from prep school."
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=300&h=450&fit=crop",
    rating: 4.6,
    genre: "Science Fiction",
    year: 1965,
    description: "An epic science fiction novel set on the desert planet Arrakis.",
    isbn10: "0441013597",
    isbn13: "978-0441013593",
    publisher: "Ace",
    pages: 688,
    language: "English",
    synopsis: "Paul Atreides navigates political intrigue and mystical powers on the desert planet Arrakis."
  },
  {
    id: 7,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
    rating: 4.7,
    genre: "Fantasy",
    year: 1954,
    description: "An epic high fantasy novel following the quest to destroy the One Ring.",
    isbn10: "0544003415",
    isbn13: "978-0544003415",
    publisher: "Houghton Mifflin Harcourt",
    pages: 1216,
    language: "English",
    synopsis: "Frodo Baggins embarks on a perilous journey to destroy the One Ring and save Middle-earth."
  },
  {
    id: 8,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    cover: "https://images.unsplash.com/photo-1621944190310-e3cdd9129c3d?w=300&h=450&fit=crop",
    rating: 4.5,
    genre: "Fantasy",
    year: 1997,
    description: "The first book in the beloved Harry Potter series about a young wizard's adventures.",
    isbn10: "0439708184",
    isbn13: "978-0439708180",
    publisher: "Scholastic",
    pages: 309,
    language: "English",
    synopsis: "Harry Potter discovers he's a wizard on his 11th birthday and begins his magical education at Hogwarts."
  }
];

// Mock users/sellers
export const mockUsers: User[] = [
  {
    id: 1,
    email: "sarah.chen@email.com",
    username: "sarahc",
    firstName: "Sarah",
    lastName: "Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    rating: 4.8,
    totalSales: 23
  },
  {
    id: 2,
    email: "mike.rodriguez@email.com",
    username: "mikerod",
    firstName: "Mike",
    lastName: "Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 4.5,
    totalSales: 15
  },
  {
    id: 3,
    email: "emma.thompson@email.com",
    username: "emmat",
    firstName: "Emma",
    lastName: "Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4.9,
    totalSales: 41
  },
  {
    id: 4,
    email: "david.kim@email.com",
    username: "davidk",
    firstName: "David",
    lastName: "Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4.7,
    totalSales: 32
  }
];

// Books for sale - consolidated entity
export const booksForSale: BookForSale[] = [
  // My books for sale
  {
    id: 101,
    sellerId: 999, // Current user ID
    bookId: 3, // 1984 from mockBooks
    price: 12.99,
    currency: 'CHF',
    condition: "Good",
    location: "My Location",
    distance: 0,
    status: 'Available' as const,
    book: mockBooks.find(b => b.id === 3)
  },
  {
    id: 102,
    sellerId: 999, // Current user ID
    bookId: 7, // The Lord of the Rings
    price: 8.99,
    currency: 'CHF',
    condition: "Fair",
    location: "My Location", 
    distance: 0,
    status: 'Available' as const,
    book: mockBooks.find(b => b.id === 5)
  },
  // Community books for sale
  {
    id: 201,
    sellerId: 1,
    bookId: 3, // 1984
    price: 12.99,
    currency: 'CHF',
    condition: "Good",
    location: "Downtown",
    distance: 3.7,
    status: 'Available' as const,
    seller: mockUsers[0],
    book: mockBooks.find(b => b.id === 3)
  },
  {
    id: 205,
    sellerId: 1,
    bookId: 2, // To Kill a Mockingbird
    price: 14.99,
    currency: 'CHF',
    condition: "Very Good",
    location: "Downtown",
    distance: 3.7,
    status: 'Available' as const,
    seller: mockUsers[0],
    book: mockBooks.find(b => b.id === 2)
  },
  {
    id: 206,
    sellerId: 1,
    bookId: 5, // The Catcher in the Rye
    price: 11.50,
    currency: 'CHF',
    condition: "Good",
    location: "Downtown",
    distance: 3.7,
    status: 'Available' as const,
    seller: mockUsers[0],
    book: mockBooks.find(b => b.id === 5)
  },
  {
    id: 202,
    sellerId: 2,
    bookId: 4, // Pride and Prejudice
    price: 15.99,
    currency: 'CHF',
    condition: "Excellent",
    location: "Uptown",
    distance: 9.2,
    status: 'Available' as const,
    seller: mockUsers[1],
    book: mockBooks.find(b => b.id === 4)
  },
  {
    id: 203,
    sellerId: 3,
    bookId: 1, // The Great Gatsby
    price: 10.99,
    currency: 'CHF',
    condition: "Fair",
    location: "Midtown",
    distance: 1.9,
    status: 'Available' as const,
    seller: mockUsers[2],
    book: mockBooks.find(b => b.id === 1)
  },
  {
    id: 207,
    sellerId: 3,
    bookId: 4, // Pride and Prejudice
    price: 13.99,
    currency: 'CHF',
    condition: "Very Good",
    location: "Midtown",
    distance: 1.9,
    status: 'Available' as const,
    seller: mockUsers[2],
    book: mockBooks.find(b => b.id === 4)
  },
  {
    id: 208,
    sellerId: 3,
    bookId: 7, // The Lord of the Rings
    price: 22.99,
    currency: 'CHF',
    condition: "Like New",
    location: "Midtown",
    distance: 1.9,
    status: 'Available' as const,
    seller: mockUsers[2],
    book: mockBooks.find(b => b.id === 7)
  },
  {
    id: 204,
    sellerId: 4,
    bookId: 6, // Dune
    price: 18.50,
    currency: 'CHF',
    condition: "Like New",
    location: "Westside",
    distance: 5.1,
    status: 'Available' as const,
    seller: mockUsers[3],
    book: mockBooks.find(b => b.id === 6)
  }
];

// Mock favorites
export const mockFavorites: Favorites = {
  id: 1,
  userId: 999,
  bookIds: [2, 5, 7] // To Kill a Mockingbird, The Catcher in the Rye, The Lord of the Rings
};

// Mock books read
export const mockBooksRead: BooksRead = {
  id: 1,
  userId: 999,
  bookIds: [1, 2] // The Great Gatsby, To Kill a Mockingbird
};

// Mock collection
export const mockCollections: Collection[] = [
  {
    id: 1,
    name: "Classics",
    count: 3,
    color: "blue",
    bookIds: [1, 2, 4],
    description: "Timeless literary masterpieces",
    userId: 999
  },
  {
    id: 2,
    name: "Science Fiction",
    count: 2,
    color: "purple",
    bookIds: [6, 3],
    description: "Futuristic worlds and advanced technology",
    userId: 999
  },
  {
    id: 3,
    name: "Fantasy Adventures",
    count: 2,
    color: "green",
    bookIds: [7, 8],
    description: "Magical realms and epic quests",
    userId: 999
  }
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    user1Id: 999, // Current user
    user2Id: 1, // Alice Johnson
    bookId: 3, // 1984
    lastMessageId: 3,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    participantName: "Alice Johnson",
    participantAvatar: "https://images.unsplash.com/photo-1494790108755-2616b2e99b65?w=40&h=40&fit=crop&crop=face",
    lastMessage: "Is the book still available?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2
  },
  {
    id: 2,
    user1Id: 999, // Current user
    user2Id: 2, // Bob Smith
    bookId: 7, // The Lord of the Rings
    lastMessageId: 6,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    participantName: "Bob Smith",
    participantAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    lastMessage: "Great, I'll take it!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    senderId: 1,
    content: "Hi! I'm interested in your copy of '1984'. Is it still available?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    seen: true,
    senderName: "Alice Johnson",
    isFromMe: false
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 999,
    content: "Yes, it's still available! The condition is good and I'm asking $12.99.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    seen: true,
    senderName: "You",
    isFromMe: true
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 1,
    content: "Is the book still available?",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    seen: false,
    senderName: "Alice Johnson",
    isFromMe: false
  },
  {
    id: 4,
    conversationId: 2,
    senderId: 2,
    content: "Hello! I saw your listing for 'The Hobbit'. Can you meet tomorrow?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    seen: true,
    senderName: "Bob Smith",
    isFromMe: false
  },
  {
    id: 5,
    conversationId: 2,
    senderId: 999,
    content: "Sure! How about 2 PM at the coffee shop on Main Street?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
    seen: true,
    senderName: "You",
    isFromMe: true
  },
  {
    id: 6,
    conversationId: 2,
    senderId: 2,
    content: "Great, I'll take it!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    seen: true,
    senderName: "Bob Smith",
    isFromMe: false
  }
];

// Mock user ratings with reviews
export const mockUserRatings: UserRating[] = [
  {
    id: 1,
    userId: 1, // Sarah Chen
    bookId: 999, // Rating for user 1 (from another user's perspective)
    rating: 5,
    reviewText: "Excellent seller! Book was exactly as described and shipping was super fast. Would definitely buy from again!",
    reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    id: 2,
    userId: 2, // Mike Rodriguez 
    bookId: 999, // Rating for user 1
    rating: 4,
    reviewText: "Good communication and fair pricing. The book had some wear but was as expected.",
    reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
  },
  {
    id: 3,
    userId: 3, // Emma Thompson
    bookId: 999, // Rating for user 1  
    rating: 5,
    reviewText: "Amazing seller! Book came in perfect condition and was packaged beautifully. Highly recommended!",
    reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) // 2 weeks ago
  },
  {
    id: 4,
    userId: 4, // David Kim
    bookId: 1, // Rating for user 1 (Sarah Chen)
    rating: 5,
    reviewText: "Sarah is fantastic to work with. Quick responses and the book was in excellent condition!",
    reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },
  {
    id: 5,
    userId: 1, // Sarah Chen
    bookId: 1, // Rating for user 1 (Sarah Chen) - self rating from buyer perspective
    rating: 4,
    reviewText: "Smooth transaction. Book arrived quickly and was well-packaged.",
    reviewDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) // 10 days ago
  }
];
