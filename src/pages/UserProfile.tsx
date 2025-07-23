import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, User } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { booksForSale } from '../data/mockData';
import UsedBookCard from '../components/UsedBookCard';
import { BookForSale } from '../types/entities';

const UserProfile = () => {
  const { userId } = useParams();
  const { booksForSale: allBooksForSale } = useBooksForSale();
  
  // For demo purposes, we'll show a mock user profile
  // In a real app, you'd fetch user data based on userId
  const user = {
    id: 999,
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    totalSales: 15
  };

  // Get books for sale by this user
  const userBooksForSale = userId 
    ? allBooksForSale.filter(sale => sale.sellerId === parseInt(userId))
    : booksForSale.filter(sale => sale.seller?.id === user.id);

  const handleBookClick = (bookForSale: BookForSale) => {
    // Handle book click - could open detail modal
    console.log('Book clicked:', bookForSale);
  };

  const handleContactSeller = (bookForSale: BookForSale) => {
    // Handle contact seller
    console.log('Contact seller:', bookForSale);
  };

  return (
    <AppLayout headerTitle="User Profile" showSidebar={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src={user.avatar} 
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold text-slate-700">{user.rating}</span>
                  <span className="text-slate-500">({user.totalSales} sales)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1 text-slate-500">
                <User className="h-4 w-4" />
                <span className="text-sm">Seller Profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Books for Sale Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Books for Sale ({userBooksForSale.length})
          </h2>
          
          {userBooksForSale.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {userBooksForSale.map((bookForSale) => (
                <UsedBookCard
                  key={bookForSale.id}
                  bookForSale={bookForSale}
                  onBookClick={handleBookClick}
                  onContactSeller={handleContactSeller}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-8">
                <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No books for sale at the moment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProfile;