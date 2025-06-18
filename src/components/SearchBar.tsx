
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-500" />
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search books, authors, or genres..."
        className="pl-10 py-3 bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-500 focus:ring-blue-500 backdrop-blur-md"
      />
    </div>
  );
};

export default SearchBar;
