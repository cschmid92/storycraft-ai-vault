import React, { useState } from 'react';
import { BookOpen, User, ShoppingCart, Filter, DollarSign, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SharedSidebar from '../components/SharedSidebar';
import CollectionModal from '../components/CollectionModal';
import AccountModal from '../components/AccountModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import { Link, useNavigate } from 'react-router-dom';
import { Book } from '../types/Book';
import { useCollections } from '../hooks/useCollections';

// Mock books for sale data
const booksForSale = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    price: 12.99,
    condition: "Good",
    seller: "BookLover123",
    location: "New York, NY",
    rating: 4.2,
    originalPrice: 15.99
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    price: 10.50,
    condition: "Very Good",
    seller: "ClassicReads",
    location: "Los Angeles, CA",
    rating: 4.5,
    originalPrice: 14.99
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    price: 8.75,
    condition: "Fair",
    seller: "OrwellFan",
    location: "Chicago, IL",
    rating: 4.4,
    originalPrice: 13.99
  }
];

// Mock books data for sidebar - convert sale books to Book type
const mockBooks: Book[] = booksForSale.map(book => ({
  id: book.id,
  title: book.title,
  author: book.author,
  cover: book.cover,
  rating: book.rating,
  genre: "Fiction",
  year: 2000,
  description: "A classic novel",
  isFavorite: false,
  isOwnedForSale: false,
  isbn10: "0000000000",
  isbn13: "000-0000000000",
  publisher: "Publisher",
  pages: 200,
  language: "English"
}));

const BuyUsedBooks = () => {
  const { collections, addCollection } = useCollections();
  const navigate = useNavigate();
  const [books] = useState(mockBooks);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [booksReadList] = useState<number[]>([1]);

  const handleCollectionSelect = (collection: any) => {
    if (collection && typeof collection.id !== 'undefined') {
      navigate(`/collections/${collection.id}`);
    }
  };

  const handleBookClick = (bookId: number) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setIsBookDetailModalOpen(true);
    }
  };

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  const handleContactSeller = (seller: string) => {
    alert(`Contacting ${seller}...`);
  };

  const handleToggleFavorite = (bookId: number) => {
    console.log('Toggle favorite for book:', bookId);
  };

  const handleAddToCollection = (bookId: number) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setSelectedBookForCollection(book);
      setIsCollectionSelectionModalOpen(true);
    }
  };

  const handleCollectionSelection = (collection: any) => {
    if (collection && selectedBookForCollection) {
      console.log(`Added "${selectedBookForCollection.title}" to collection "${collection.name}"`);
    }
    setSelectedBookForCollection(null);
  };

  const handleAddToBooksRead = (bookId: number) => {
    console.log('Add to books read:', bookId);
  };

  const filteredBooks = booksForSale.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = !maxPrice || book.price <= parseFloat(maxPrice);
    const matchesCondition = !selectedCondition || book.condition === selectedCondition;
    return matchesSearch && matchesPrice && matchesCondition;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Bacondo</h1>
                <p className="text-xs text-slate-600">Your Digital Library</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsAccountModalOpen(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <SharedSidebar 
          collections={collections}
          selectedCollection={null}
          onSelectCollection={handleCollectionSelect}
          onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
          books={books}
          onBookClick={(book) => handleBookClick(book.id)}
          booksReadCount={booksReadList.length}
        />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center mb-8">
              <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Buy Used Books</h1>
                <p className="text-slate-600">Find great deals on pre-owned books from our community</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 mb-8 border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search books or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <select 
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-700"
                  >
                    <option value="">All Conditions</option>
                    <option value="New">New</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <div key={book.id} className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/4] relative cursor-pointer" onClick={() => handleBookClick(book.id)}>
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ${book.price}
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                      {book.condition}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-slate-800 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleBookClick(book.id)}
                    >
                      {book.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">{book.author}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm text-slate-600">{book.rating}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">${book.price}</div>
                        <div className="text-xs text-slate-500 line-through">${book.originalPrice}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-slate-500 mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{book.location}</span>
                    </div>

                    <div className="text-xs text-slate-600 mb-3">
                      Sold by: <span className="font-medium">{book.seller}</span>
                    </div>

                    <Button 
                      onClick={() => handleContactSeller(book.seller)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Contact Seller
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
                <p className="text-slate-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />
      
      <BookDetailModal
        book={selectedBook}
        isOpen={isBookDetailModalOpen}
        onClose={() => setIsBookDetailModalOpen(false)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCollection={handleAddToCollection}
        onToggleOwnedForSale={() => {}}
        onRateBook={() => {}}
      />

      <CollectionSelectionModal
        isOpen={isCollectionSelectionModalOpen}
        onClose={() => setIsCollectionSelectionModalOpen(false)}
        collections={collections}
        onSelectCollection={handleCollectionSelection}
        bookTitle={selectedBookForCollection?.title || ""}
      />
      
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default BuyUsedBooks;
