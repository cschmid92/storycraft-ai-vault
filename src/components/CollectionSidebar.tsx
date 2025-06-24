
import React, { useState } from 'react';
import { Library, Heart, BookOpen, Plus, DollarSign, ChevronDown, ChevronRight, Edit, Trash2, ShoppingCart, Info, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import BooksForSale from './BooksForSale';
import { Book } from '../types/entities';
import { Collection } from '../hooks/useCollections';

interface CollectionSidebarProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onSelectCollection: (collection: Collection | null) => void;
  onOpenCollectionModal: () => void;
  books: Book[];
  onBookClick: (book: Book) => void;
  booksReadCount: number;
}

const CollectionSidebar = ({ 
  collections, 
  selectedCollection, 
  onSelectCollection, 
  onOpenCollectionModal,
  books,
  onBookClick,
  booksReadCount
}: CollectionSidebarProps) => {
  const [showBooksForSale, setShowBooksForSale] = useState(false);
  const booksForSaleCount = books.filter(book => book.isOwnedForSale && book.salePrice).length;

  const handleEditCollection = (e: React.MouseEvent, collectionId: number | string) => {
    e.stopPropagation();
    console.log('Edit collection:', collectionId);
  };

  const handleDeleteCollection = (e: React.MouseEvent, collectionId: number | string) => {
    e.stopPropagation();
    console.log('Delete collection:', collectionId);
  };

  // Standard collections that appear before user collections
  const standardCollections = [
    { id: 'favorites', name: "Favorites ❤️", count: books.filter(book => book.isFavorite).length, color: "bg-red-500" },
    { id: 'books-read', name: "Books read 📖", count: booksReadCount, color: "bg-green-500" },
  ];

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200 p-4 h-screen sticky top-16 overflow-y-auto flex flex-col">
      <div className="space-y-6 flex-1">
        {/* Quick Access */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <Link to="/about">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100 px-3 py-2 h-auto">
                <Info className="h-4 w-4 mr-3" />
                <span className="text-sm">About Bacondo</span>
              </Button>
            </Link>
            <Link to="/buy-used-books">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100 px-3 py-2 h-auto">
                <ShoppingCart className="h-4 w-4 mr-3" />
                <span className="text-sm">Buy Used Books</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* My Books for Sale */}
        <div>
          <button
            onClick={() => setShowBooksForSale(!showBooksForSale)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-slate-600 hover:bg-slate-100 transition-colors mb-2"
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-semibold">My Books for Sale</span>
              {booksForSaleCount > 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {booksForSaleCount}
                </span>
              )}
            </div>
            {showBooksForSale ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {showBooksForSale && (
            <div className="ml-2 mb-4">
              <BooksForSale books={books} onBookClick={onBookClick} />
              <Link to="/books-for-sale">
                <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                  View All
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Collections */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            My Collections
          </h3>
          <div className="space-y-1">
            {/* Standard Collections */}
            {standardCollections.map((collection) => (
              <div
                key={collection.id}
                className={`group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedCollection?.id === collection.id 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <button
                  onClick={() => onSelectCollection(collection as any)}
                  className="flex items-center space-x-3 flex-1 text-left"
                >
                  <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                  <span className="text-sm flex-1 truncate">{collection.name}</span>
                  <span className="text-xs text-slate-500">{collection.count}</span>
                </button>
              </div>
            ))}

            {/* User Collections */}
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedCollection?.id === collection.id 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <button
                  onClick={() => onSelectCollection(collection)}
                  className="flex items-center space-x-3 flex-1 text-left"
                >
                  <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                  <span className="text-sm flex-1 truncate">{collection.name}</span>
                  <span className="text-xs text-slate-500">{collection.count}</span>
                </button>
                
                {/* Edit/Delete buttons - shown on hover */}
                <div className="absolute right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-slate-200"
                    onClick={(e) => handleEditCollection(e, collection.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => handleDeleteCollection(e, collection.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* New Collection Button */}
            <Button 
              onClick={onOpenCollectionModal}
              variant="outline"
              className="w-full justify-start text-slate-600 border-dashed border-slate-300 hover:bg-slate-50 mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="border-t border-slate-200 pt-4 mt-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
          Follow Us
        </h4>
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
            <Facebook className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-pink-100">
            <Instagram className="h-4 w-4 text-pink-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
            <Linkedin className="h-4 w-4 text-blue-700" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
            <Twitter className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CollectionSidebar;
