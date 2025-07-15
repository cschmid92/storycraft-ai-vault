import React from 'react';
import { Star, MapPin, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BookForSale } from '../types/entities';

interface UsedBookCardProps {
  bookForSale: BookForSale;
  onBookClick: (bookForSale: BookForSale) => void;
  onContactSeller: (bookForSale: BookForSale) => void;
}

const UsedBookCard = ({ bookForSale, onBookClick, onContactSeller }: UsedBookCardProps) => {
  const book = bookForSale.book;
  if (!book) return null;

  return (
    <div 
      className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
      onClick={() => onBookClick(bookForSale)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {bookForSale.distance} km
        </div>
        {bookForSale.condition && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {bookForSale.condition}
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
        
        {/* Seller Info */}
        {bookForSale.seller && (
          <div className="flex items-center space-x-2 mt-3 p-2 bg-slate-50 rounded-lg">
            <img 
              src={bookForSale.seller.avatar} 
              alt={`${bookForSale.seller.firstName} ${bookForSale.seller.lastName}`}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{bookForSale.seller.firstName} {bookForSale.seller.lastName}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-slate-600">{bookForSale.seller.rating}</span>
              </div>
            </div>
            <User className="h-3 w-3 text-slate-400" />
          </div>
        )}
        
        <Button 
          className="w-full mt-3" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onContactSeller(bookForSale);
          }}
        >
          Contact Seller - {bookForSale.currency} {bookForSale.price}
        </Button>
      </div>
    </div>
  );
};

export default UsedBookCard;
