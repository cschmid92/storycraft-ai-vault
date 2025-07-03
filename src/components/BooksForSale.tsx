
import React from 'react';
import { DollarSign, Tag } from 'lucide-react';
import { Book, BookForSale } from '../types/entities';
import { useBooksForSale } from '../hooks/useBooksForSale';

interface BooksForSaleProps {
  onBookClick: (book: Book) => void;
}

const BooksForSale = ({ onBookClick }: BooksForSaleProps) => {
  const { getMyBooksForSale } = useBooksForSale();
  const myBooksForSale = getMyBooksForSale();

  if (myBooksForSale.length === 0) {
    return (
      <div className="p-4 text-center">
        <DollarSign className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No books for sale</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {myBooksForSale.map((bookForSale) => {
        const book = bookForSale.book;
        if (!book) return null;
        
        return (
        <div
          key={bookForSale.id}
          className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 cursor-pointer transition-colors"
          onClick={() => onBookClick(book)}
        >
          <img 
            src={book.cover} 
            alt={book.title}
            className="w-10 h-14 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-800 text-sm truncate">{book.title}</h4>
            <p className="text-slate-600 text-xs truncate">{book.author}</p>
            <div className="flex items-center gap-1 mt-1">
              <Tag className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium text-sm">${bookForSale.price}</span>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default BooksForSale;
