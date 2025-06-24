import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/entities';

interface UsedBookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

const UsedBookCard = ({ book, onBookClick }: UsedBookCardProps) => {
  return (
    <div 
      className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
      onClick={() => onBookClick(book)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {book.distance} km
        </div>
        {book.condition && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {book.condition}
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-medium text-slate-700">{book.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-slate-600 text-xs mb-2">{book.author}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {book.genre}
          </span>
          <span className="text-slate-500">{book.year}</span>
        </div>
        <p className="text-slate-600 text-xs mt-2 line-clamp-2">
          {book.description}
        </p>
        <Button 
          className="w-full mt-3" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            // Handle purchase logic here
          }}
        >
          Buy for ${book.salePrice}
        </Button>
      </div>
    </div>
  );
};

export default UsedBookCard;
