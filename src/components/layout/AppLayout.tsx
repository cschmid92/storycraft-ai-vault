
import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { useBooks } from '../../hooks/useBooks';
import { useCollections } from '../../hooks/useCollections';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBooksForSale } from '../../hooks/useBooksForSale';
import { useUserRatings } from '../../hooks/useUserRatings';
import CollectionModal from '../CollectionModal';
import CollectionSelectionModal from '../CollectionSelectionModal';
import BookDetailModal from '../BookDetailModal';
import { Book, Collection } from '../../types/entities';

interface AppLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  showMobileMenu?: boolean;
}

const AppLayout = ({ 
  children, 
  headerTitle,
  headerSubtitle,
  showSidebar = true,
  showHeader = true,
  showMobileMenu = true
}: AppLayoutProps) => {
  const { books } = useBooks();
  const { toggleFavorite } = useFavorites();
  const { addBookForSale, removeBookForSale } = useBooksForSale();
  const { rateBook } = useUserRatings();
  
  const { 
    collections, 
    addCollection, 
    deleteCollection,
    addBookToCollection 
  } = useCollections();

  // Compute derived values from books
  const booksRead = books.filter(book => book.userRating && book.userRating > 0);
  const booksReadCount = booksRead.length;

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleConfirmAddToCollection = (collection: Collection) => {
    if (selectedBookId) {
      addBookToCollection(collection.id, selectedBookId);
      setIsSelectionModalOpen(false);
      setSelectedBookId(null);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailOpen(true);
  };

  const handleCloseBookDetail = () => {
    setIsBookDetailOpen(false);
    setSelectedBook(null);
  };

  const selectedBookTitle = selectedBookId ? books.find(book => book.id === selectedBookId)?.title || '' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {showHeader && (
        <AppHeader 
          title={headerTitle} 
          subtitle={headerSubtitle} 
          showMobileMenu={showMobileMenu}
          onMobileMenuClick={() => setIsSidebarOpen(true)}
        />
      )}
      
      <div className="flex">
        {/* Sidebar - Mobile overlay */}
        {showSidebar && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {showSidebar && (
          <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-50 md:z-auto`}>
            <AppSidebar
              collections={collections}
              selectedCollection={selectedCollection}
              onSelectCollection={(collection) => {
                handleSelectCollection(collection);
                setIsSidebarOpen(false); // Close mobile sidebar on selection
              }}
              onOpenCollectionModal={handleOpenCollectionModal}
              books={books}
              onBookClick={handleBookClick}
              booksReadCount={booksReadCount}
              onDeleteCollection={deleteCollection}
            />
          </div>
        )}
        
        <main className="flex-1">
          {children}
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
