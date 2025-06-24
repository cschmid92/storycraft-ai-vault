
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, Library } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CollectionModal from '../components/CollectionModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import SearchBar from '../components/SearchBar';
import UnifiedSidebar from '../components/UnifiedSidebar';
import BookDetailModal from '../components/BookDetailModal';
import AccountModal from '../components/AccountModal';
import PopularReads from '../components/PopularReads';
import Recommendations from '../components/Recommendations';
import { Book } from '../types/Book';
import { useCollections, Collection } from '../hooks/useCollections';
import { DataService } from '../services/mockDataService';

const Index = () => {
  const { collections, addCollection, addBookToCollection } = useCollections();
  const navigate = useNavigate();
  
  // Use centralized data service instead of inline mock data
  const [books] = useState<Book[]>(DataService.getBooks());
  const [booksReadList] = useState<number[]>([3]);
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get popular books (highest rated)
  const popularBooks = books
    .filter(book => book.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Get recommendation books (favorites or highly rated)
  const recommendedBooks = books
    .filter(book => book.isFavorite || book.rating >= 4.2)
    .slice(0, 8);

  const handleCollectionSelect = (collection: Collection | null) => {
    if (collection && typeof collection.id !== 'undefined') {
      navigate(`/collections/${collection.id}`);
    }
    setSelectedCollection(collection);
    setIsSidebarOpen(false);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  const handleAddToCollection = (book: Book) => {
    setSelectedBookForCollection(book);
    setIsCollectionSelectionModalOpen(true);
  };

  const handleCollectionSelection = (collection: Collection) => {
    if (collection && selectedBookForCollection) {
      addBookToCollection(collection.id, selectedBookForCollection.id);
      console.log(`Added "${selectedBookForCollection.title}" to collection "${collection.name}"`);
    }
    setSelectedBookForCollection(null);
    setIsCollectionSelectionModalOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Library className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Bacondo</h1>
                <p className="text-xs text-slate-600 hidden sm:block">Your Digital Library</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsAccountModalOpen(true)}
              >
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-50 md:z-auto`}>
          <UnifiedSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadList.length}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Hero Section */}
            <div className="text-center py-8 md:py-12">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
                Welcome to <span className="text-blue-600">Bacondo</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Your personal digital library to discover, organize, and share amazing books
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={handleSearch} />
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link to="/advanced-search">
                  <Button variant="outline" className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100">
                    Advanced Search
                  </Button>
                </Link>
                <Link to="/buy-used-books">
                  <Button variant="outline" className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100">
                    Buy Used Books
                  </Button>
                </Link>
              </div>
            </div>

            {/* Popular Reads Section */}
            <PopularReads 
              books={popularBooks}
              onBookClick={handleBookClick}
            />

            {/* Recommendations Section */}
            <Recommendations 
              books={recommendedBooks}
              onBookClick={handleBookClick}
              onAddToCollection={handleAddToCollection}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />

      <CollectionSelectionModal
        isOpen={isCollectionSelectionModalOpen}
        onClose={() => setIsCollectionSelectionModalOpen(false)}
        collections={collections}
        onSelectCollection={handleCollectionSelection}
        bookTitle={selectedBookForCollection?.title || ""}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={isBookDetailModalOpen}
        onClose={() => setIsBookDetailModalOpen(false)}
        onToggleFavorite={() => {}}
        onAddToCollection={() => selectedBook && handleAddToCollection(selectedBook)}
        onToggleOwnedForSale={() => {}}
        onRateBook={() => {}}
      />
      
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default Index;
