import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookmarkPlus, Edit, Trash2, Heart, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BookCard from '../components/BookCard';
import SharedSidebar from '../components/SharedSidebar';
import CollectionModal from '../components/CollectionModal';
import AccountModal from '../components/AccountModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import { Book, Collection } from '../types/entities';
import { BookOpen, User } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';

const Collections = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, addCollection, deleteCollection, updateCollection, addBookToCollection, removeBookFromCollection } = useCollections();
  const { books, toggleFavorite, toggleOwnedForSale, rateBook } = useBooks();
  const [booksReadList, setBooksReadList] = useState<number[]>([1, 2]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  
  // Handle both standard and user collections
  let selectedCollection: Collection | { id: string; name: string; count: number; color: string } | null = null;
  let collectionBooks: Book[] = [];

  if (id === 'favorites') {
    selectedCollection = { id: 'favorites', name: "Favorites ❤️", count: books.filter(book => book.isFavorite).length, color: "bg-red-500" };
    collectionBooks = books.filter(book => book.isFavorite);
  } else if (id === 'books-read') {
    selectedCollection = { id: 'books-read', name: "Books read 📖", count: booksReadList.length, color: "bg-green-500" };
    collectionBooks = books.filter(book => booksReadList.includes(Number(book.id)));
  } else {
    selectedCollection = collections.find(c => c.id === parseInt(id || '')) || null;
    if (selectedCollection) {
      const bookIds = (selectedCollection as Collection).bookIds || [];
      collectionBooks = books.filter(book => bookIds.includes(Number(book.id)));
    }
  }

  const handleEditCollection = (collectionId: number) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      setEditingCollection(collection);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteCollection = (collectionId: number | string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      deleteCollection(collectionId);
      navigate('/');
    }
  };

  const handleCollectionSelect = (collection: Collection | { id: string; name: string; count: number; color: string } | null) => {
    if (collection?.id === 'favorites') {
      navigate('/collections/favorites');
    } else if (collection?.id === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
    }
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const handleToggleFavorite = (bookId: number) => {
    toggleFavorite(bookId);
  };

  const handleAddToCollection = (bookId: number) => {
    const book = books.find(b => Number(b.id) === bookId);
    if (book) {
      setSelectedBookForCollection(book);
      setIsCollectionSelectionModalOpen(true);
    }
  };

  const handleCollectionSelection = (collection: Collection) => {
    if (collection && selectedBookForCollection) {
      addBookToCollection(collection.id, Number(selectedBookForCollection.id));
      console.log(`Added "${selectedBookForCollection.title}" to collection "${collection.name}"`);
    }
    setSelectedBookForCollection(null);
    setIsCollectionSelectionModalOpen(false);
  };

  const handleRemoveFromCollection = (bookId: number) => {
    if (selectedCollection && typeof selectedCollection.id === 'number') {
      removeBookFromCollection(selectedCollection.id, bookId);
      console.log(`Removed book ${bookId} from collection ${selectedCollection.name}`);
    }
  };

  const handleAddToBooksRead = (bookId: number) => {
    setBooksReadList(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      }
      return [...prev, bookId];
    });
  };

  const handleToggleOwnedForSale = (bookId: number, price?: number) => {
    const book = books.find(b => Number(b.id) === bookId);
    if (book && book.isOwnedForSale && !price) {
      // If removing from sale, don't require price
      toggleOwnedForSale(bookId);
    } else if (book && !book.isOwnedForSale && price) {
      // If adding to sale, use provided price
      toggleOwnedForSale(bookId, price);
    } else if (book && !book.isOwnedForSale) {
      // If adding to sale without price, use default or prompt
      toggleOwnedForSale(bookId, 10); // Default price
    } else {
      // Toggle current state
      toggleOwnedForSale(bookId, price);
    }
  };

  const handleRateBook = (bookId: number, rating: number) => {
    rateBook(bookId, rating);
  };

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  const handleUpdateCollection = (name: string, color: string) => {
    if (editingCollection) {
      updateCollection(editingCollection.id, { name, color });
      setIsEditModalOpen(false);
      setEditingCollection(null);
    }
  };

  if (!selectedCollection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookmarkPlus className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Collection not found</h2>
            <Link to="/">
              <Button>Go back to library</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canEdit = typeof selectedCollection.id === 'number';

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
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:sticky md:top-16 z-50 md:z-auto h-screen md:h-[calc(100vh-4rem)]`}>
          <SharedSidebar 
            collections={collections}
            selectedCollection={selectedCollection as Collection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadList.length}
            onDeleteCollection={handleDeleteCollection}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                </Link>
                <div className={`p-2 rounded-xl ${selectedCollection.color}`}>
                  {selectedCollection.id === 'favorites' ? (
                    <Heart className="h-6 w-6 text-white" />
                  ) : (
                    <BookmarkPlus className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{selectedCollection.name}</h1>
                  <p className="text-xs text-slate-600">{collectionBooks.length} books</p>
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCollection(selectedCollection.id as number)}
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteCollection(selectedCollection.id as number)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {collectionBooks.map(book => (
              <BookCard 
                key={book.id}
                book={book}
                onToggleFavorite={handleToggleFavorite}
                onBookClick={handleBookClick}
                onAddToCollection={handleAddToCollection}
                onAddToBooksRead={handleAddToBooksRead}
                isInBooksRead={booksReadList.includes(Number(book.id))}
                onRemoveFromCollection={canEdit ? handleRemoveFromCollection : undefined}
                showRemoveFromCollection={canEdit}
              />
            ))}
          </div>

          {collectionBooks.length === 0 && (
            <div className="text-center py-12">
              <BookmarkPlus className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No books in this collection</h3>
              <p className="text-slate-500">Start adding books to build your collection</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />

      <CollectionModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCollection(null);
        }}
        onCreateCollection={handleUpdateCollection}
        editMode={true}
        initialName={editingCollection?.name}
        initialColor={editingCollection?.color}
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
        onToggleFavorite={handleToggleFavorite}
        onAddToCollection={handleAddToCollection}
        onToggleOwnedForSale={handleToggleOwnedForSale}
        onRateBook={handleRateBook}
      />
      
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default Collections;
