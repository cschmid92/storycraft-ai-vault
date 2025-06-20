
import React from 'react';
import { Star } from 'lucide-react';
import StarRating from './StarRating';

interface BookInfoProps {
  title: string;
  author: string;
  rating: number;
  genre: string;
  userRating?: number;
  onRatingChange: (rating: number) => void;
}

const BookInfo = ({ title, author, rating, genre, userRating, onRatingChange }: BookInfoProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-xl text-slate-600 mb-4">by {author}</p>
      
      {/* Rating */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="text-lg font-medium text-slate-700">{rating}</span>
          <span className="text-slate-500">({genre})</span>
        </div>
      </div>

      {/* User Rating */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Your Rating:</p>
        <StarRating
          rating={userRating || 0}
          onRatingChange={onRatingChange}
          readonly={false}
        />
      </div>
    </div>
  );
};

export default BookInfo;
