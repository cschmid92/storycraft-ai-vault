
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookmarkPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UnifiedHeader from '../components/layout/UnifiedHeader';
import CollectionContentArea from '../components/CollectionContentArea';
import AppSidebar from '../components/layout/AppSidebar';
import CollectionModal from '../components/CollectionModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import { Book, Collection } from '../types/entities';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useFavorites } from '../contexts/FavoritesContext';
import { useBooksForSale } from '../hooks/useBooksForSale';

const Collections = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, addCollection, deleteCollection, updateCollection, addBookToCollection, removeBookFromCollection } = useCollections();
  const { books, rateBook } = useBooks();
  const { booksReadList, addToBooksRead, isInBooksRead, getBooksReadCount } = useBooksRead();
  const { toggleFavorite, isFavorite, getFavoriteBooks } = useFavorites();
  const { isBookForSale, addBookForSale, removeBookForSale } = useBooksForSale();
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
    const favoriteBookIds = getFavoriteBooks();
    selectedCollection = { id: 'favorites', name: "Favorites ❤️", count: favoriteBookIds.length, color: "bg-red-500" };
    collectionBooks = books.filter(book => favoriteBookIds.includes(book.id));
  } else if (id === 'books-read') {
    selectedCollection = { id: 'books-read', name: "Books read 📖", count: getBooksReadCount(), color: "bg-green-500" };
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

  const handleDeleteCollection = () => {
    if (selectedCollection && typeof selectedCollection.id === 'number') {
      console.log('Deleting collection:', selectedCollection.id);
      deleteCollection(selectedCollection.id);
      // Navigate immediately without waiting
      setTimeout(() => navigate('/'), 0);
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
    addToBooksRead(bookId);
  };

  const handleToggleOwnedForSale = (bookId: number, price?: number) => {
    if (isBookForSale(bookId)) {
      removeBookForSale(bookId);
    } else if (price) {
      addBookForSale(bookId, price);
    }
  };

  const handleRateBook = (bookId: number, rating: number) => {
    rateBook(bookId, rating);
  };

  const handleCreateCollection = (name: string, color: string, description?: string) => {
    addCollection(name, color, description);
  };

  const handleUpdateCollection = (name: string, color: string, description?: string) => {
    if (editingCollection) {
      updateCollection(editingCollection.id, { name, color, description });
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
            <Button onClick={() => navigate('/')}>Go back to library</Button>
          </div>
        </div>
      </div>
    );
  }

  const canEdit = typeof selectedCollection.id === 'number';

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
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:sticky md:top-16 z-50 md:z-auto h-screen md:h-[calc(100vh-4rem)]`}>
          <AppSidebar 
            collections={collections}
            selectedCollection={selectedCollection as Collection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={getBooksReadCount()}
          />
        </div>

        <CollectionContentArea
          selectedCollection={selectedCollection}
          collectionBooks={collectionBooks}
          canEdit={canEdit}
          booksReadList={booksReadList}
          onToggleFavorite={handleToggleFavorite}
          onBookClick={handleBookClick}
          onAddToCollection={handleAddToCollection}
          onAddToBooksRead={handleAddToBooksRead}
          onRemoveFromCollection={canEdit ? handleRemoveFromCollection : undefined}
          onEditCollection={handleEditCollection}
          onDeleteCollection={handleDeleteCollection}
        />
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
        initialDescription={editingCollection?.description}
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
    </div>
  );
};

export default Collections;
