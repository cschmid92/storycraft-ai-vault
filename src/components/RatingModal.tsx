import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserRatings } from '../hooks/useUserRatings';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  sellerName: string;
  sellerId: number;
  onRatingComplete: () => void;
}

const RatingModal = ({ isOpen, onClose, bookTitle, sellerName, sellerId, onRatingComplete }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const { rateBook } = useUserRatings();

  const handleSubmitRating = () => {
    if (rating > 0) {
      // In a real app, this would save to a seller ratings system
      console.log('Rating submitted:', { sellerId, rating, comment, bookTitle });
      onRatingComplete();
      onClose();
      // Reset form
      setRating(0);
      setComment('');
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setHoveredRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-slate-600 mb-2">
              How was your experience with <span className="font-medium">{sellerName}</span>?
            </p>
            <p className="text-sm text-slate-500">Book: {bookTitle}</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-colors"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Optional Comment */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Comment (optional)
            </label>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0}
              className="flex-1"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;