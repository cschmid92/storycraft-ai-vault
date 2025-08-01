import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle, Package, ShoppingCart, CircleCheck, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Book, BookForSale, BookForSaleStatus } from '../types/entities';
import AppLayout from '../components/layout/AppLayout';
import { useBooksForSale } from '../hooks/useBooksForSale';
import EditBookModal from '../components/EditBookModal';

const BooksForSale = () => {
  const { getMyBooksForSale, updateBookForSaleStatus, updateBookForSale, removeBookForSale } = useBooksForSale();
  const navigate = useNavigate();
  const myBooks = getMyBooksForSale().sort((a, b) => {
    // Sort by status priority: Available (1), Sold (2), Picked (3)
    const statusPriority = { 'Available': 1, 'Sold': 2, 'Picked': 3 };
    const statusA = statusPriority[a.status as keyof typeof statusPriority] || 4;
    const statusB = statusPriority[b.status as keyof typeof statusPriority] || 4;
    
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    
    // If status is the same, sort by ID (creation order)
    return a.id - b.id;
  });
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<BookForSale | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleRemoveFromSale = (saleId: number) => {
    const bookForSale = myBooks.find(sale => sale.id === saleId);
    if (bookForSale) {
      removeBookForSale(bookForSale.bookId);
    }
  };

  const handleEditBook = (bookForSale: BookForSale) => {
    console.log("Selected book for edit:", bookForSale);
    console.log("Current condition:", bookForSale.condition);
    setSelectedBookForEdit(bookForSale);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = (price: number, condition: string) => {
    if (selectedBookForEdit) {
      updateBookForSale(selectedBookForEdit.id, { price, condition: condition as any });
      setSelectedBookForEdit(null);
      setIsEditModalOpen(false);
    }
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
    <AppLayout headerTitle="Bacondo" headerSubtitle="Your Digital Library">
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

          {/* Status Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Available</p>
                  <p className="text-2xl font-bold text-slate-800">{myBooks.filter(book => book.status === 'Available').length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Sold & to be picked</p>
                  <p className="text-2xl font-bold text-slate-800">{myBooks.filter(book => book.status === 'Sold').length}</p>
                </div>
                <CircleCheck className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Picked</p>
                  <p className="text-2xl font-bold text-slate-800">{myBooks.filter(book => book.status === 'Picked').length}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
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
                              />
                              <div>
                                <h3 className="font-medium text-slate-800 cursor-pointer hover:text-blue-600">
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
                            <span className="font-semibold text-green-600">{bookForSale.currency || 'CHF'} {bookForSale.price.toFixed(2)}</span>
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
                    <div key={bookForSale.id} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                      <div className="flex gap-3 mb-3">
                        <img 
                          src={book.cover} 
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">{book.title}</h3>
                          <p className="text-slate-600 text-sm truncate">{book.author}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{bookForSale.condition}</Badge>
                            {getStatusBadge(status)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{bookForSale.currency || 'CHF'} {bookForSale.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {/* Mobile Actions - 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBook(bookForSale)}
                          disabled={!canEdit}
                          className="text-blue-600 hover:bg-blue-50 disabled:opacity-50 text-xs h-8"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromSale(bookForSale.id)}
                          disabled={!canDelete}
                          className="text-red-600 hover:bg-red-50 disabled:opacity-50 text-xs h-8"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeStatus(bookForSale.id, 'Sold')}
                          disabled={!canChangeStatus || status === 'Sold'}
                          className="text-green-600 hover:bg-green-50 disabled:opacity-50 text-xs h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Sold
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeStatus(bookForSale.id, 'Picked')}
                          disabled={!canChangeStatus || (status as BookForSaleStatus) === 'Picked'}
                          className="text-purple-600 hover:bg-purple-50 disabled:opacity-50 text-xs h-8"
                        >
                          <Package className="h-3 w-3 mr-1" />
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
      </div>

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBookForEdit(null);
        }}
        onConfirm={handleEditConfirm}
        bookForSale={selectedBookForEdit}
      />
    </AppLayout>
  );
};

export default BooksForSale;