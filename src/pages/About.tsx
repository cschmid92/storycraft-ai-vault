import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Menu, ArrowLeft, Library, Heart, TrendingUp, DollarSign, Users, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SharedSidebar from '../components/SharedSidebar';
import AccountModal from '../components/AccountModal';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import CollectionModal from '../components/CollectionModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import BookDetailModal from '../components/BookDetailModal';
import { Book, Collection } from '../types/entities';

const About = () => {
  const { books, toggleFavorite, toggleOwnedForSale, rateBook } = useBooks();
  const { collections, addCollection, deleteCollection, addBookToCollection } = useCollections();
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const booksRead = books.filter(book => book.userRating && book.userRating > 0);
  const booksReadCount = booksRead.length;

  const handleSelectCollection = (collection: Collection | null) => {
    setSelectedCollection(collection);
    setIsSidebarOpen(false);
    
    if (collection && typeof collection.id === 'number') {
      window.location.href = `/collections/${collection.id}`;
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailOpen(true);
  };

  const handleAddToCollection = (bookId: number) => {
    setSelectedBookId(bookId);
    setIsSelectionModalOpen(true);
  };

  const handleConfirmAddToCollection = (collection: Collection) => {
    if (selectedBookId) {
      addBookToCollection(collection.id, selectedBookId);
      setIsSelectionModalOpen(false);
      setSelectedBookId(null);
    }
  };

  const selectedBookTitle = selectedBookId ? books.find(book => book.id === selectedBookId)?.title || '' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header - matching other pages */}
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
              
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Bacondo</h1>
                  <p className="text-xs text-slate-600 hidden sm:block">Your Digital Library</p>
                </div>
              </Link>
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
          <SharedSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadCount}
            onDeleteCollection={deleteCollection}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Back button and title aligned like other pages */}
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
              Welcome to Bacondo
            </h2>
          </div>

          <div className="text-center mb-12">
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your personal digital library where stories come alive and reading becomes an adventure.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl w-fit mx-auto mb-4">
                <Library className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Digital Library</h3>
              <p className="text-slate-600">
                Organize your books digitally with our intuitive library management system.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl w-fit mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Collections</h3>
              <p className="text-slate-600">
                Create custom collections and organize your favorite books by genre, mood, or theme.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl w-fit mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Reading Tracking</h3>
              <p className="text-slate-600">
                Track your reading progress and discover new books based on your preferences.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl w-fit mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Buy & Sell</h3>
              <p className="text-slate-600">
                Trade books with other readers in our community marketplace.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Community</h3>
              <p className="text-slate-600">
                Connect with fellow book lovers and share your reading journey.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 text-center">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl w-fit mx-auto mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Search</h3>
              <p className="text-slate-600">
                Find books quickly with our advanced search and filtering options.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-8 mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto">
              At Bacondo, we believe that every book has the power to transform lives. Our mission is to create a seamless digital reading experience that brings together book lovers from around the world, making it easier to discover, organize, and share the stories that matter most to you.
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-slate-600 mb-6">
              Join thousands of readers who have already made Bacondo their digital home.
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3">
                Start Building Your Library
              </Button>
            </Link>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={addCollection}
      />

      <CollectionSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onSelectCollection={handleConfirmAddToCollection}
        collections={collections}
        bookTitle={selectedBookTitle}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={isBookDetailOpen}
        onClose={() => setIsBookDetailOpen(false)}
        onToggleFavorite={toggleFavorite}
        onAddToCollection={handleAddToCollection}
        onToggleOwnedForSale={toggleOwnedForSale}
        onRateBook={rateBook}
      />

      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default About;
