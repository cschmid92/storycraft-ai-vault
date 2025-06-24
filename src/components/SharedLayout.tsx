
import React, { useState } from 'react';
import SharedSidebar from './SharedSidebar';
import { useBooks } from '../hooks/useBooks';
import { useCollections } from '../hooks/useCollections';
import CollectionModal from './CollectionModal';
import CollectionSelectionModal from './CollectionSelectionModal';
import BookDetailModal from './BookDetailModal';
import { Book } from '../types/Book';
import { Collection } from '../hooks/useCollections';

interface SharedLayoutProps {
  children: React.ReactNode;
}

const SharedLayout = ({ children }: SharedLayoutProps) => {
  const { 
    books, 
    favorites, 
    booksRead, 
    booksReadCount,
    toggleFavorite, 
    addBookToCollection: addToUserCollection,
    toggleOwnedForSale,
    rateBook
  } = useBooks();
  
  const { 
    collections, 
    addCollection, 
    deleteCollection,
    addBookToCollection 
  } = useCollections();

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

  const handleConfirmAddToCollection = (collectionId: number | string) => {
    if (selectedBookId) {
      if (typeof collectionId === 'number') {
        addBookToCollection(collectionId, selectedBookId);
      } else {
        addToUserCollection(selectedBookId, collectionId);
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex w-full">
      <SharedSidebar
        collections={collections}
        selectedCollection={selectedCollection}
        onSelectCollection={handleSelectCollection}
        onOpenCollectionModal={handleOpenCollectionModal}
        books={books}
        onBookClick={handleBookClick}
        booksReadCount={booksReadCount}
        onDeleteCollection={deleteCollection}
      />
      
      <div className="flex-1">
        {children}
      </div>

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={handleCloseCollectionModal}
        onSave={handleAddCollection}
      />

      <CollectionSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onSelectCollection={handleConfirmAddToCollection}
        collections={collections}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={isBookDetailOpen}
        onClose={handleCloseBookDetail}
        onToggleFavorite={toggleFavorite}
        onAddToCollection={handleAddToCollection}
        onToggleOwnedForSale={toggleOwnedForSale}
        onRateBook={rateBook}
      />
    </div>
  );
};

export default SharedLayout;
