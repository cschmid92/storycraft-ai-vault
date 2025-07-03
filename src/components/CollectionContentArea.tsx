
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookmarkPlus, Heart, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import BookCard from './BookCard';
import CollectionActions from './CollectionActions';
import { Book, Collection } from '../types/entities';

interface CollectionContentAreaProps {
  selectedCollection: Collection | { id: string; name: string; count: number; color: string };
  collectionBooks: Book[];
  canEdit: boolean;
  booksReadList: number[];
  onToggleFavorite: (bookId: number) => void;
  onBookClick: (book: Book) => void;
  onAddToCollection: (bookId: number) => void;
  onAddToBooksRead: (bookId: number) => void;
  onRemoveFromCollection?: (bookId: number) => void;
  onEditCollection: (collectionId: number) => void;
  onDeleteCollection: () => void;
  onShareCollection?: () => void;
}

const CollectionContentArea = ({
  selectedCollection,
  collectionBooks,
  canEdit,
  booksReadList,
  onToggleFavorite,
  onBookClick,
  onAddToCollection,
  onAddToBooksRead,
  onRemoveFromCollection,
  onEditCollection,
  onDeleteCollection,
  onShareCollection
}: CollectionContentAreaProps) => {
  const handleShareCollection = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Collection link copied!",
        description: "You can now share this collection with others.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShareCollection}
            >
              <Share2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <CollectionActions
              selectedCollection={selectedCollection}
              canEdit={canEdit}
              onEdit={onEditCollection}
              onDelete={onDeleteCollection}
            />
          </div>
        </div>
      </div>

      {(selectedCollection as Collection).description && (
        <div className="mb-6">
          <p className="text-slate-600">{(selectedCollection as Collection).description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {collectionBooks.map(book => (
          <BookCard 
            key={book.id}
            book={book}
            onToggleFavorite={onToggleFavorite}
            onBookClick={onBookClick}
            onAddToCollection={onAddToCollection}
            onAddToBooksRead={onAddToBooksRead}
            isInBooksRead={booksReadList.includes(Number(book.id))}
            onRemoveFromCollection={canEdit ? onRemoveFromCollection : undefined}
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
  );
};

export default CollectionContentArea;
