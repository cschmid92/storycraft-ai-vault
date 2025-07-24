import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Package, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UnifiedHeader from '../components/layout/UnifiedHeader';
import AppSidebar from '../components/layout/AppSidebar';
import UsedBookCard from '../components/UsedBookCard';
import CollectionModal from '../components/CollectionModal';
import { useCollections } from '../hooks/useCollections';
import { useBooks } from '../hooks/useBooks';
import { useBooksRead } from '../hooks/useBooksRead';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { mockUsers } from '../data/mockData';
import { Book, Collection } from '../types/entities';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { books } = useBooks();
  const { collections, addCollection } = useCollections();
  const { getBooksReadCount } = useBooksRead();
  const { booksForSale } = useBooksForSale();
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  
  // For demo purposes, use current user (999) if no userId provided
  const targetUserId = userId ? parseInt(userId) : 999;
  
  // Get user data from mock users
  const user = mockUsers.find(u => u.id === targetUserId);
  const isCurrentUser = targetUserId === 999;
  
  // Get user's books for sale
  const userBooksForSale = booksForSale.filter(sale => 
    sale.sellerId === targetUserId && sale.status === 'Available'
  );
  
  // Use actual user rating or fallback for current user
  const userRating = user?.rating || 4.2;
  const totalSales = user?.totalSales || 15;
  
  const booksReadCount = getBooksReadCount();

  const handleSelectCollection = (collection: Collection | null) => {
    setSelectedCollection(collection);
    setIsSidebarOpen(false);
  };

  const handleBookClick = (book: Book) => {
    // Handle book click if needed
  };

  const handleCreateCollection = (name: string, color: string, description?: string) => {
    console.log('UserProfile handleCreateCollection:', { name, color, description });
    addCollection(name, color, description);
    setIsCollectionModalOpen(false);
  };

  const handleOpenCollectionModal = () => {
    console.log('Opening collection modal - current state:', isCollectionModalOpen);
    setIsCollectionModalOpen(true);
    console.log('Setting modal state to true');
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : i < rating 
            ? 'text-yellow-400 fill-yellow-400/50' 
            : 'text-slate-300'
        }`}
      />
    ));
  };

  // Get display name and avatar
  const displayName = user 
    ? `${user.firstName} ${user.lastName}` 
    : isCurrentUser 
    ? "My Profile" 
    : `User ${targetUserId}`;
    
  const displayAvatar = user?.avatar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <UnifiedHeader 
        showMobileMenu={true}
        onMobileMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex">
        {/* Sidebar - Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-40 md:z-auto`}>
          <AppSidebar 
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onOpenCollectionModal={handleOpenCollectionModal}
            books={books}
            onBookClick={handleBookClick}
            booksReadCount={booksReadCount}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Back button and title */}
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              User Profile
            </h2>
          </div>

          {/* User Rating Section */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {displayAvatar ? (
                <img 
                  src={displayAvatar} 
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  <UserIcon className="h-8 w-8" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{displayName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {renderStars(userRating)}
                  </div>
                  <span className="text-slate-600 text-sm">
                    {userRating} ({totalSales} sales)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Books for Sale Section */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Books for Sale ({userBooksForSale.length})
              </h2>
            </div>
            
            {userBooksForSale.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No books for sale</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBooksForSale.map((sale) => (
                  <UsedBookCard
                    key={sale.id}
                    bookForSale={sale}
                    onBookClick={() => {}}
                    onContactSeller={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Collection Modal */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => {
          console.log('Closing collection modal');
          setIsCollectionModalOpen(false);
        }}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  );
};

export default UserProfile;
