
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BookDetailHeaderProps {
  onClose: () => void;
}

const BookDetailHeader = ({ onClose }: BookDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">Book Details</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BookDetailHeader;
