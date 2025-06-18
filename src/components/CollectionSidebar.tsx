
import React from 'react';
import { Library, Heart, BookOpen, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Collection {
  id: number;
  name: string;
  count: number;
  color: string;
}

interface CollectionSidebarProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onSelectCollection: (collection: Collection | null) => void;
  onOpenCollectionModal: () => void;
}

const CollectionSidebar = ({ collections, selectedCollection, onSelectCollection, onOpenCollectionModal }: CollectionSidebarProps) => {
  return (
    <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200 p-4 h-screen sticky top-16">
      <div className="space-y-6">
        {/* New Collection Button */}
        <Button 
          onClick={onOpenCollectionModal}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>

        {/* Quick Access */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onSelectCollection(null)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                !selectedCollection 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Library className="h-4 w-4" />
              <span className="text-sm">All Books</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:bg-slate-100 transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Favorites</span>
            </button>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            My Collections
          </h3>
          <div className="space-y-1">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => onSelectCollection(collection)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCollection?.id === collection.id 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                <span className="text-sm flex-1 truncate">{collection.name}</span>
                <span className="text-xs text-slate-500">{collection.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Book Recommendations */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Book Recommendations</span>
          </div>
          <p className="text-xs text-emerald-700 mb-3">
            Discover new books based on your reading preferences and popular picks.
          </p>
          <button className="text-xs text-emerald-600 hover:text-emerald-700 underline">
            View recommendations →
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CollectionSidebar;
