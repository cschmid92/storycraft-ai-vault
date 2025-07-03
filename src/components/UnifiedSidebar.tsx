import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, BookmarkPlus, DollarSign, Info, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BooksForSale from './BooksForSale';
import { Book, Collection } from '../types/entities';
import { useBooksForSale } from '../hooks/useBooksForSale';

interface UnifiedSidebarProps {
  collections: Collection[];
  selectedCollection?: Collection | { id: string; name: string; count: number; color: string } | null;
  onSelectCollection: (collection: Collection | { id: string; name: string; count: number; color: string } | null) => void;
  onOpenCollectionModal: () => void;
  books: Book[];
  onBookClick: (book: Book) => void;
  booksReadCount: number;
}

const UnifiedSidebar = ({
  collections,
  selectedCollection,
  onSelectCollection,
  onOpenCollectionModal,
  books,
  onBookClick,
  booksReadCount
}: UnifiedSidebarProps) => {
  const [showCollections, setShowCollections] = useState(false);
  const [showBooksForSale, setShowBooksForSale] = useState(false);
  const { getMyBooksForSale } = useBooksForSale();
  const booksForSaleCount = getMyBooksForSale().length;

  // Calculate actual counts for collections
  const getCollectionCount = (collectionId: number | string) => {
    if (collectionId === 'favorites') {
      return books.filter(book => book.isFavorite).length;
    } else if (collectionId === 'books-read') {
      return booksReadCount;
    } else {
      const collection = collections.find(c => c.id === collectionId);
      return collection?.bookIds.length || 0;
    }
  };

  // Standard collections that appear before user collections
  const standardCollections = [
    { id: 'favorites', name: "Favorites ❤️", count: getCollectionCount('favorites'), color: "bg-red-500" },
    { id: 'books-read', name: "Books read 📖", count: getCollectionCount('books-read'), color: "bg-green-500" },
  ];

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200 p-4 h-full overflow-y-auto flex flex-col">
      <div className="space-y-4 md:space-y-6 flex-1">
        {/* Quick Access */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <Link to="/about">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100 px-3 py-2 h-auto text-sm">
                <Info className="h-4 w-4 mr-3" />
                About
              </Button>
            </Link>
            <Link to="/buy-used-books">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100 px-3 py-2 h-auto text-sm">
                <ShoppingCart className="h-4 w-4 mr-3" />
                Buy Used Books
              </Button>
            </Link>
          </div>
        </div>

        {/* Collections */}
        <div>
          <button
            onClick={() => setShowCollections(!showCollections)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-slate-600 hover:bg-slate-100 transition-colors mb-3"
          >
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Collections
            </h3>
            {showCollections ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {showCollections && (
            <div className="space-y-1 mb-4">
              {/* Standard Collections */}
              {standardCollections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => onSelectCollection(collection)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCollection?.id === collection.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${collection.color}`}></div>
                    <span className="text-sm font-medium">{collection.name}</span>
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    {collection.count}
                  </span>
                </button>
              ))}

              {/* User Collections */}
              {collections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => onSelectCollection(collection)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCollection?.id === collection.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${collection.color}`}></div>
                    <span className="text-sm font-medium">{collection.name}</span>
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    {getCollectionCount(collection.id)}
                  </span>
                </button>
              ))}

              <Button
                onClick={onOpenCollectionModal}
                variant="outline"
                size="sm"
                className="w-full mt-2 text-xs"
              >
                <BookmarkPlus className="h-3 w-3 mr-2" />
                New Collection
              </Button>
            </div>
          )}
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
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
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
              <BooksForSale onBookClick={onBookClick} />
              <Link to="/books-for-sale">
                <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                  View All
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;