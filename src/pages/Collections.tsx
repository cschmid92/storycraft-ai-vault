
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Menu, Library } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/Book';
import UnifiedSidebar from '../components/UnifiedSidebar';
import CollectionModal from '../components/CollectionModal';
import AccountModal from '../components/AccountModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import BookCard from '../components/BookCard';
import { useCollections, Collection } from '../hooks/useCollections';
import { DataService } from '../services/mockDataService';

const Collections = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, addCollection, addBookToCollection, deleteCollection } = useCollections();
  
  // Use centralized data service
  const [books] = useState<Book[]>(DataService.getBooks());
  const [booksReadList] = useState<number[]>([3]);
  
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Find the current collection
  const currentCollection = id ? collections.find(c => c.id.toString() === id) : null;
  
  // Get books for the current collection
  const getCollectionBooks = (): Book[] => {
    if (!id) return [];
    
    if (id === 'favorites') {
      return books.filter(book => book.isFavorite);
    } else if (id === 'books-read') {
      return books.filter(book => booksReadList.includes(book.id));
    } else {
      return books.filter(book => book.id === parseInt(id));
    }
  };

  const collectionBooks = getCollectionBooks();

  const handleCollectionSelect = (collection: any) => {
    if (collection && typeof collection.id !== 'undefined') {
      navigate(`/collections/${collection.id}`);
    }
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

  const handleDeleteCollection = (collectionId: number | string) => {
    if (typeof collectionId === 'number') {
      deleteCollection(collectionId);
      navigate('/');
    }
  };

  const getCollectionTitle = (): string => {
    if (id === 'favorites') return 'Favorites ❤️';
    if (id === 'books-read') return 'Books read 📖';
    return currentCollection?.name || 'Collection';
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
        
        {/* Sidebar with edit options enabled */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-50 md:z-auto`}>
          <UnifiedSidebar 
            collections={collections}
            selectedCollection={currentCollection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadList.length}
            onDeleteCollection={handleDeleteCollection}
            showEditOptions={true}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button and Title */}
            <div className="mb-4 md:mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:bg-slate-100 mb-2"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h2 className="text-2xl font-bold text-slate-800">{getCollectionTitle()}</h2>
              <p className="text-slate-600 mt-1">{collectionBooks.length} books</p>
            </div>

            {/* Books Grid */}
            {collectionBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {collectionBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBookClick={() => handleBookClick(book)}
                    onToggleFavorite={() => {}}
                    onAddToCollection={() => handleAddToCollection(book)}
                    onAddToBooksRead={() => {}}
                    isInBooksRead={booksReadList.includes(book.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No books in this collection yet.</p>
                <p className="text-slate-400 mt-2">Add some books to get started!</p>
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

export default Collections;
