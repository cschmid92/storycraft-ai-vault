
import React, { useState } from 'react';
import { Search, Filter, Menu, BookOpen, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import SharedSidebar from '../components/SharedSidebar';
import CollectionModal from '../components/CollectionModal';
import AccountModal from '../components/AccountModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import { SearchService } from '../services/mockDataService';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { Book, Collection } from '../types/entities';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const { collections, addCollection, deleteCollection, addBookToCollection } = useCollections();
  const { books, toggleFavorite, toggleOwnedForSale, rateBook } = useBooks();
  const [booksReadList, setBooksReadList] = useState<number[]>([1, 2]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  
  const [searchForm, setSearchForm] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publisher: '',
    yearFrom: '',
    yearTo: '',
    language: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    ratingMin: ''
  });

  const genres = SearchService.getGenres();

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const filters = {
      title: searchForm.title,
      author: searchForm.author,
      isbn: searchForm.isbn,
      genre: searchForm.genre,
      publisher: searchForm.publisher,
      yearFrom: searchForm.yearFrom ? parseInt(searchForm.yearFrom) : undefined,
      yearTo: searchForm.yearTo ? parseInt(searchForm.yearTo) : undefined,
      language: searchForm.language,
      ratingMin: searchForm.ratingMin ? parseInt(searchForm.ratingMin) : undefined,
    };

    const results = SearchService.advancedSearch(filters);
    console.log('Advanced search results:', results);
    
    // Navigate to search results with query
    const queryParams = new URLSearchParams();
    if (searchForm.title) queryParams.set('q', searchForm.title);
    navigate(`/search-results?${queryParams.toString()}`);
  };

  const clearForm = () => {
    setSearchForm({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publisher: '',
      yearFrom: '',
      yearTo: '',
      language: '',
      condition: '',
      priceMin: '',
      priceMax: '',
      ratingMin: ''
    });
  };

  const handleCollectionSelect = (collection: Collection | { id: string; name: string; count: number; color: string } | null) => {
    if (collection?.id === 'favorites') {
      navigate('/collections/favorites');
    } else if (collection?.id === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
    }
    setIsSidebarOpen(false);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const handleAddToCollection = (bookId: number) => {
    const book = books.find(b => Number(b.id) === bookId);
    if (book) {
      setSelectedBookForCollection(book);
      setIsCollectionSelectionModalOpen(true);
    }
  };

  const handleCollectionSelection = (collection: Collection) => {
    if (collection && selectedBookForCollection) {
      addBookToCollection(collection.id, Number(selectedBookForCollection.id));
    }
    setSelectedBookForCollection(null);
    setIsCollectionSelectionModalOpen(false);
  };

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Bacondo</h1>
                  <p className="text-xs text-slate-600 hidden sm:block">Advanced Search</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsAccountModalOpen(true)}
              >
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:sticky md:top-16 z-50 md:z-auto h-screen md:h-[calc(100vh-4rem)]`}>
          <SharedSidebar 
            collections={collections}
            selectedCollection={null}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadList.length}
            onDeleteCollection={deleteCollection}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter book title..."
                      value={searchForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Enter author name..."
                      value={searchForm.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      placeholder="Enter ISBN..."
                      value={searchForm.isbn}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <select
                      id="genre"
                      value={searchForm.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      placeholder="Enter publisher..."
                      value={searchForm.publisher}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Filters</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearFrom">Year From</Label>
                      <Input
                        id="yearFrom"
                        type="number"
                        placeholder="1900"
                        value={searchForm.yearFrom}
                        onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearTo">Year To</Label>
                      <Input
                        id="yearTo"
                        type="number"
                        placeholder="2024"
                        value={searchForm.yearTo}
                        onChange={(e) => handleInputChange('yearTo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={searchForm.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <select
                      id="condition"
                      value={searchForm.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Condition</option>
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Acceptable">Acceptable</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceMin">Min Price ($)</Label>
                      <Input
                        id="priceMin"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={searchForm.priceMin}
                        onChange={(e) => handleInputChange('priceMin', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceMax">Max Price ($)</Label>
                      <Input
                        id="priceMax"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        value={searchForm.priceMax}
                        onChange={(e) => handleInputChange('priceMax', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ratingMin">Minimum Rating</Label>
                    <select
                      id="ratingMin"
                      value={searchForm.ratingMin}
                      onChange={(e) => handleInputChange('ratingMin', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                      <option value="1">1+ Stars</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search Books
                </Button>
                <Button variant="outline" onClick={clearForm} className="flex-1">
                  Clear All Filters
                </Button>
              </div>
            </div>
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
        onToggleOwnedForSale={toggleOwnedForSale}
        onRateBook={rateBook}
      />
      
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default AdvancedSearch;
