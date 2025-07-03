
import React, { useState, useEffect } from 'react';
import { X, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCollection: (name: string, color: string) => void;
  editMode?: boolean;
  initialName?: string;
  initialColor?: string;
}

const colorOptions = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500'
];

const CollectionModal = ({ 
  isOpen, 
  onClose, 
  onCreateCollection, 
  editMode = false, 
  initialName = '', 
  initialColor = 'bg-blue-500' 
}: CollectionModalProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');

  useEffect(() => {
    if (editMode && isOpen) {
      setName(initialName);
      setSelectedColor(initialColor);
    } else if (!editMode && isOpen) {
      setName('');
      setSelectedColor('bg-blue-500');
    }
  }, [editMode, initialName, initialColor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateCollection(name.trim(), selectedColor);
      if (!editMode) {
        setName('');
        setSelectedColor('bg-blue-500');
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editMode ? 'Edit Collection' : 'Create New Collection'}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 bg-white/10 border-white/20 hover:bg-white/20"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Collection Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name..."
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              <Palette className="inline h-4 w-4 mr-1" />
              Choose Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-lg ${color} border-2 transition-all duration-200 ${
                    selectedColor === color 
                      ? 'border-white shadow-lg scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              {editMode ? 'Update Collection' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;
