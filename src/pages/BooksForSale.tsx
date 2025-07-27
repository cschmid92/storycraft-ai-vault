import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, DollarSign, Tag, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, BookForSale, BookForSaleStatus } from '../types/entities';
import AppLayout from '../components/layout/AppLayout';
import ContactSellerModal from '../components/ContactSellerModal';
import { useBooks } from '../hooks/useBooks';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useBooksRead } from '../hooks/useBooksRead';

const BooksForSale = () => {
  const { books } = useBooks();
  const { booksForSale, updateBookForSaleStatus, removeBookForSale } = useBooksForSale();
  const { getBooksReadCount } = useBooksRead();
  const [selectedBookForContact, setSelectedBookForContact] = useState<BookForSale | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Get my books for sale using the hook's helper function
  const myBooksForSale = booksForSale.filter(sale => sale.sellerId === 999);
  const myBooks = myBooksForSale.map(sale => {
    const book = books.find(b => b.id === sale.bookId);
    return { ...sale, book };
  }).filter(sale => sale.book) as (BookForSale & { book: Book })[];

  const availableCount = myBooks.filter(sale => sale.status === 'Available').length;

  const handleContactSeller = (bookForSale: BookForSale) => {
    setSelectedBookForContact(bookForSale);
    setIsContactModalOpen(true);
  };

  const handleStatusChange = (bookId: number, newStatus: BookForSaleStatus) => {
    const sale = booksForSale.find(s => s.bookId === bookId);
    if (sale) updateBookForSaleStatus(sale.id, newStatus);
  };

  const handleDeleteBook = (bookId: number) => {
    removeBookForSale(bookId);
  };

  const handleEditBook = (bookId: number) => {
    // For now, just log - could open a modal or navigate to edit page
    console.log('Edit book:', bookId);
    // TODO: Implement edit functionality (price change modal, condition update, etc.)
  };

  const getStatusBadge = (status: BookForSaleStatus) => {
    switch (status) {
      case 'Sold':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Sold</Badge>;
      case 'Picked':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Picked</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Available</Badge>;
    }
  };

  const onBookClick = (book: Book) => {
    // Handle book click if needed
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6">
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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Listed</p>
                  <p className="text-2xl font-bold text-slate-800">{myBooks.length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Available</p>
                  <p className="text-2xl font-bold text-slate-800">{availableCount}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Sold</p>
                  <p className="text-2xl font-bold text-slate-800">{myBooks.filter(sale => sale.status === 'Sold').length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          {myBooks.length > 0 ? (
            <div className="space-y-3">
              {myBooks.map(sale => (
                <div
                  key={sale.id}
                  className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-slate-200 hover:bg-white/80 transition-colors"
                >
                  <img 
                    src={sale.book?.cover} 
                    alt={sale.book?.title}
                    className="w-10 h-14 object-cover rounded cursor-pointer"
                    onClick={() => sale.book && onBookClick(sale.book)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 text-sm truncate">{sale.book?.title}</h4>
                    <p className="text-slate-600 text-xs truncate">{sale.book?.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium text-sm">{sale.currency} {sale.price}</span>
                      </div>
                      {getStatusBadge(sale.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => handleStatusChange(sale.bookId, 'Sold')}
                    >
                      Sold
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      onClick={() => handleStatusChange(sale.bookId, 'Picked')}
                    >
                      Picked
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBook(sale.bookId)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                      onClick={() => handleDeleteBook(sale.bookId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No books for sale</h3>
              <p className="text-slate-500 mb-4">Start selling by marking books in your library as "For Sale"</p>
              <Link to="/">
                <Button>Browse Your Library</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <ContactSellerModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        bookForSale={selectedBookForContact}
      />
    </AppLayout>
  );
};

export default BooksForSale;