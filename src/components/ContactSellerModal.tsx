import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookForSale } from '../types/entities';
import { useToast } from "@/hooks/use-toast";
import { conversationService } from '../services/conversationService';

interface ContactSellerModalProps {
  bookForSale: BookForSale | null;
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated?: () => void;
}

const ContactSellerModal = ({ bookForSale, isOpen, onClose, onConversationCreated }: ContactSellerModalProps) => {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send to the seller.",
        variant: "destructive",
      });
      return;
    }

    if (!bookForSale) return;

    try {
      // Create or add to conversation
      const currentUserId = 999; // Current user ID
      conversationService.createConversation(currentUserId, bookForSale, message.trim());
      
      const sellerName = bookForSale?.seller ? `${bookForSale.seller.firstName} ${bookForSale.seller.lastName}` : 'the seller';
      
      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${sellerName}. Check your messages for replies.`,
      });

      setMessage('');
      setPhoneNumber('');
      onClose();
      onConversationCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!bookForSale?.book || !bookForSale?.seller) return null;

  const book = bookForSale.book;
  const seller = bookForSale.seller;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to {seller.firstName} {seller.lastName} about "{book.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seller Info */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            <img 
              src={seller.avatar} 
              alt={`${seller.firstName} ${seller.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-slate-800">{seller.firstName} {seller.lastName}</h4>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span>{seller.rating}</span>
                </div>
                <span>•</span>
                <span>{seller.totalSales} sales</span>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-16 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 line-clamp-1">{book.title}</h4>
              <p className="text-sm text-slate-600">{book.author}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold text-green-600">${bookForSale.price}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {bookForSale.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-3">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Your Phone Number (optional)
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., (555) 123-4567 (optional)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <Textarea
                id="message"
                placeholder={`Hi ${seller.firstName}! I'm interested in purchasing "${book.title}". Is it still available?`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerModal;