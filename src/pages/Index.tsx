import React, { useState, useRef } from 'react';
import { BookOpen, User, Search as SearchIcon, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import CollectionModal from '../components/CollectionModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import SearchBar from '../components/SearchBar';
import AppSidebar from '../components/layout/AppSidebar';
import BookDetailModal from '../components/BookDetailModal';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import PopularReads from '../components/PopularReads';
import Recommendations from '../components/Recommendations';
import PriceInputModal from '../components/PriceInputModal';
import { Button } from "@/components/ui/button";
import { Book, BookCondition } from '../types/entities';
import { Plus, Filter, Heart, Star, BookmarkPlus, Quote } from 'lucide-react';
import { useCollections, Collection } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useFavorites } from '../hooks/useFavorites';
import { useUserRatings } from '../hooks/useUserRatings';
import { useBooksForSale } from '../hooks/useBooksForSale';

const Index = () => {
  const { collections, addCollection, deleteCollection, addBookToCollection } = useCollections();
  const { books } = useBooks();
  const { booksReadList, addToBooksRead, isInBooksRead, getBooksReadCount } = useBooksRead();
  const { toggleFavorite, isFavorite, getFavoriteBooks } = useFavorites();
  const { rateBook, getUserRating } = useUserRatings();
  const { addBookForSale, removeBookForSale, isBookForSale } = useBooksForSale();

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCollectionSelectionOpen, setIsCollectionSelectionOpen] = useState(false);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailOpen, setIsBookDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedBookForSale, setSelectedBookForSale] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const collectionSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Books read collection count
  const booksReadCount = getBooksReadCount();

  // Total collections including default ones (Favorites and Books read)
  const totalCollections = collections.length + 2;

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(books.map(book => book.genre))];

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  const handleToggleOwnedForSale = (bookId: number, price?: number) => {
    if (!isBookForSale(bookId)) {
      setSelectedBookForSale(bookId);
      setIsPriceModalOpen(true);
    } else {
      removeBookForSale(bookId);
    }
  };

  const handleSetSalePrice = (price: number, condition: string) => {
    if (selectedBookForSale) {
      addBookForSale(selectedBookForSale, price, condition);
      setSelectedBookForSale(null);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailOpen(true);
  };

  const handleAddToCollection = (bookId: number) => {
    setSelectedBookForCollection(bookId);
    setIsCollectionSelectionOpen(true);
  };

  const handleCollectionSelect = (collection: Collection | null) => {
    setSelectedCollection(collection);
    if (String(collection?.id) === 'favorites') {
      navigate('/collections/favorites');
    } else if (String(collection?.id) === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
    }
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleCollectionSelection = (collection: Collection) => {
    if (collection && selectedBookForCollection) {
      addBookToCollection(collection.id, selectedBookForCollection);
      console.log(`Added "${books.find(b => Number(b.id) === selectedBookForCollection)?.title}" to collection "${collection.name}"`);
    }
    setSelectedBookForCollection(null);
    setIsCollectionSelectionOpen(false);
  };

  const handleRateBook = (bookId: number, rating: number) => {
    rateBook(bookId, rating);
  };

  const handleAddToBooksRead = (bookId: number) => {
    console.log(`Adding/removing book ${bookId} to/from Books read collection`);
    addToBooksRead(bookId);
  };

  const selectedBookTitle = selectedBookForCollection 
    ? books.find(book => book.id === selectedBookForCollection)?.title || ""
    : "";

  const selectedBookForSaleTitle = selectedBookForSale 
    ? books.find(book => book.id === selectedBookForSale)?.title || ""
    : "";

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

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
          <AppSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadCount}
            onDeleteCollection={deleteCollection}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
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
                    <p className="text-2xl font-bold text-slate-800">{totalCollections}</p>
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
            onBookClick={handleBookClick}
            onToggleFavorite={toggleFavorite}
            onAddToCollection={handleAddToCollection}
            onAddToBooksRead={handleAddToBooksRead}
            isInBooksRead={isInBooksRead}
          />

          {/* Recommendations */}
          <Recommendations 
            books={books} 
            onBookClick={handleBookClick}
            onToggleFavorite={toggleFavorite}
            onAddToCollection={handleAddToCollection}
            onAddToBooksRead={handleAddToBooksRead}
            isInBooksRead={isInBooksRead}
          />
        </main>
      </div>

      {/* Modals with proper z-index ordering */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />
      
      <BookDetailModal 
        book={selectedBook}
        isOpen={isBookDetailOpen}
        onClose={() => setIsBookDetailOpen(false)}
        onToggleFavorite={toggleFavorite}
        onAddToCollection={handleAddToCollection}
        onToggleOwnedForSale={handleToggleOwnedForSale}
        onRateBook={handleRateBook}
      />
      
      <CollectionSelectionModal
        isOpen={isCollectionSelectionOpen}
        onClose={() => setIsCollectionSelectionOpen(false)}
        collections={collections}
        onSelectCollection={handleCollectionSelection}
        bookTitle={selectedBookTitle}
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

export default Index;