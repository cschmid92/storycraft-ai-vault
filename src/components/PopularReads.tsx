import React from 'react';
import { TrendingUp, Star, Heart, BookmarkPlus, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/entities';
import { useFavorites } from '../contexts/FavoritesContext';

interface PopularReadsProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onToggleFavorite: (bookId: number) => void;
  onAddToCollection: (bookId: number) => void;
  onAddToBooksRead: (bookId: number) => void;
  isInBooksRead?: (bookId: number) => boolean;
}

const PopularReads = ({ books, onBookClick, onToggleFavorite, onAddToCollection, onAddToBooksRead, isInBooksRead }: PopularReadsProps) => {
  const { isFavorite } = useFavorites();
  const popularBooks = books.slice(0, 5); // Show top 5 popular books

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Popular Reads</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {popularBooks.map((book, index) => (
          <div key={book.id} className="group cursor-pointer">
            <div className="relative">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                onClick={() => onBookClick(book)}
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                #{index + 1}
              </div>
              
              {/* Action Buttons - Fixed order: 1. Favorites, 2. Books Read, 3. Add to Collection */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-7 h-7 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(book.id);
                  }}
                >
                  <Heart 
                    className={`h-3 w-3 ${isFavorite(book.id) ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} 
                  />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-7 h-7 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToBooksRead(book.id);
                  }}
                >
                  <BookOpen className={`h-3 w-3 ${isInBooksRead && isInBooksRead(book.id) ? 'text-green-600 fill-green-600' : 'text-green-600'}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-7 h-7 p-0 bg-white/80 backdrop-blur-md border-slate-300 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCollection(book.id);
                  }}
                >
                  <BookmarkPlus className="h-3 w-3 text-slate-600" />
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <h3 
                className="font-medium text-slate-800 text-sm line-clamp-2 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onBookClick(book)}
              >
                {book.title}
              </h3>
              <p className="text-slate-600 text-xs mb-2">{book.author}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-slate-700">{book.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularReads;
