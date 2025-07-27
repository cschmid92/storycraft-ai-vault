import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, BookForSale, BookForSaleStatus } from '../types/entities';
import AppLayout from '../components/layout/AppLayout';
import UsedBookCard from '../components/UsedBookCard';
import ContactSellerModal from '../components/ContactSellerModal';
import { useBooks } from '../hooks/useBooks';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useBooksRead } from '../hooks/useBooksRead';

const BooksForSale = () => {
  const { books } = useBooks();
  const { booksForSale, updateBookForSaleStatus } = useBooksForSale();
  const { getBooksReadCount } = useBooksRead();
  const [selectedBookForContact, setSelectedBookForContact] = useState<BookForSale | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Get all books for sale with their details
  const myBooks = booksForSale.map(sale => {
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

  const getStatusBadge = (status: BookForSaleStatus) => {
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
                  key={`${sale.book.id}-${sale.price}`}
                  className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={sale.book.cover} 
                      alt={sale.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-lg mb-1">{sale.book.title}</h4>
                      <p className="text-slate-600 mb-2">{sale.book.author}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-bold text-lg">{sale.currency} {sale.price}</span>
                        </div>
                        {getStatusBadge(sale.status)}
                      </div>
                      <div className="flex gap-2">
                        {sale.status === 'Available' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(sale.bookId, 'Picked')}
                            >
                              Mark as Picked
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(sale.bookId, 'Sold')}
                            >
                              Mark as Sold
                            </Button>
                          </>
                        )}
                        {sale.status !== 'Available' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(sale.bookId, 'Available')}
                          >
                            Mark as Available
                          </Button>
                        )}
                      </div>
                    </div>
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