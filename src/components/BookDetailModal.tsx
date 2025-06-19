
import React from 'react';
import { X, Star, Heart, BookmarkPlus, DollarSign, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/Book';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (bookId: number) => void;
  onAddToCollection: (bookId: number) => void;
  onToggleOwnedForSale: (bookId: number, price?: number) => void;
}

const BookDetailModal = ({ book, isOpen, onClose, onToggleFavorite, onAddToCollection, onToggleOwnedForSale }: BookDetailModalProps) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Book Details</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
              
              {/* Resale Availability Badge */}
              {book.isOwnedForSale && book.salePrice && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium text-sm">Available for Sale</span>
                  </div>
                  <p className="text-green-600 text-lg font-bold mt-1">${book.salePrice}</p>
                </div>
              )}
              
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleFavorite(book.id)}
                  className="flex items-center gap-2"
                >
                  <Heart 
                    className={`h-4 w-4 ${book.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} 
                  />
                  {book.isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onAddToCollection(book.id)}
                  className="flex items-center gap-2"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Add to Collection
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleOwnedForSale(book.id)}
                  className={`flex items-center gap-2 ${book.isOwnedForSale ? 'bg-green-50 text-green-700 border-green-300' : ''}`}
                >
                  <DollarSign className="h-4 w-4" />
                  {book.isOwnedForSale ? 'Listed for Sale' : 'Mark as Owned for Sale'}
                </Button>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{book.title}</h1>
                  <p className="text-xl text-slate-600 mb-2">by {book.author}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{book.rating}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {book.genre}
                    </span>
                  </div>
                </div>
                
                {/* Publication Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">ISBN-10:</span>
                    <p className="text-slate-600">{book.isbn10 || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">ISBN-13:</span>
                    <p className="text-slate-600">{book.isbn13 || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Publisher:</span>
                    <p className="text-slate-600">{book.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Publication Date:</span>
                    <p className="text-slate-600">{book.publicationDate || book.year}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Pages:</span>
                    <p className="text-slate-600">{book.pages || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Language:</span>
                    <p className="text-slate-600">{book.language || 'English'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Binding:</span>
                    <p className="text-slate-600">{book.binding || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Format:</span>
                    <p className="text-slate-600">{book.format || 'N/A'}</p>
                  </div>
                  {book.listPrice && (
                    <div>
                      <span className="font-semibold text-slate-700">List Price:</span>
                      <p className="text-slate-600">${book.listPrice}</p>
                    </div>
                  )}
                  {book.weight && (
                    <div>
                      <span className="font-semibold text-slate-700">Weight:</span>
                      <p className="text-slate-600">{book.weight}</p>
                    </div>
                  )}
                  {book.dimensions && (
                    <div>
                      <span className="font-semibold text-slate-700">Dimensions:</span>
                      <p className="text-slate-600">{book.dimensions}</p>
                    </div>
                  )}
                </div>
                
                {/* Synopsis */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Synopsis</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {book.synopsis || book.description}
                  </p>
                </div>
                
                {book.subject && (
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Subject</h3>
                    <p className="text-slate-600">{book.subject}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
