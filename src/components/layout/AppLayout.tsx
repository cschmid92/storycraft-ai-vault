
import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { useBooks } from '../../hooks/useBooks';
import { useCollections } from '../../hooks/useCollections';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBooksForSale } from '../../hooks/useBooksForSale';
import { useUserRatings } from '../../hooks/useUserRatings';
import { useBooksRead } from '../../hooks/useBooksRead';
import CollectionModal from '../CollectionModal';
import CollectionSelectionModal from '../CollectionSelectionModal';
import BookDetailModal from '../BookDetailModal';
import { Book, Collection } from '../../types/entities';

interface AppLayoutProps {
  children: React.ReactNode | ((handlers: {
    onBookClick: (book: Book) => void;
    onAddToCollection: (bookId: number) => void;
    onToggleFavorite: (bookId: number) => void;
    onToggleOwnedForSale: (bookId: number, price?: number) => void;
    onRateBook: (bookId: number, rating: number) => void;
  }) => React.ReactNode);
  headerTitle?: string;
  headerSubtitle?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
}

const AppLayout = ({ 
  children, 
  headerTitle,
  headerSubtitle,
  showSidebar = true,
  showHeader = true
}: AppLayoutProps) => {
  const { books } = useBooks();
  const { toggleFavorite } = useFavorites();
  const { addBookForSale, removeBookForSale } = useBooksForSale();
  const { rateBook } = useUserRatings();
  const { getBooksReadCount } = useBooksRead();
  
  const { 
    collections, 
    addCollection, 
    deleteCollection,
    addBookToCollection 
  } = useCollections();

  // Get books read count from the proper hook
  const booksReadCount = getBooksReadCount();

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false);

  const handleSelectCollection = (collection: Collection | null) => {
    setSelectedCollection(collection);
  };

  const handleOpenCollectionModal = () => {
    setIsCollectionModalOpen(true);
  };

  const handleCloseCollectionModal = () => {
    setIsCollectionModalOpen(false);
  };

  const handleAddCollection = (name: string, color: string) => {
    addCollection(name, color);
    setIsCollectionModalOpen(false);
  };

  const handleAddToCollection = (bookId: number) => {
    setSelectedBookId(bookId);
    setIsSelectionModalOpen(true);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailOpen(true);
  };

  const handleToggleOwnedForSale = (bookId: number, price?: number) => {
    if (price) addBookForSale(bookId, price, 'Good');
    else removeBookForSale(bookId);
  };

  const handleConfirmAddToCollection = (collection: Collection) => {
    if (selectedBookId) {
      addBookToCollection(collection.id, selectedBookId);
      setIsSelectionModalOpen(false);
      setSelectedBookId(null);
    }
  };

  const handlers = {
    onBookClick: handleBookClick,
    onAddToCollection: handleAddToCollection,
    onToggleFavorite: toggleFavorite,
    onToggleOwnedForSale: handleToggleOwnedForSale,
    onRateBook: rateBook,
  };

  const handleCloseBookDetail = () => {
    setIsBookDetailOpen(false);
    setSelectedBook(null);
  };

  const selectedBookTitle = selectedBookId ? books.find(book => book.id === selectedBookId)?.title || '' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {showHeader && <AppHeader title={headerTitle} subtitle={headerSubtitle} />}
      
      <div className="flex">
        {showSidebar && (
          <AppSidebar
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onOpenCollectionModal={handleOpenCollectionModal}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadCount}
            onDeleteCollection={deleteCollection}
          />
        )}
        
        <main className="flex-1">
          {typeof children === 'function' ? children(handlers) : children}
        </main>
      </div>

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={handleCloseCollectionModal}
        onCreateCollection={handleAddCollection}
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
        onClose={handleCloseBookDetail}
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

export default AppLayout;
