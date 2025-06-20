
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Tag, Star, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from '../types/Book';

// Mock data for used books marketplace
const mockUsedBooks: Book[] = [
  {
    id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
    rating: 4.6,
    genre: "Fantasy",
    year: 1937,
    description: "A classic fantasy adventure about Bilbo Baggins' unexpected journey.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 8.99,
    isbn10: "0547928227",
    isbn13: "978-0547928227",
    publisher: "Mariner Books",
    pages: 366,
    language: "English",
    condition: "Good"
  },
  {
    id: 8,
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    rating: 4.3,
    genre: "Science Fiction",
    year: 1965,
    description: "Epic science fiction novel set on the desert planet Arrakis.",
    isFavorite: false,
    isOwnedForSale: true,
    salePrice: 15.50,
    isbn10: "0441172717",
    isbn13: "978-0441172719",
    publisher: "Ace",
    pages: 688,
    language: "English",
    condition: "Very Good"
  }
];

const BuyUsedBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  const genres = [...new Set(mockUsedBooks.map(book => book.genre))];

  const filteredBooks = mockUsedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    
    let matchesPrice = true;
    if (priceRange === "under10" && book.salePrice && book.salePrice >= 10) matchesPrice = false;
    if (priceRange === "10to20" && book.salePrice && (book.salePrice < 10 || book.salePrice > 20)) matchesPrice = false;
    if (priceRange === "over20" && book.salePrice && book.salePrice <= 20) matchesPrice = false;
    
    return matchesSearch && matchesGenre && matchesPrice;
  });

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
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Buy Used Books</h1>
                <p className="text-xs text-slate-600">Find great deals on pre-owned books</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search used books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-slate-300"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 bg-white/80 border border-slate-300 rounded-lg text-slate-700 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under10">Under $10</option>
                <option value="10to20">$10 - $20</option>
                <option value="over20">Over $20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Available Used Books</h2>
            <p className="text-slate-600">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
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
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {book.condition}
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
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {book.genre}
                  </span>
                  <span className="text-slate-500">{book.year}</span>
                </div>
                <p className="text-slate-600 text-xs mb-3 line-clamp-2">
                  {book.description}
                </p>
                <Button className="w-full" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy for ${book.salePrice}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyUsedBooks;
