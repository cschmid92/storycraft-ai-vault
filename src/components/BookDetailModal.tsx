import React from 'react';
import BookDetailHeader from './BookDetailHeader';
import BookCover from './BookCover';
import BookInfo from './BookInfo';
import BookActions from './BookActions';
import BookDescription from './BookDescription';
import BookDetailsGrid from './BookDetailsGrid';
import { Book } from '../types/entities';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (bookId: number) => void;
  onAddToCollection: (bookId: number) => void;
  onToggleOwnedForSale: (bookId: number, price?: number) => void;
  onRateBook: (bookId: number, rating: number) => void;
}

const BookDetailModal = ({ 
  book, 
  isOpen, 
  onClose, 
  onToggleFavorite, 
  onAddToCollection,
  onToggleOwnedForSale,
  onRateBook
}: BookDetailModalProps) => {
  if (!isOpen || !book) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRatingChange = (rating: number) => {
    onRateBook(book.id, rating);
  };

  const handleToggleFavorite = (bookId: number) => {
    onToggleFavorite(bookId);
  };

  const handleToggleOwnedForSale = (bookId: number, price?: number) => {
    onToggleOwnedForSale(bookId, price);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          <BookDetailHeader onClose={onClose} />

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <BookCover 
                cover={book.cover}
                title={book.title}
                isOwnedForSale={book.isOwnedForSale}
                salePrice={book.salePrice}
              />

              <div className="flex-1 space-y-6">
                <BookInfo
                  title={book.title}
                  author={book.author}
                  rating={book.rating}
                  genre={book.genre}
                  userRating={book.userRating}
                  onRatingChange={handleRatingChange}
                />

                <BookActions
                  bookId={book.id}
                  isFavorite={book.isFavorite}
                  isOwnedForSale={book.isOwnedForSale}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCollection={onAddToCollection}
                  onToggleOwnedForSale={handleToggleOwnedForSale}
                  bookTitle={book.title}
                />

                <BookDescription
                  description={book.description}
                  synopsis={book.synopsis}
                />

                <BookDetailsGrid book={book} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
