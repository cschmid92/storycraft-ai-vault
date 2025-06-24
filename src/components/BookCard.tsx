
import React from 'react';
import { Star, Heart, BookmarkPlus, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/Book';

interface BookCardProps {
  book: Book;
  onToggleFavorite: (bookId: number) => void;
  onBookClick: (book: Book) => void;
  onAddToCollection: (bookId: number) => void;
  onAddToBooksRead: (bookId: number) => void;
  isInBooksRead?: boolean;
}

const BookCard = ({ book, onToggleFavorite, onBookClick, onAddToCollection, onAddToBooksRead, isInBooksRead = false }: BookCardProps) => {
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
        
        {/* Action Buttons - Correct order: 1. Favorites, 2. Books Read, 3. Add to Collection */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${book.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} 
            />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
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
              e.stopPropagation();
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

        {/* Description Preview */}
        <p className="text-slate-600 text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {book.description}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
