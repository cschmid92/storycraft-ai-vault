import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, Heart, Library, Users, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CollectionSidebar from '../components/CollectionSidebar';
import CollectionModal from '../components/CollectionModal';

// Mock data for sidebar - same as other pages
const mockCollections = [
  { id: 2, name: "To Read 📚", count: 3, color: "bg-blue-500" },
  { id: 3, name: "Classics", count: 3, color: "bg-amber-500" },
  { id: 4, name: "Sci-Fi Adventures", count: 2, color: "bg-purple-500" }
];

const mockBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    rating: 4.2,
    genre: "Classic Literature",
    year: 1925,
    description: "A classic American novel set in the Jazz Age.",
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
    description: "A powerful story of racial injustice.",
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
  const [collections, setCollections] = useState(mockCollections);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCollectionSelect = (collection: any) => {
    if (collection?.id === 'favorites') {
      navigate('/collections/favorites');
    } else if (collection?.id === 'books-read') {
      navigate('/collections/books-read');
    } else if (collection && typeof collection.id === 'number') {
      navigate(`/collections/${collection.id}`);
    }
  };

  const handleBookClick = (book: any) => {
    console.log('Book clicked:', book);
  };

  const handleCreateCollection = (name: string, color: string) => {
    const newCollection = {
      id: Date.now(),
      name,
      count: 0,
      color
    };
    setCollections([...collections, newCollection]);
  };

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
          selectedCollection={null}
          onSelectCollection={handleCollectionSelect}
          onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
          books={mockBooks}
          onBookClick={handleBookClick}
          booksReadCount={5}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Library
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">About Bacondo</h1>
              <p className="text-xl text-slate-600">Your personal digital library companion</p>
            </div>

            <div className="space-y-8">
              {/* Mission Section */}
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-8 border border-slate-200">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Bacondo is designed to revolutionize how you organize, discover, and interact with your book collection. 
                  We believe that every book lover deserves a beautiful, intuitive way to manage their literary journey.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <Library className="h-6 w-6 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-800">Organize Your Library</h3>
                  </div>
                  <p className="text-slate-600">
                    Create custom collections, track your reading progress, and organize your books in a way that makes sense to you.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <Heart className="h-6 w-6 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-800">Discover New Favorites</h3>
                  </div>
                  <p className="text-slate-600">
                    Get personalized recommendations based on your reading history and preferences. Find your next great read effortlessly.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-800">Community Marketplace</h3>
                  </div>
                  <p className="text-slate-600">
                    Buy and sell used books within our community. Give your books a second life while discovering hidden gems from other readers.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-6 w-6 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-800">Rich Book Details</h3>
                  </div>
                  <p className="text-slate-600">
                    Access comprehensive information about every book including ratings, reviews, publication details, and more.
                  </p>
                </div>
              </div>

              {/* Vision Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-4">
                  We envision a world where book lovers can seamlessly connect with their literary passions. 
                  Bacondo aims to be more than just a catalog - it's a gateway to rediscovering the joy of reading, 
                  sharing literary experiences, and building a sustainable book ecosystem.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Whether you're a casual reader or a bibliophile with thousands of books, Bacondo adapts to your needs, 
                  helping you make the most of your reading journey.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Collection Modal */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  );
};

export default About;
