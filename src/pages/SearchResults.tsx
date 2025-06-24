
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookCard from '../components/BookCard';
import SharedLayout from '../components/SharedLayout';
import PageHeader from '../components/PageHeader';
import { Book } from '../types/Book';
import { Link } from 'react-router-dom';

// Mock data - in a real app this would come from search API
const mockSearchResults: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    isFavorite: false,
    isOwnedForSale: false,
    isbn10: "0743273567",
    isbn13: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    language: "English"
  }
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [filterGenre, setFilterGenre] = useState("");

  const genres = [...new Set(mockSearchResults.map(book => book.genre))];

  const filteredBooks = mockSearchResults.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <SharedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <PageHeader
          title="Search Results"
          subtitle={query ? `Results for "${query}"` : 'Search results'}
          icon={Search}
          iconGradient="from-blue-600 to-indigo-600"
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-slate-300"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <Link to="/advanced-search">
                  <Button variant="outline" className="bg-white/80 border-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Search Results</h2>
              <p className="text-slate-600">
                {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id}
                book={book}
                onToggleFavorite={() => {}}
                onBookClick={() => {}}
                onAddToCollection={() => {}}
                onAddToBooksRead={() => {}}
              />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </main>
      </div>
    </SharedLayout>
  );
};

export default SearchResults;
