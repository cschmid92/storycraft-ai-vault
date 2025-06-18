
import React from 'react';
import { Star, Heart, BookmarkPlus, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  year: number;
  description: string;
  isFavorite: boolean;
}

interface BookCardProps {
  book: Book;
  onToggleFavorite: (bookId: number) => void;
}

const BookCard = ({ book, onToggleFavorite }: BookCardProps) => {
  return (
    <div className="group relative bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
            onClick={() => onToggleFavorite(book.id)}
          >
            <Heart 
              className={`h-4 w-4 ${book.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
          >
            <BookmarkPlus className="h-4 w-4 text-white" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
          >
            <MoreVertical className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">{book.rating}</span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-blue-200 text-xs mb-2">{book.author}</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
            {book.genre}
          </span>
          <span className="text-blue-300">{book.year}</span>
        </div>

        {/* Description Preview */}
        <p className="text-blue-200 text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {book.description}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
