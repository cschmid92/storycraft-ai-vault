
import React from 'react';
import { X, Heart, Star, DollarSign, BookmarkPlus, Calendar, Building2, Globe, Hash, FileText, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StarRating from './StarRating';
import { Book } from '../types/Book';

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

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Book Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-96 mx-auto lg:mx-0">
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  {book.isOwnedForSale && book.salePrice && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      ${book.salePrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-6">
                {/* Title and Author */}
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{book.title}</h1>
                  <p className="text-xl text-slate-600 mb-4">by {book.author}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-medium text-slate-700">{book.rating}</span>
                      <span className="text-slate-500">({book.genre})</span>
                    </div>
                  </div>

                  {/* User Rating */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Your Rating:</p>
                    <StarRating
                      rating={book.userRating || 0}
                      onRatingChange={handleRatingChange}
                      interactive={true}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => onToggleFavorite(book.id)}
                    variant={book.isFavorite ? "default" : "outline"}
                    className={book.isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${book.isFavorite ? 'fill-white' : ''}`} />
                    {book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  <Button
                    onClick={() => onAddToCollection(book.id)}
                    variant="outline"
                  >
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Add to Collection
                  </Button>

                  <Button
                    onClick={() => onToggleOwnedForSale(book.id)}
                    variant={book.isOwnedForSale ? "default" : "outline"}
                    className={book.isOwnedForSale ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    {book.isOwnedForSale ? 'Remove from Sale' : 'Mark for Sale'}
                  </Button>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{book.description}</p>
                  {book.synopsis && (
                    <>
                      <h4 className="text-md font-semibold text-slate-800 mt-4 mb-2">Synopsis</h4>
                      <p className="text-slate-600 leading-relaxed">{book.synopsis}</p>
                    </>
                  )}
                </div>

                {/* Book Details Grid */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Book Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-700">Year:</span>
                      <span className="text-slate-600">{book.year}</span>
                    </div>
                    
                    {book.publisher && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">Publisher:</span>
                        <span className="text-slate-600">{book.publisher}</span>
                      </div>
                    )}
                    
                    {book.pages && (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">Pages:</span>
                        <span className="text-slate-600">{book.pages}</span>
                      </div>
                    )}
                    
                    {book.language && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">Language:</span>
                        <span className="text-slate-600">{book.language}</span>
                      </div>
                    )}
                    
                    {book.isbn10 && (
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">ISBN-10:</span>
                        <span className="text-slate-600">{book.isbn10}</span>
                      </div>
                    )}
                    
                    {book.isbn13 && (
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">ISBN-13:</span>
                        <span className="text-slate-600">{book.isbn13}</span>
                      </div>
                    )}
                    
                    {book.binding && (
                      <div className="flex items-center space-x-2">
                        <Bookmark className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">Binding:</span>
                        <span className="text-slate-600">{book.binding}</span>
                      </div>
                    )}
                    
                    {book.listPrice && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">List Price:</span>
                        <span className="text-slate-600">${book.listPrice}</span>
                      </div>
                    )}
                    
                    {book.subject && (
                      <div className="flex items-center space-x-2 md:col-span-2">
                        <span className="font-medium text-slate-700">Subject:</span>
                        <span className="text-slate-600">{book.subject}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
