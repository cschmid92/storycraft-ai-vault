
import React, { useState, useEffect } from 'react';
import { X, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCollection: (name: string, color: string, description?: string) => void;
  editMode?: boolean;
  initialName?: string;
  initialColor?: string;
  initialDescription?: string;
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
  initialColor = 'bg-blue-500',
  initialDescription = ''
}: CollectionModalProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log('CollectionModal isOpen:', isOpen);
    if (editMode && isOpen) {
      setName(initialName);
      setSelectedColor(initialColor);
      setDescription(initialDescription);
    } else if (!editMode && isOpen) {
      setName('');
      setSelectedColor('bg-blue-500');
      setDescription('');
    }
  }, [editMode, initialName, initialColor, initialDescription, isOpen]);

  console.log('CollectionModal render - isOpen:', isOpen);

  if (!isOpen) {
    console.log('CollectionModal not rendering - isOpen is false');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('CollectionModal handleSubmit:', { name, selectedColor, description });
    if (name.trim()) {
      onCreateCollection(name.trim(), selectedColor, description.trim() || undefined);
      if (!editMode) {
        setName('');
        setSelectedColor('bg-blue-500');
        setDescription('');
      }
      onClose();
    }
  };

  console.log('CollectionModal rendering modal');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-white/20 p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {editMode ? 'Edit Collection' : 'Create New Collection'}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 bg-white/10 border-slate-300 hover:bg-white/20"
          >
            <X className="h-4 w-4 text-slate-700" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Collection Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name..."
              className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description (optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter collection description..."
              className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                      ? 'border-slate-800 shadow-lg scale-110' 
                      : 'border-slate-300 hover:border-slate-500'
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
              className="flex-1 bg-white/80 border-slate-300 text-slate-700 hover:bg-white/90"
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
