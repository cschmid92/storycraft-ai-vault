import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, Package } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import UsedBookCard from '../components/UsedBookCard';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useUserRatings } from '../hooks/useUserRatings';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { booksForSale } = useBooksForSale();
  const { userRatings } = useUserRatings();
  
  // For demo purposes, use current user (999) if no userId provided
  const targetUserId = userId ? parseInt(userId) : 999;
  
  // Get user's books for sale
  const userBooksForSale = booksForSale.filter(sale => 
    sale.sellerId === targetUserId && sale.status === 'Available'
  );
  
  // Calculate user's average rating (mock data for now)
  const averageRating = 4.2;
  const totalRatings = 15;
  
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

  return (
    <AppLayout 
      headerTitle="User Profile"
      headerSubtitle="View seller information"
    >
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* User Rating Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-slate-200 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              U{targetUserId}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">User {targetUserId}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {renderStars(averageRating)}
                </div>
                <span className="text-slate-600 text-sm">
                  {averageRating} ({totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Books for Sale Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-slate-200">
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
      </div>
    </AppLayout>
  );
};

export default UserProfile;