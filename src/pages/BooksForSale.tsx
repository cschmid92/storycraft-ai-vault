
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Tag, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book } from '../types/Book';

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
    isbn10: "0452284236",
    isbn13: "978-0452284234",
    publisher: "Plume",
    pages: 328,
    language: "English"
  }
];

const BooksForSale = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">My Books for Sale</h1>
                <p className="text-xs text-slate-600">Browse available books</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Available Books</h2>
          <p className="text-slate-600">{mockBooksForSale.length} books available for purchase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockBooksForSale.map(book => (
            <div key={book.id} className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  ${book.salePrice}
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
                <Button className="w-full mt-3" size="sm">
                  Buy for ${book.salePrice}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mockBooksForSale.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No books for sale</h3>
            <p className="text-slate-500">Check back later for new listings</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BooksForSale;
