
import React, { useState } from 'react';
import { Heart, BookmarkPlus, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PriceInputModal from './PriceInputModal';
import { useBooksForSale } from '../hooks/useBooksForSale';

interface BookActionsProps {
  bookId: number;
  isFavorite: boolean;
  onToggleFavorite: (bookId: number) => void;
  onAddToCollection: (bookId: number) => void;
  bookTitle?: string;
}

const BookActions = ({ 
  bookId, 
  isFavorite, 
  onToggleFavorite, 
  onAddToCollection, 
  bookTitle = "this book"
}: BookActionsProps) => {
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const { isBookForSale, addBookForSale, removeBookForSale } = useBooksForSale();

  const handleBuyOnline = () => {
    // Open Orell Füssli search for the book - in a real app, you'd use the book's ISBN or title
    window.open('https://www.orellfuessli.ch/', '_blank');
  };

  const isForSale = isBookForSale(bookId);

  const handleToggleForSale = () => {
    if (isForSale) {
      // Remove from sale
      removeBookForSale(bookId);
    } else {
      // Show price input modal
      setIsPriceModalOpen(true);
    }
  };

  const handlePriceConfirm = (price: number, condition: string) => {
    addBookForSale(bookId, price, condition);
    setIsPriceModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => onToggleFavorite(bookId)}
          variant={isFavorite ? "default" : "outline"}
          className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-white' : ''}`} />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
        
        <Button
          onClick={() => onAddToCollection(bookId)}
          variant="outline"
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Add to Collection
        </Button>

        <Button
          onClick={handleToggleForSale}
          variant={isForSale ? "default" : "outline"}
          className={isForSale ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          {isForSale ? 'Remove from Sale' : 'Mark for Sale'}
        </Button>

        <Button
          onClick={handleBuyOnline}
          variant="outline"
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Buy Online
        </Button>
      </div>

      <PriceInputModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onConfirm={handlePriceConfirm}
        bookTitle={bookTitle}
      />
    </>
  );
};

export default BookActions;
