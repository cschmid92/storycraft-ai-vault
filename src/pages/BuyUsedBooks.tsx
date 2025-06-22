
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, User, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookCard from '../components/BookCard';
import CollectionSidebar from '../components/CollectionSidebar';
import CollectionModal from '../components/CollectionModal';
import { Book } from '../types/Book';

// Extended Book interface for used books with distance
interface UsedBook extends Book {
  distance?: number; // in kilometers
  location?: string;
}

// Mock data for used books marketplace with distance information in kilometers
const mockUsedBooks: UsedBook[] = [
  {
    id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
    rating: 4.6,
    genre: "Fantasy",
    year: 1937,
    description: "A classic fantasy adventure about Bilbo Baggins' unexpected journey.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 8.99,
    isbn10: "0547928227",
    isbn13: "978-0547928227",
    publisher: "Mariner Books",
    pages: 366,
    language: "English",
    condition: "Good",
    distance: 3.7,
    location: "Downtown Library District"
  },
  {
    id: 8,
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    rating: 4.3,
    genre: "Science Fiction",
    year: 1965,
    description: "Epic science fiction novel set on the desert planet Arrakis.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 15.50,
    isbn10: "0441172717",
    isbn13: "978-0441172719",
    publisher: "Ace",
    pages: 688,
    language: "English",
    condition: "Very Good",
    distance: 9.2,
    location: "University District"
  },
  {
    id: 9,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
    rating: 4.8,
    genre: "Fantasy",
    year: 1954,
    description: "Epic fantasy trilogy about the quest to destroy the One Ring.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 25.00,
    condition: "Like New",
    distance: 19.5,
    location: "Suburb East"
  }
];

const mockCollections = [
  { id: 2, name: "To Read 📚", count: 3, color: "bg-blue-500" },
  { id: 3, name: "Classics", count: 3, color: "bg-amber-500" },
  { id: 4, name: "Sci-Fi Adventures", count: 2, color: "bg-purple-500" }
];

const BuyUsedBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [distanceRange, setDistanceRange] = useState("all");
  const [books, setBooks] = useState(mockUsedBooks);
  const [collections, setCollections] = useState(mockCollections);
  const [booksReadList, setBooksReadList] = useState<number[]>([]);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const navigate = useNavigate();

  const genres = [...new Set(books.map(book => book.genre))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    
    let matchesPrice = true;
    if (priceRange === "under10" && book.salePrice && book.salePrice >= 10) matchesPrice = false;
    if (priceRange === "10to20" && book.salePrice && (book.salePrice < 10 || book.salePrice > 20)) matchesPrice = false;
    if (priceRange === "over20" && book.salePrice && book.salePrice <= 20) matchesPrice = false;
    
    let matchesDistance = true;
    if (distanceRange === "under8" && book.distance && book.distance >= 8) matchesDistance = false;
    if (distanceRange === "8to16" && book.distance && (book.distance < 8 || book.distance > 16)) matchesDistance = false;
    if (distanceRange === "over16" && book.distance && book.distance <= 16) matchesDistance = false;
    
    return matchesSearch && matchesGenre && matchesPrice && matchesDistance;
  });

  const handleBookClick = (book: Book) => {
    console.log('Book clicked:', book);
  };

  const handleToggleFavorite = (bookId: number) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
    ));
  };

  const handleAddToCollection = (bookId: number) => {
    console.log('Add to collection:', bookId);
  };

  const handleAddToBooksRead = (bookId: number) => {
    setBooksReadList(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      }
      return [...prev, bookId];
    });
  };

  const handleCollectionSelect = (collection: any) => {
    if (collection?.id === 'favorites') {
      navigate('/collections/favorites');
    } else if (collection?.id === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
    }
  };

  const handleCreateCollection = (name: string, color: string) => {
    const newCollection = {
      id: Date.now(),
      name,
      count: 0,
      color
    };
    setCollections([...collections, newCollection]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
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
        <CollectionSidebar 
          collections={collections}
          selectedCollection={null}
          onSelectCollection={handleCollectionSelect}
          onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
          books={books}
          onBookClick={handleBookClick}
          booksReadCount={5}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Buy Used Books</h1>
            </div>
            <p className="text-slate-600">Find great deals on pre-owned books</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search used books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-slate-300"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under10">Under $10</option>
                  <option value="10to20">$10 - $20</option>
                  <option value="over20">Over $20</option>
                </select>
                <select 
                  value={distanceRange}
                  onChange={(e) => setDistanceRange(e.target.value)}
                  className="px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Distances</option>
                  <option value="under8">Under 8 km</option>
                  <option value="8to16">8 - 16 km</option>
                  <option value="over16">Over 16 km</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Available Used Books</h2>
              <p className="text-slate-600">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="relative">
                <BookCard 
                  book={book}
                  onToggleFavorite={handleToggleFavorite}
                  onBookClick={handleBookClick}
                  onAddToCollection={handleAddToCollection}
                  onAddToBooksRead={handleAddToBooksRead}
                  isInBooksRead={booksReadList.includes(book.id)}
                />
                {/* Distance and Condition Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {book.distance && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {book.distance.toFixed(1)} km
                    </div>
                  )}
                  {book.condition && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {book.condition}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>

      {/* Collection Modal */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  );
};

export default BuyUsedBooks;
