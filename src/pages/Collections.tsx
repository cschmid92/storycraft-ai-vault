
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookmarkPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CollectionContentArea from '../components/CollectionContentArea';
import AppLayout from '../components/layout/AppLayout';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  
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

  const handleRemoveFromCollection = (bookId: number) => {
    if (selectedCollection && typeof selectedCollection.id === 'number') {
      removeBookFromCollection(selectedCollection.id, bookId);
      console.log(`Removed book ${bookId} from collection ${selectedCollection.name}`);
    }
  };

  const handleAddToBooksRead = (bookId: number) => {
    addToBooksRead(bookId);
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
      <AppLayout headerTitle="Bacondo" headerSubtitle="Your Digital Library">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookmarkPlus className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Collection not found</h2>
            <Button onClick={() => navigate('/')}>Go back to library</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const canEdit = typeof selectedCollection.id === 'number';

  return (
    <AppLayout headerTitle="Bacondo" headerSubtitle="Your Digital Library">
      <CollectionContentArea
        selectedCollection={selectedCollection}
        collectionBooks={collectionBooks}
        canEdit={canEdit}
        booksReadList={booksReadList}
        onToggleFavorite={toggleFavorite}
        onBookClick={(book) => console.log("Book clicked:", book.title)}
        onAddToCollection={(bookId) => console.log("Add to collection:", bookId)}
        onAddToBooksRead={handleAddToBooksRead}
        onRemoveFromCollection={canEdit ? handleRemoveFromCollection : undefined}
        onEditCollection={handleEditCollection}
        onDeleteCollection={handleDeleteCollection}
      />
    </AppLayout>
  );
};

export default Collections;
