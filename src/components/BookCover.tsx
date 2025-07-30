
import React from 'react';

interface BookCoverProps {
  cover: string;
  title: string;
  isOwnedForSale: boolean;
  salePrice?: number;
}

const BookCover = ({ cover, title, isOwnedForSale, salePrice }: BookCoverProps) => {
  return (
    <div className="flex-shrink-0">
      <div className="relative w-64 h-96 mx-auto lg:mx-0">
        <img 
          src={cover} 
          alt={title}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        {isOwnedForSale && salePrice && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            CHF {salePrice.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCover;
