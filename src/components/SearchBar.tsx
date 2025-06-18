
import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-blue-300" />
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search books, authors, or genres..."
        className="pl-10 pr-24 py-3 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:ring-blue-500 backdrop-blur-md"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-8"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
