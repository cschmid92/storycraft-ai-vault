
import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookForSale } from '../types/entities';
import { booksForSale } from '../data/mockData';

interface UsedBookAvailabilityProps {
  bookTitle: string;
}

const UsedBookAvailability = ({ bookTitle }: UsedBookAvailabilityProps) => {
  // Find available used copies of this book (excluding own books)
  const availableUsedBooks = booksForSale.filter(sale => 
    sale.book?.title === bookTitle && 
    sale.sellerId !== 999 && 
    sale.isActive
  );

  if (availableUsedBooks.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-2">Used Book Availability</h4>
        <p className="text-slate-600 text-sm">No used copies currently available</p>
      </div>
    );
  }

  const handleBuyUsedBooks = () => {
    // Navigate to buy used books page with filter for this book
    const searchParams = new URLSearchParams();
    searchParams.set('search', bookTitle);
    window.location.href = `/buy-used-books?${searchParams.toString()}`;
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-800">Used Book Availability</h4>
        <Button
          onClick={handleBuyUsedBooks}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Buy Used
        </Button>
      </div>
      
      <div className="space-y-2">
        {availableUsedBooks.slice(0, 3).map((sale) => (
          <div key={sale.id} className="flex items-center justify-between bg-white rounded p-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {sale.condition}
              </Badge>
              {sale.distance && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {sale.distance} miles
                </div>
              )}
            </div>
            <span className="font-semibold text-green-600">${sale.price}</span>
          </div>
        ))}
        
        {availableUsedBooks.length > 3 && (
          <p className="text-xs text-slate-500 text-center">
            +{availableUsedBooks.length - 3} more available
          </p>
        )}
      </div>
    </div>
  );
};

export default UsedBookAvailability;
