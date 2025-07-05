
import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import SharedSidebar from '../components/SharedSidebar';
import CollectionModal from '../components/CollectionModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import BookDetailModal from '../components/BookDetailModal';
import PriceInputModal from '../components/PriceInputModal';
import { SearchService } from '../services/mockDataService';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';

const SearchResults = () => {
  const { collections, addCollection, addBookToCollection } = useCollections();
  const { books, toggleFavorite, toggleOwnedForSale, rateBook } = useBooks();
  const { booksReadList, addToBooksRead, isInBooksRead, getBooksReadCount } = useBooksRead();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState(null);
  const [selectedBookForSale, setSelectedBookForSale] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const searchResults = SearchService.searchBooks(query, genre);

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    if (String(collection?.id) === 'favorites') {
      navigate('/collections/favorites');
    } else if (String(collection?.id) === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
    }
    setIsSidebarOpen(false);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const handleCreateCollection = (name, color) => {
    addCollection(name, color);
  };

  const handleAddToCollection = (bookId) => {
    setSelectedBookForCollection(books.find(b => b.id === bookId));
    setIsCollectionSelectionModalOpen(true);
  };

  const handleCollectionSelection = (collection) => {
    if (collection && selectedBookForCollection) {
      addBookToCollection(collection.id, selectedBookForCollection.id);
    }
    setSelectedBookForCollection(null);
    setIsCollectionSelectionModalOpen(false);
  };

  const handleToggleOwnedForSale = (bookId, price) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    if (!book.isOwnedForSale) {
      setSelectedBookForSale(bookId);
      setIsPriceModalOpen(true);
    } else {
      toggleOwnedForSale(bookId);
    }
  };

  const handleSetSalePrice = (price, condition) => {
    if (selectedBookForSale) {
      toggleOwnedForSale(selectedBookForSale, price);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <UnifiedHeader 
        showMobileMenu={true}
        onMobileMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex">
        {/* Sidebar - Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-50 md:z-auto`}>
          <SharedSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={getBooksReadCount()}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="mb-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Search Results {query && `for "${query}"`}
              </h2>
              
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
                    onAddToCollection={handleAddToCollection}
                    onBookClick={handleBookClick}
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
        </main>
      </div>

      {/* Modals */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />

      <CollectionSelectionModal
        isOpen={isCollectionSelectionModalOpen}
        onClose={() => setIsCollectionSelectionModalOpen(false)}
        collections={collections}
        onSelectCollection={handleCollectionSelection}
        bookTitle={selectedBookForCollection?.title || ""}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={isBookDetailModalOpen}
        onClose={() => setIsBookDetailModalOpen(false)}
        onToggleFavorite={toggleFavorite}
        onAddToCollection={handleAddToCollection}
        onToggleOwnedForSale={handleToggleOwnedForSale}
        onRateBook={rateBook}
      />

      <PriceInputModal 
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false);
          setSelectedBookForSale(null);
        }}
        onConfirm={handleSetSalePrice}
        bookTitle={selectedBookForSaleTitle}
      />
    </div>
  );
};

export default SearchResults;
