
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Collection {
  id: number;
  name: string;
  count: number;
  color: string;
}

interface CollectionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onSelectCollection: (collectionId: number) => void;
  bookTitle: string;
}

const CollectionSelectionModal = ({ 
  isOpen, 
  onClose, 
  collections, 
  onSelectCollection, 
  bookTitle 
}: CollectionSelectionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Add to Collection</h2>
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
          Select a collection for "<span className="font-medium">{bookTitle}</span>"
        </p>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => {
                onSelectCollection(collection.id);
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <div className={`w-3 h-3 rounded-full ${collection.color}`} />
              <div className="flex-1">
                <span className="text-sm font-medium text-slate-800">{collection.name}</span>
                <p className="text-xs text-slate-500">{collection.count} books</p>
              </div>
              <Plus className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
        
        {collections.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No collections yet.</p>
            <p className="text-slate-400 text-xs mt-1">Create a collection first to add books.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSelectionModal;
