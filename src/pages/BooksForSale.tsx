
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Book, BookForSale, BookForSaleStatus } from '../types/entities';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import AppSidebar from '../components/layout/AppSidebar';
import CollectionModal from '../components/CollectionModal';
import BookDetailModal from '../components/BookDetailModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import PriceInputModal from '../components/PriceInputModal';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useFavorites } from '../hooks/useFavorites';

const BooksForSale = () => {
  const { collections, addCollection } = useCollections();
  const { books } = useBooks();
  const { toggleFavorite } = useFavorites();
  const { getBooksReadCount } = useBooksRead();
  const { getMyBooksForSale, updateBookForSaleStatus, updateBookForSale, removeBookForSale } = useBooksForSale();
  const navigate = useNavigate();
  const myBooks = getMyBooksForSale();
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookForCollection, setSelectedBookForCollection] = useState<Book | null>(null);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<BookForSale | null>(null);
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

  const handleToggleFavorite = (bookId: number) => {
    toggleFavorite(bookId);
    // Favorite is now handled by useFavorites hook
  };

  // This function is no longer needed since BookActions handles it directly

  const handleRemoveFromSale = (saleId: number) => {
    const bookForSale = myBooks.find(sale => sale.id === saleId);
    if (bookForSale) {
      removeBookForSale(bookForSale.bookId);
    }
  };

  const handleEditBook = (bookForSale: BookForSale) => {
    setSelectedBookForEdit(bookForSale);
    setIsPriceModalOpen(true);
  };

  const handleUpdateBook = (price: number, condition: string) => {
    if (selectedBookForEdit) {
      updateBookForSale(selectedBookForEdit.id, { 
        price, 
        condition: condition as any 
      });
      setSelectedBookForEdit(null);
    }
    setIsPriceModalOpen(false);
  };

  const handleChangeStatus = (bookId: number, newStatus: BookForSaleStatus) => {
    updateBookForSaleStatus(bookId, newStatus);
    console.log(`Changed book ${bookId} status to ${newStatus}`);
  };

  const getStatusBadge = (status: string = 'Available') => {
    switch (status) {
      case 'Sold':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Sold</Badge>;
      case 'Picked':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Picked</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
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
              <div className="flex gap-6 text-slate-600">
                <p>{myBooks.filter(book => book.status === 'Available').length} books available for purchase</p>
                <p>{myBooks.filter(book => book.status === 'Sold' || book.status === 'Picked').length} books sold</p>
              </div>
            </div>

            {myBooks.length > 0 ? (
              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myBooks.map(bookForSale => {
                        const book = bookForSale.book;
                        if (!book) return null;
                         const status: BookForSaleStatus = bookForSale.status;
                         const canEdit = status !== 'Sold' && status !== 'Picked';
                         const canChangeStatus = status !== 'Picked';
                         const canDelete = status !== 'Sold' && status !== 'Picked';
                        
                        return (
                          <TableRow key={bookForSale.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img 
                                  src={book.cover} 
                                  alt={book.title}
                                  className="w-12 h-16 object-cover rounded cursor-pointer"
                                  onClick={() => handleBookClick(bookForSale)}
                                />
                                <div>
                                  <h3 className="font-medium text-slate-800 cursor-pointer hover:text-blue-600" 
                                      onClick={() => handleBookClick(bookForSale)}>
                                    {book.title}
                                  </h3>
                                  <p className="text-slate-600 text-sm">{book.author}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{bookForSale.condition}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-green-600">{bookForSale.currency || 'CHF'} {bookForSale.price}</span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditBook(bookForSale)}
                                  disabled={!canEdit}
                                  className="text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => handleRemoveFromSale(bookForSale.id)}
                                   disabled={!canDelete}
                                   className="text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                   <Trash2 className="h-4 w-4 mr-1" />
                                   Remove
                                 </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                   onClick={() => handleChangeStatus(bookForSale.id, 'Sold')}
                                   disabled={!canChangeStatus || status === 'Sold'}
                                  className="text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Sold
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                   onClick={() => handleChangeStatus(bookForSale.id, 'Picked')}
                                    disabled={!canChangeStatus || (status as BookForSaleStatus) === 'Picked'}
                                  className="text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Package className="h-4 w-4 mr-1" />
                                  Picked
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {myBooks.map(bookForSale => {
                    const book = bookForSale.book;
                    if (!book) return null;
                     const status: BookForSaleStatus = bookForSale.status;
                     const canEdit = status !== 'Sold' && status !== 'Picked';
                     const canChangeStatus = status !== 'Picked';
                     const canDelete = status !== 'Sold' && status !== 'Picked';
                    
                    return (
                      <div key={bookForSale.id} className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="flex gap-4 mb-4">
                          <img 
                            src={book.cover} 
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded cursor-pointer flex-shrink-0"
                            onClick={() => handleBookClick(bookForSale)}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-800 cursor-pointer hover:text-blue-600 truncate" 
                                onClick={() => handleBookClick(bookForSale)}>
                              {book.title}
                            </h3>
                            <p className="text-slate-600 text-sm truncate">{book.author}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{bookForSale.condition}</Badge>
                              <span className="font-semibold text-green-600">{bookForSale.currency} {bookForSale.price}</span>
                            </div>
                            <div className="mt-2">
                              {getStatusBadge(status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBook(bookForSale)}
                            disabled={!canEdit}
                            className="text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-0"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleRemoveFromSale(bookForSale.id)}
                             disabled={!canDelete}
                             className="text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-0"
                           >
                             <Trash2 className="h-4 w-4 mr-1" />
                             Remove
                           </Button>
                          <Button
                            variant="outline"
                            size="sm"
                             onClick={() => handleChangeStatus(bookForSale.id, 'Sold')}
                             disabled={!canChangeStatus || status === 'Sold'}
                            className="text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-0"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Sold
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                             onClick={() => handleChangeStatus(bookForSale.id, 'Picked')}
                             disabled={!canChangeStatus || (status as BookForSaleStatus) === 'Picked'}
                            className="text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-0"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Picked
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
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
        onToggleFavorite={handleToggleFavorite}
        onAddToCollection={() => selectedBook && handleAddToCollection(selectedBook)}
        onToggleOwnedForSale={(bookId: number) => {
          const bookForSale = myBooks.find(sale => sale.bookId === bookId);
          if (bookForSale) {
            removeBookForSale(bookId);
          }
        }}
        onRateBook={() => {}}
      />

      <PriceInputModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false);
          setSelectedBookForEdit(null);
        }}
        onConfirm={handleUpdateBook}
        bookTitle={selectedBookForEdit?.book?.title || ""}
      />
    </div>
  );
};

export default BooksForSale;
