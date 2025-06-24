
import React, { useState } from 'react';
import { BookOpen, User, Award, Target, Users, Globe, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SharedSidebar from '../components/SharedSidebar';
import CollectionModal from '../components/CollectionModal';
import AccountModal from '../components/AccountModal';
import CollectionSelectionModal from '../components/CollectionSelectionModal';
import { Link, useNavigate } from 'react-router-dom';
import { Book } from '../types/Book';
import { useCollections } from '../hooks/useCollections';

// Mock books data for sidebar
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
    isFavorite: true,
    isOwnedForSale: false,
    isbn10: "0743273567",
    isbn13: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    language: "English"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    rating: 4.5,
    genre: "Fiction",
    year: 1960,
    description: "A powerful story of racial injustice and childhood innocence in the American South.",
    isFavorite: true,
    isOwnedForSale: false,
    isbn10: "0061120081",
    isbn13: "978-0061120084",
    publisher: "Harper Perennial Modern Classics",
    pages: 376,
    language: "English"
  }
];

const About = () => {
  const { collections, addCollection } = useCollections();
  const navigate = useNavigate();
  const [books] = useState(mockBooks);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCollectionSelectionModalOpen, setIsCollectionSelectionModalOpen] = useState(false);
  const [selectedBookIdForCollection, setSelectedBookIdForCollection] = useState<number | null>(null);
  const [booksReadList] = useState<number[]>([1, 2]);

  const handleCollectionSelect = (collection: any) => {
    if (collection && typeof collection.id !== 'undefined') {
      navigate(`/collections/${collection.id}`);
    }
  };

  const handleBookClick = (book: Book) => {
    console.log('Book clicked:', book);
  };

  const handleCreateCollection = (name: string, color: string) => {
    addCollection(name, color);
  };

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
        <SharedSidebar 
          collections={collections}
          selectedCollection={null}
          onSelectCollection={handleCollectionSelect}
          onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
          books={books}
          onBookClick={handleBookClick}
          booksReadCount={booksReadList.length}
        />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl inline-block mb-6">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">About Bacondo</h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Your personal digital library for organizing, discovering, and sharing your favorite books.
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 mb-12 border border-slate-200">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed">
                At Bacondo, we believe that every book has the power to transform lives. Our mission is to create 
                a seamless digital experience that helps book lovers organize their collections, discover new reads, 
                and connect with fellow bibliophiles around the world.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600 mr-3" />
                  <h3 className="text-xl font-semibold text-slate-800">Organize Your Library</h3>
                </div>
                <p className="text-slate-600">
                  Create custom collections, track your reading progress, and keep all your favorite books in one place.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-slate-800">Connect & Share</h3>
                </div>
                <p className="text-slate-600">
                  Share your collections with friends, discover what others are reading, and build a community around books.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-slate-800">Marketplace</h3>
                </div>
                <p className="text-slate-600">
                  Buy and sell used books with other community members, giving books a second life.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-yellow-600 mr-3" />
                  <h3 className="text-xl font-semibold text-slate-800">Personalized Experience</h3>
                </div>
                <p className="text-slate-600">
                  Get book recommendations based on your reading history and preferences.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to Start Your Journey?</h2>
              <p className="text-slate-600 mb-6">
                Join thousands of book lovers who have already organized their libraries with Bacondo.
              </p>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Explore Your Library
                </Button>
              </Link>
            </div>
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
        bookId={selectedBookIdForCollection}
      />
      
      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default About;
