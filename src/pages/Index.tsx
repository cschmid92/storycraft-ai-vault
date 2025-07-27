import React, { useState, useRef } from 'react';
import { BookOpen, Search as SearchIcon, Filter, Heart, BookmarkPlus, Quote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PopularReads from '../components/PopularReads';
import Recommendations from '../components/Recommendations';
import AppLayout from '../components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useFavorites } from '../contexts/FavoritesContext';

const Index = () => {
  const { books } = useBooks();
  const { booksReadList, addToBooksRead, isInBooksRead, getBooksReadCount } = useBooksRead();
  const { getFavoriteBooks } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const collectionSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Books read collection count
  const booksReadCount = getBooksReadCount();

  const genres = [...new Set(books.map(book => book.genre))];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleAddToBooksRead = (bookId: number) => {
    console.log(`Adding/removing book ${bookId} to/from Books read collection`);
    addToBooksRead(bookId);
  };

  return (
    <AppLayout headerTitle="Bacondo" headerSubtitle="Your Digital Library">
      {({ onBookClick, onAddToCollection, onToggleFavorite }) => (
      <div className="p-4 md:p-6">
        {/* Search and Filters */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <Link to="/advanced-search">
                <Button variant="outline" size="sm" className="bg-white/80 border-slate-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Advanced</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Favorites</p>
                  <p className="text-2xl font-bold text-slate-800">{getFavoriteBooks().length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total books read</p>
                  <p className="text-2xl font-bold text-slate-800">{booksReadCount}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Collections</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
                </div>
                <BookmarkPlus className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quote of the Day */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 md:p-6 border border-indigo-200">
            <div className="flex items-start gap-3">
              <Quote className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Quote of the Day</h3>
                <blockquote className="text-slate-700 italic text-base md:text-lg leading-relaxed mb-2">
                  "A reader lives a thousand lives before he dies. The man who never reads lives only one."
                </blockquote>
                <cite className="text-slate-600 text-sm">— George R.R. Martin</cite>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Reads */}
        <PopularReads 
          books={books} 
          onBookClick={onBookClick}
          onToggleFavorite={onToggleFavorite}
          onAddToCollection={onAddToCollection}
          onAddToBooksRead={handleAddToBooksRead}
          isInBooksRead={isInBooksRead}
        />

        {/* Recommendations */}
        <Recommendations 
          books={books} 
          onBookClick={onBookClick}
          onToggleFavorite={onToggleFavorite}
          onAddToCollection={onAddToCollection}
          onAddToBooksRead={handleAddToBooksRead}
          isInBooksRead={isInBooksRead}
        />
      </div>
      )}
    </AppLayout>
  );
};

export default Index;