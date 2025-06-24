
import React from 'react';
import SearchBar from './SearchBar';

interface BuyUsedBooksFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  maxDistance: number | null;
  onDistanceChange: (distance: number | null) => void;
  genres: string[];
}

const BuyUsedBooksFilters = ({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  maxDistance,
  onDistanceChange,
  genres
}: BuyUsedBooksFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      
      <div className="flex flex-wrap gap-4">
        {/* Genre Filter */}
        <div className="flex-1 min-w-48">
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="flex-1 min-w-48">
          <input
            type="number"
            placeholder="Max distance (km)"
            value={maxDistance || ''}
            onChange={(e) => onDistanceChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BuyUsedBooksFilters;
