import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Tag, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book, BookForSale } from '../types/entities';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import AppSidebar from '../components/layout/AppSidebar';
import CollectionModal from '../components/CollectionModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { booksForSale } from '../data/mockData';

const BooksForSale = () => {
  const { collections, addCollection } = useCollections();
  const { books } = useBooks();
  const { getBooksReadCount } = useBooksRead();
  const navigate = useNavigate();
  const [myBooks] = useState(booksForSale.filter(sale => sale.sellerId === 999));
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

  const handleAddToCollection = (book: Book) => {
    setSelectedBookForCollection(book);
    setIsCollectionSelectionModalOpen(true);
  };

  const handleCollectionSelection = (collection: any) => {
    if (collection && selectedBookForCollection) {
      console.log(`Added "${selectedBookForCollection.title}" to collection "${collection.name}"`);
    }
    setSelectedBookForCollection(null);
  };

  const handleCardClick = (bookForSale: BookForSale) => {
    handleBookClick(bookForSale);
  };

  const handleRemoveFromSale = (bookId: number) => {
    console.log(`Removing book ${bookId} from sale`);
    // In a real app, this would update the book's isOwnedForSale status
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
            books={myBooks.map(sale => sale.book!).filter(Boolean)}
            onBookClick={(book) => handleBookClick(myBooks.find(sale => sale.book?.id === book.id)!)}
            booksReadCount={getBooksReadCount()}
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
              <h2 className="text-2xl font-bold text-slate-800 ml-2 inline-block">My Books for Sale</h2>
            </div>

            <div className="mb-8">
              <p className="text-slate-600">{myBooks.length} books available for purchase</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myBooks.map(bookForSale => {
                const book = bookForSale.book;
                if (!book) return null;
                
                return (
                  <div 
                    key={bookForSale.id} 
                    className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                    onClick={() => handleCardClick(bookForSale)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        ${bookForSale.price}
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-slate-700">{book.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-slate-600 text-xs mb-2">{book.author}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {book.genre}
                        </span>
                        <span className="text-slate-500">{book.year}</span>
                      </div>
                      <p className="text-slate-600 text-xs mt-2 line-clamp-2">
                        {book.description}
                      </p>
                      <Button 
                        variant="outline"
                        className="w-full mt-3 border-red-500 text-red-600 hover:bg-red-50" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSale(bookForSale.id);
                        }}
                      >
                        Remove from Sale
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {myBooks.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No books for sale</h3>
                <p className="text-slate-500">Check back later for new listings</p>
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
        onToggleFavorite={() => {}}
        onAddToCollection={() => selectedBook && handleAddToCollection(selectedBook)}
        onToggleOwnedForSale={() => {}}
        onRateBook={() => {}}
      />
    </div>
  );
};

export default BooksForSale;
