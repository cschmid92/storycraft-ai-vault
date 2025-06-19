
import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PriceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number) => void;
  bookTitle: string;
}

const PriceInputModal = ({ isOpen, onClose, onConfirm, bookTitle }: PriceInputModalProps) => {
  const [price, setPrice] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const numPrice = parseFloat(price);
    if (numPrice > 0) {
      onConfirm(numPrice);
      setPrice('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Set Sale Price</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-slate-600 mb-4">
          Set a price for "<span className="font-medium">{bookTitle}</span>"
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-slate-500" />
            </div>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="pl-10"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!price || parseFloat(price) <= 0}
            >
              Set Price
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceInputModal;
