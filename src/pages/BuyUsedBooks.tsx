
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Menu, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/entities';
import SharedSidebar from '../components/SharedSidebar';
import CollectionModal from '../components/CollectionModal';
import AccountModal from '../components/AccountModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import BuyUsedBooksFilters from '../components/BuyUsedBooksFilters';
import UsedBookGrid from '../components/UsedBookGrid';
import { useCollections, Collection } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';

// Mock data - in a real app this would come from props or context
const mockBooksForSale: Book[] = [
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    rating: 4.4,
    genre: "Dystopian Fiction",
    year: 1949,
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 12.99,
    condition: "Good",
    isbn10: "0452284236",
    isbn13: "978-0452284234",
    publisher: "Plume",
    pages: 328,
    language: "English",
    distance: 3.7,
    location: "Downtown"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.3,
    genre: "Classic Literature",
    year: 1813,
    description: "A romantic novel of manners set in Georgian England.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 15.99,
    condition: "Excellent",
    isbn10: "0141439513",
    isbn13: "978-0141439518",
    publisher: "Penguin Classics",
    pages: 432,
    language: "English",
    distance: 9.2,
    location: "Uptown"
  },
  {
    id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 10.99,
    condition: "Fair",
    isbn10: "0743273567",
    isbn13: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    language: "English",
    distance: 1.9,
    location: "Midtown"
  }
];

const BooksForSale = () => {
  const { collections, addCollection, addBookToCollection } = useCollections();
  const { books, toggleFavorite, toggleOwnedForSale, rateBook } = useBooks();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Calculate books read count from actual data
  const booksReadCount = books.filter(book => book.userRating && book.userRating > 0).length;

  // Get unique genres for filtering
  const genres = Array.from(new Set(mockBooksForSale.map(book => book.genre)));

  // Filter books based on search term, genre, and distance
  const filteredBooks = mockBooksForSale.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    const matchesDistance = !maxDistance || (book.distance && book.distance <= maxDistance);
    
    return matchesSearch && matchesGenre && matchesDistance;
  });

  const handleCollectionSelect = (collection: any) => {
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

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  const handleAddToCollection = (book: Book) => {
    setSelectedBookForCollection(book);
    setIsCollectionSelectionModalOpen(true);
  };

  const handleCollectionSelection = (collection: Collection) => {
    if (collection && selectedBookForCollection) {
      addBookToCollection(collection.id, selectedBookForCollection.id);
      console.log(`Added "${selectedBookForCollection.title}" to collection "${collection.name}"`);
    }
    setSelectedBookForCollection(null);
    setIsCollectionSelectionModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
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
                  <p className="text-xs text-slate-600 hidden sm:block">Your Digital Library</p>
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
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-50 md:z-auto`}>
          <SharedSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleCollectionSelect}
            onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadCount}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-4 md:mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h2 className="text-2xl font-bold text-slate-800 ml-2 inline-block">Buy Used Books</h2>
            </div>

            {/* Search and Filters */}
            <BuyUsedBooksFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              maxDistance={maxDistance}
              onDistanceChange={setMaxDistance}
              genres={genres}
            />

            <div className="mb-8">
              <p className="text-slate-600">{filteredBooks.length} books available from the community</p>
            </div>

            <UsedBookGrid
              books={filteredBooks}
              onBookClick={handleBookClick}
            />
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
        onAddToCollection={() => selectedBook && handleAddToCollection(selectedBook)}
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

export default BooksForSale;
