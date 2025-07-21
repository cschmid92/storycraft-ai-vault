import React from 'react';
import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import SharedLayout from '../components/SharedLayout';
import PageHeader from '../components/PageHeader';
import StarRating from '../components/StarRating';
import BookCard from '../components/BookCard';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { mockUsers } from '../data/mockData';

const UserProfile = () => {
  const { userId } = useParams();
  const { booksForSale } = useBooksForSale();
  
  // Find user by ID
  const user = mockUsers.find(u => u.id === Number(userId));
  
  if (!user) {
    return (
      <SharedLayout>
        <PageHeader 
          title="User Not Found" 
          subtitle="The requested user profile could not be found"
          icon={User}
          iconGradient="from-red-600 to-red-600"
        />
        <div className="p-6">
          <p className="text-slate-600">Sorry, we couldn't find this user profile.</p>
        </div>
      </SharedLayout>
    );
  }

  // Get books this user is selling
  const userBooksForSale = booksForSale.filter(sale => 
    sale.sellerId === user.id && sale.status === 'Available'
  );

  return (
    <SharedLayout>
      <PageHeader 
        title={`${user.firstName} ${user.lastName}`}
        subtitle="Seller Profile"
        icon={User}
        iconGradient="from-blue-600 to-indigo-600"
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <StarRating rating={user.rating || 0} size="sm" />
                  <span className="text-sm text-slate-600">
                    {user.rating?.toFixed(1)} rating
                  </span>
                </div>
                <span className="text-sm text-slate-600">
                  {user.totalSales} books sold
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Books for Sale Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Books Available ({userBooksForSale.length})
          </h3>
          
          {userBooksForSale.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userBooksForSale.map((sale) => (
                sale.book && (
                  <div key={sale.id} className="relative">
                    <BookCard
                      book={sale.book}
                      onBookClick={() => {}}
                      onToggleFavorite={() => {}}
                      onAddToCollection={() => {}}
                      onAddToBooksRead={() => {}}
                    />
                    {/* Price overlay */}
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                      {sale.currency} {sale.price}
                    </div>
                    {/* Condition badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-slate-600 border">
                      {sale.condition}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>This user currently has no books for sale.</p>
            </div>
          )}
        </div>
      </div>
    </SharedLayout>
  );
};

export default UserProfile;