
import React from 'react';
import { Heart, BookmarkPlus, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BookActionsProps {
  bookId: number;
  isFavorite: boolean;
  isOwnedForSale: boolean;
  onToggleFavorite: (bookId: number) => void;
  onAddToCollection: (bookId: number) => void;
  onToggleOwnedForSale: (bookId: number) => void;
}

const BookActions = ({ 
  bookId, 
  isFavorite, 
  isOwnedForSale, 
  onToggleFavorite, 
  onAddToCollection, 
  onToggleOwnedForSale 
}: BookActionsProps) => {
  return (
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
        onClick={() => onToggleOwnedForSale(bookId)}
        variant={isOwnedForSale ? "default" : "outline"}
        className={isOwnedForSale ? "bg-green-500 hover:bg-green-600" : ""}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        {isOwnedForSale ? 'Remove from Sale' : 'Mark for Sale'}
      </Button>
    </div>
  );
};

export default BookActions;
