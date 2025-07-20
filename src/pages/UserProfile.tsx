import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { Star, MapPin, Calendar, BookOpen, ShoppingBag } from 'lucide-react';
import StarRating from '../components/StarRating';
import UsedBookCard from '../components/UsedBookCard';
import SharedLayout from '../components/SharedLayout';
import { User, BookForSale } from '../types/entities';
import { useBooksForSale } from '../hooks/useBooksForSale';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userBooks, setUserBooks] = useState<BookForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const { booksForSale } = useBooksForSale();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      // Mock user data - in real app, fetch from API
      const mockUser: User = {
        id: parseInt(userId),
        email: 'user@example.com',
        username: 'bookworm_92',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: '/placeholder.svg',
        rating: 4.5,
        totalSales: 23,
        createdAt: new Date('2023-01-15'),
      };
      
      // Filter books by this user
      const userBooksForSale = booksForSale.filter(book => book.sellerId === parseInt(userId));
      
      setUser(mockUser);
      setUserBooks(userBooksForSale);
      setLoading(false);
    };

    fetchUserData();
  }, [userId, booksForSale]);

  if (loading) {
    return (
      <SharedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </SharedLayout>
    );
  }

  if (!user) {
    return (
      <SharedLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">User not found</h2>
              <p className="text-muted-foreground">The requested user profile could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="text-lg">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={user.rating || 0} readonly size="sm" />
                        <span className="text-sm font-medium">{user.rating?.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Overall rating</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">{user.totalSales || 0}</p>
                      <p className="text-xs text-muted-foreground">Books sold</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {user.createdAt?.toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">Member since</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>

        {/* Books for Sale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Books for Sale ({userBooks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userBooks.map((bookForSale) => (
                  <UsedBookCard 
                    key={bookForSale.id} 
                    bookForSale={bookForSale}
                    onBookClick={() => {}}
                    onContactSeller={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No books for sale</h3>
                <p className="text-muted-foreground">This user hasn't listed any books yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews Section (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-border pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">User{i}</span>
                        <StarRating rating={5 - (i - 1)} readonly size="sm" />
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great seller! Book was exactly as described and shipped quickly.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SharedLayout>
  );
};

export default UserProfile;