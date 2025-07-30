import React, { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookForSale } from '../types/entities';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number, condition: string) => void;
  bookForSale: BookForSale | null;
}

const EditBookModal = ({ isOpen, onClose, onConfirm, bookForSale }: EditBookModalProps) => {
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');

  useEffect(() => {
    if (bookForSale && isOpen) {
      setPrice(bookForSale.price.toString());
      setCondition(bookForSale.condition || '');
    }
  }, [bookForSale, isOpen]);

  if (!isOpen || !bookForSale) return null;

  const handleConfirm = () => {
    const numPrice = parseFloat(price);
    if (numPrice > 0 && condition) {
      onConfirm(numPrice, condition);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Book Sale
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-4">
          <img 
            src={bookForSale.book?.cover} 
            alt={bookForSale.book?.title}
            className="w-12 h-16 object-cover rounded"
          />
          <div>
            <h3 className="font-medium text-slate-800">{bookForSale.book?.title}</h3>
            <p className="text-slate-600 text-sm">{bookForSale.book?.author}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-medium">CHF</span>
              </div>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="pl-12"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Condition
            </label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select book condition" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-300 z-[90]">
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Very Good">Very Good</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!price || parseFloat(price) <= 0 || !condition}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;