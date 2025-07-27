
import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import AppLayout from '../components/layout/AppLayout';
import PriceInputModal from '../components/PriceInputModal';
import { BookService } from '../services/bookService';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../contexts/BooksReadContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useBooksForSale } from '../hooks/useBooksForSale';

const SearchResults = () => {
  const { books } = useBooks();
  const { toggleFavorite } = useFavorites();
  const { addBookForSale, removeBookForSale, isBookForSale } = useBooksForSale();
  const { addToBooksRead, isInBooksRead } = useBooksRead();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedBookForSale, setSelectedBookForSale] = useState(null);

  const searchResults = BookService.searchBooks(query, genre);


  const handleToggleOwnedForSale = (bookId, price) => {
    if (!isBookForSale(bookId)) {
      setSelectedBookForSale(bookId);
      setIsPriceModalOpen(true);
    } else {
      removeBookForSale(bookId);
    }
  };

  const handleSetSalePrice = (price, condition) => {
    if (selectedBookForSale) {
      addBookForSale(selectedBookForSale, price, condition);
      setSelectedBookForSale(null);
    }
  };

  const handleAddToBooksRead = (bookId) => {
    addToBooksRead(bookId);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      window.location.reload();
    }
  };

  const selectedBookForSaleTitle = selectedBookForSale 
    ? books.find(book => book.id === selectedBookForSale)?.title || ""
    : "";

  return (
    <AppLayout headerTitle="Bacondo" headerSubtitle="Your Digital Library">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            {/* Back button and title */}
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold text-slate-800">
                Search Results {query && `for "${query}"`}
              </h2>
            </div>
              
              <div className="flex gap-2 mb-4">
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
              
              <p className="text-slate-600">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
            </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onToggleFavorite={toggleFavorite}
                  onAddToCollection={() => {}}
                  onBookClick={() => {}}
                  onToggleOwnedForSale={handleToggleOwnedForSale}
                  onAddToBooksRead={handleAddToBooksRead}
                  isInBooksRead={isInBooksRead(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search terms or browse our collection</p>
              <Link to="/">
                <Button className="mt-4">Browse Books</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <PriceInputModal 
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false);
          setSelectedBookForSale(null);
        }}
        onConfirm={handleSetSalePrice}
        bookTitle={selectedBookForSaleTitle}
      />
    </AppLayout>
  );
};

export default SearchResults;
