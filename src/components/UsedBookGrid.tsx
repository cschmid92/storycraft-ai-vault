
import React from 'react';
import { DollarSign } from 'lucide-react';
import { BookForSale } from '../types/entities';
import UsedBookCard from './UsedBookCard';

interface UsedBookGridProps {
  booksForSale: BookForSale[];
  onBookClick: (bookForSale: BookForSale) => void;
  onContactSeller: (bookForSale: BookForSale) => void;
}

const UsedBookGrid = ({ booksForSale, onBookClick, onContactSeller }: UsedBookGridProps) => {
  if (booksForSale.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
        <p className="text-slate-500">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {booksForSale.map(bookForSale => (
        <UsedBookCard
          key={bookForSale.id}
          bookForSale={bookForSale}
          onBookClick={onBookClick}
          onContactSeller={onContactSeller}
        />
      ))}
    </div>
  );
};

export default UsedBookGrid;
