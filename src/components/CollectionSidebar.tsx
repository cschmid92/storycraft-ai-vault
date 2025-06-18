
import React from 'react';
import { Library, Heart, BookOpen, Plus } from 'lucide-react';

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
}

const CollectionSidebar = ({ collections, selectedCollection, onSelectCollection }: CollectionSidebarProps) => {
  return (
    <aside className="w-64 bg-white/5 backdrop-blur-md border-r border-white/10 p-4 h-screen sticky top-16">
      <div className="space-y-6">
        {/* Quick Access */}
        <div>
          <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onSelectCollection(null)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                !selectedCollection 
                  ? 'bg-blue-500/20 text-white border border-blue-500/30' 
                  : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <Library className="h-4 w-4" />
              <span className="text-sm">All Books</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-blue-200 hover:bg-white/10 transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Favorites</span>
            </button>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-3">
            My Collections
          </h3>
          <div className="space-y-1">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => onSelectCollection(collection)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCollection?.id === collection.id 
                    ? 'bg-blue-500/20 text-white border border-blue-500/30' 
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                <span className="text-sm flex-1 truncate">{collection.name}</span>
                <span className="text-xs text-blue-300">{collection.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-purple-200">AI Recommendations</span>
          </div>
          <p className="text-xs text-purple-300 mb-3">
            Based on your reading history, you might enjoy exploring Science Fiction classics.
          </p>
          <button className="text-xs text-purple-400 hover:text-purple-300 underline">
            View suggestions →
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CollectionSidebar;
