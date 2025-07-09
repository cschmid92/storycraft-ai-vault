
import React from 'react';
import { DollarSign, Tag } from 'lucide-react';
import { Book } from '../types/entities';
import { booksForSale } from '../data/mockData';

interface BooksForSaleProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const BooksForSale = ({ books, onBookClick }: BooksForSaleProps) => {
  // Use booksForSale data instead of book properties
  const myBooksForSale = booksForSale.filter(sale => 
    sale.sellerId === 999 && sale.status === 'Available'
  );
  const booksToShow = myBooksForSale.map(sale => sale.book).filter(Boolean) as any[];

  if (booksToShow.length === 0) {
    return (
      <div className="p-4 text-center">
        <DollarSign className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No books for sale</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {myBooksForSale.map((sale) => (
        <div
          key={sale.id}
          className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 cursor-pointer transition-colors"
          onClick={() => sale.book && onBookClick(sale.book)}
        >
          <img 
            src={sale.book?.cover} 
            alt={sale.book?.title}
            className="w-10 h-14 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-800 text-sm truncate">{sale.book?.title}</h4>
            <p className="text-slate-600 text-xs truncate">{sale.book?.author}</p>
            <div className="flex items-center gap-1 mt-1">
              <Tag className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium text-sm">${sale.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksForSale;
