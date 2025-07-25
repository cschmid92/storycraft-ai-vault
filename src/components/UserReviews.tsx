import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { UserRating, User } from '../types/entities';
import { Card, CardContent } from "@/components/ui/card";

interface UserReviewsProps {
  ratings: UserRating[];
  users: User[];
}

const UserReviews = ({ ratings, users }: UserReviewsProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-slate-300'
        }`}
      />
    ));
  };

  if (ratings.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => {
        const reviewer = users.find(u => u.id === rating.userId);
        
        return (
          <Card key={rating.id} className="bg-white/50 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {reviewer?.avatar ? (
                  <img 
                    src={reviewer.avatar} 
                    alt={`${reviewer.firstName} ${reviewer.lastName}`}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {reviewer?.firstName?.[0] || 'U'}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : 'Anonymous User'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(rating.rating)}
                        </div>
                        <span className="text-sm text-slate-600">
                          {rating.reviewDate && formatDate(rating.reviewDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {rating.reviewText && (
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {rating.reviewText}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserReviews;