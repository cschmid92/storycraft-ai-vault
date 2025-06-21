
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookmarkPlus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BookCard from '../components/BookCard';
import CollectionSidebar from '../components/CollectionSidebar';
import { Book } from '../types/Book';
import { BookOpen, User } from 'lucide-react';

// Mock data
const mockCollections = [
  { id: 1, name: "Favorites ❤️", count: 3, color: "bg-red-500" },
  { id: 2, name: "To Read 📚", count: 8, color: "bg-blue-500" },
  { id: 3, name: "Classics", count: 12, color: "bg-amber-500" },
  { id: 4, name: "Sci-Fi Adventures", count: 6, color: "bg-purple-500" }
];

const mockBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    isFavorite: false,
    isOwnedForSale: false,
    isbn10: "0743273567",
    isbn13: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    language: "English"
  }
];

const Collections = () => {
  const { id } = useParams();
  const [collections, setCollections] = useState(mockCollections);
  const [books] = useState(mockBooks);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  const selectedCollection = collections.find(c => c.id === parseInt(id || ''));
  const collectionBooks = mockBooks; // In real app, filter by collection

  const handleEditCollection = (collectionId: number) => {
    console.log('Edit collection:', collectionId);
  };

  const handleDeleteCollection = (collectionId: number) => {
    setCollections(collections.filter(c => c.id !== collectionId));
  };

  const handleCollectionSelect = (collection: any) => {
    // Handle collection selection
  };

  const handleBookClick = (book: Book) => {
    // Handle book click
  };

  if (!selectedCollection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookmarkPlus className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Collection not found</h2>
            <Link to="/">
              <Button>Go back to library</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Bacondo</h1>
                <p className="text-xs text-slate-600">Your Digital Library</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="bg-white/60 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsAccountModalOpen(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <CollectionSidebar 
          collections={collections}
          selectedCollection={selectedCollection}
          onSelectCollection={handleCollectionSelect}
          onOpenCollectionModal={() => {}}
          books={books}
          onBookClick={handleBookClick}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className={`p-2 rounded-xl ${selectedCollection.color}`}>
                  <BookmarkPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{selectedCollection.name}</h1>
                  <p className="text-xs text-slate-600">{selectedCollection.count} books in collection</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditCollection(selectedCollection.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteCollection(selectedCollection.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Books in Collection</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collectionBooks.map(book => (
              <BookCard 
                key={book.id}
                book={book}
                onToggleFavorite={() => {}}
                onBookClick={() => {}}
                onAddToCollection={() => {}}
              />
            ))}
          </div>

          {collectionBooks.length === 0 && (
            <div className="text-center py-12">
              <BookmarkPlus className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No books in this collection</h3>
              <p className="text-slate-500">Start adding books to build your collection</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Collections;
