import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import StarRating from './StarRating';
import { User, Book } from '../types/entities';
import { useToast } from '../hooks/use-toast';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  book: Book;
  userType: 'buyer' | 'seller';
}

const RatingModal = ({ isOpen, onClose, user, book, userType }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the rating to your backend
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Rating submitted",
        description: `Thank you for rating ${user.username}!`,
      });
      
      onClose();
      setRating(0);
      setComment('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair", 
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Rate {userType === 'buyer' ? 'Seller' : 'Buyer'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              How was your experience with <span className="font-medium">{user.username}</span>?
            </p>
            <div className="text-xs text-muted-foreground">
              Book: {book.title}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex flex-col items-center space-y-2">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {ratingLabels[rating as keyof typeof ratingLabels]}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder={`Share your experience with ${user.username}...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;