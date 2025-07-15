
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book, BookForSale } from '../types/entities';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import AppSidebar from '../components/layout/AppSidebar';
import CollectionModal from '../components/CollectionModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import BuyUsedBooksFilters from '../components/BuyUsedBooksFilters';
import UsedBookGrid from '../components/UsedBookGrid';
import ContactSellerModal from '../components/ContactSellerModal';
import MessengerModal from '../components/MessengerModal';
import { useCollections, Collection } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useFavorites } from '../hooks/useFavorites';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useUserRatings } from '../hooks/useUserRatings';
import { booksForSale } from '../data/mockData';

const BooksForSale = () => {
  const { collections, addCollection, addBookToCollection } = useCollections();
  const { books } = useBooks();
  const { toggleFavorite } = useFavorites();
  const { addBookForSale, removeBookForSale } = useBooksForSale();
  const { rateBook } = useUserRatings();
  const { getBooksReadCount } = useBooksRead();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContactSellerModalOpen, setIsContactSellerModalOpen] = useState(false);
  const [selectedBookForContact, setSelectedBookForContact] = useState<BookForSale | null>(null);
  const [isMessengerModalOpen, setIsMessengerModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>(undefined);

  // Use the same books read logic as Collections.tsx - books with IDs 1 and 2 are marked as read
  const booksReadCount = getBooksReadCount();

  // Get books for purchase (excluding own books)
  const filteredBooksForSale = booksForSale.filter(sale => sale.sellerId !== 999);

  // Get unique genres for filtering from the centralized data
  const genres = Array.from(new Set(filteredBooksForSale.map(sale => sale.book?.genre).filter(Boolean)));

  // Filter books based on search term, genre, and distance using centralized data
  const filteredBooks = filteredBooksForSale.filter(sale => {
    const book = sale.book;
    if (!book) return false;
    
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    const matchesDistance = !maxDistance || (sale.distance && sale.distance <= maxDistance);
    
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

  const handleBookClick = (bookForSale: BookForSale) => {
    setSelectedBook(bookForSale.book);
    setIsBookDetailModalOpen(true);
  };

  const handleCreateCollection = (name: string, color: string, description?: string) => {
    addCollection(name, color, description);
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

  const handleContactSeller = (bookForSale: BookForSale) => {
    setSelectedBookForContact(bookForSale);
    setIsContactSellerModalOpen(true);
  };

  const handleMessageSent = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsMessengerModalOpen(true);
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
            onBookClick={(book) => handleBookClick({ id: 0, book, sellerId: 0, bookId: book.id, price: 0, currency: 'CHF', condition: 'Good', status: 'Available' })}
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
              booksForSale={filteredBooks}
              onBookClick={handleBookClick}
              onContactSeller={handleContactSeller}
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
        onToggleOwnedForSale={(bookId, price) => {
          if (price) addBookForSale(bookId, price, 'Good');
          else removeBookForSale(bookId);
        }}
        onRateBook={rateBook}
      />
      
      <ContactSellerModal
        bookForSale={selectedBookForContact}
        isOpen={isContactSellerModalOpen}
        onClose={() => setIsContactSellerModalOpen(false)}
        onMessageSent={handleMessageSent}
      />
      
      <MessengerModal
        isOpen={isMessengerModalOpen}
        onClose={() => setIsMessengerModalOpen(false)}
        selectedConversationId={selectedConversationId}
      />
    </div>
  );
};

export default BooksForSale;
