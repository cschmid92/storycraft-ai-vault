
import React, { useState } from 'react';
import { BookOpen, Plus, Search, Filter, Heart, Star, BookmarkPlus, User } from 'lucide-react';
import BookCard from '../components/BookCard';
import CollectionModal from '../components/CollectionModal';
import SearchBar from '../components/SearchBar';
import CollectionSidebar from '../components/CollectionSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const mockBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
    rating: 4.3,
    genre: "Romance",
    year: 1813,
    description: "A romantic novel dealing with issues of marriage, money, and social status in 19th century England.",
    isFavorite: true
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://images.unsplash.com/photo-1521123845560-5240e429f392?w=300&h=450&fit=crop",
    rating: 3.8,
    genre: "Coming of Age",
    year: 1951,
    description: "A controversial novel about teenage rebellion and alienation in post-war America.",
    isFavorite: false
  },
  {
    id: 6,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
    rating: 4.7,
    genre: "Fantasy",
    year: 1997,
    description: "The first book in the beloved Harry Potter series about a young wizard's adventures.",
    isFavorite: true
  }
];

const mockCollections = [
  { id: 1, name: "Favorites ❤️", count: 3, color: "bg-red-500" },
  { id: 2, name: "To Read 📚", count: 8, color: "bg-blue-500" },
  { id: 3, name: "Classics", count: 12, color: "bg-amber-500" },
  { id: 4, name: "Sci-Fi Adventures", count: 6, color: "bg-purple-500" }
];

const Index = () => {
  const [books, setBooks] = useState(mockBooks);
  const [collections, setCollections] = useState(mockCollections);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(books.map(book => book.genre))];

  const handleCreateCollection = (name: string, color: string) => {
    const newCollection = {
      id: Date.now(),
      name,
      count: 0,
      color
    };
    setCollections([...collections, newCollection]);
  };

  const toggleFavorite = (bookId: number) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
    ));
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
            <Button 
              variant="outline"
              className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <CollectionSidebar 
          collections={collections}
          selectedCollection={selectedCollection}
          onSelectCollection={setSelectedCollection}
          onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
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
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Total Books</p>
                    <p className="text-2xl font-bold text-slate-800">{books.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Collections</p>
                    <p className="text-2xl font-bold text-slate-800">{collections.length}</p>
                  </div>
                  <BookmarkPlus className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Favorites</p>
                    <p className="text-2xl font-bold text-slate-800">{books.filter(b => b.isFavorite).length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedCollection ? selectedCollection.name : "Discover Books"}
              </h2>
              <p className="text-slate-600">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard 
                  key={book.id}
                  book={book}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
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

export default Index;
