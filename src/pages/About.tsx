import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Menu, ArrowLeft, Library, Heart, TrendingUp, DollarSign, Users, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UnifiedHeader from '../components/layout/UnifiedHeader';
import AppSidebar from '../components/layout/AppSidebar';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useFavorites } from '../hooks/useFavorites';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useUserRatings } from '../hooks/useUserRatings';
import CollectionModal from '../components/CollectionModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import BookDetailModal from '../components/BookDetailModal';
import { Book, Collection } from '../types/entities';

const About = () => {
  const { books } = useBooks();
  const { toggleFavorite } = useFavorites();
  const { addBookForSale, removeBookForSale } = useBooksForSale();
  const { rateBook } = useUserRatings();
  const { collections, addCollection, deleteCollection, addBookToCollection } = useCollections();
  const { getBooksReadCount } = useBooksRead();
  const navigate = useNavigate();
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use the same books read logic as Collections.tsx - books with IDs 1 and 2 are marked as read
  const booksReadCount = getBooksReadCount();

  const handleSelectCollection = (collection: Collection | null) => {
    setSelectedCollection(collection);
    setIsSidebarOpen(false);
    
    if (collection && String(collection.id) === 'favorites') {
      navigate('/collections/favorites');
    } else if (collection && String(collection.id) === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
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

  const handleCreateCollection = (name: string, color: string, description?: string) => {
    addCollection(name, color, description);
  };

  const selectedBookTitle = selectedBookId ? books.find(book => book.id === selectedBookId)?.title || '' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <UnifiedHeader 
        showMobileMenu={true}
        onMobileMenuClick={() => setIsSidebarOpen(true)}
      />

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
          <AppSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadCount}
            
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
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
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
              Join readers who have already made Bacondo their digital home.
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
        onCreateCollection={handleCreateCollection}
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
        onToggleOwnedForSale={(bookId, price) => {
          if (price) addBookForSale(bookId, price, 'Good');
          else removeBookForSale(bookId);
        }}
        onRateBook={rateBook}
      />
    </div>
  );
};

export default About;
