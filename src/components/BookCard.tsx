
import React from 'react';
import { Star, Heart, BookmarkPlus, BookOpen, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/entities';
import { useFavorites } from '../contexts/FavoritesContext';
import { useBooksForSale } from '../hooks/useBooksForSale';

interface BookCardProps {
  book: Book;
  onToggleFavorite: (bookId: number) => void;
  onBookClick: (book: Book) => void;
  onAddToCollection: (bookId: number) => void;
  onAddToBooksRead: (bookId: number) => void;
  onToggleOwnedForSale?: (bookId: number, price?: number) => void;
  isInBooksRead?: boolean;
  onRemoveFromCollection?: (bookId: number) => void;
  showRemoveFromCollection?: boolean;
}

const BookCard = ({ 
  book, 
  onToggleFavorite, 
  onBookClick, 
  onAddToCollection, 
  onAddToBooksRead, 
  onToggleOwnedForSale,
  isInBooksRead = false,
  onRemoveFromCollection,
  showRemoveFromCollection = false
}: BookCardProps) => {
  const { isFavorite } = useFavorites();
  const { isBookForSale } = useBooksForSale();
  return (
    <div 
      className="group relative bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
      onClick={() => onBookClick(book)}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {showRemoveFromCollection && onRemoveFromCollection && (
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 bg-red-500/80 backdrop-blur-md border-red-400 hover:bg-red-600 text-white"
              onClick={(e) => {
                if (e) e.stopPropagation();
                onRemoveFromCollection(book.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
            onClick={(e) => {
              if (e) e.stopPropagation();
              onToggleFavorite(book.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite(book.id) ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} 
            />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
            onClick={(e) => {
              if (e) e.stopPropagation();
              onAddToBooksRead(book.id);
            }}
          >
            <BookOpen className={`h-4 w-4 ${isInBooksRead ? 'text-green-600 fill-green-600' : 'text-green-600'}`} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
            onClick={(e) => {
              if (e) e.stopPropagation();
              onAddToCollection(book.id);
            }}
          >
            <BookmarkPlus className="h-4 w-4 text-slate-600" />
          </Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-medium text-slate-700">{book.rating}</span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-3 md:p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-slate-800 text-xs md:text-sm leading-tight line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-slate-600 text-xs mb-2">{book.author}</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            {book.genre}
          </span>
          <span className="text-slate-500">{book.year}</span>
        </div>

      </div>
    </div>
  );
};

export default BookCard;
