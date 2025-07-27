
import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { BookService } from '../services/bookService';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  
  const [searchForm, setSearchForm] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publisher: '',
    yearFrom: '',
    yearTo: '',
    language: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    ratingMin: ''
  });

  const genres = BookService.getGenres();

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const filters = {
      title: searchForm.title,
      author: searchForm.author,
      isbn: searchForm.isbn,
      genre: searchForm.genre,
      publisher: searchForm.publisher,
      yearFrom: searchForm.yearFrom ? parseInt(searchForm.yearFrom) : undefined,
      yearTo: searchForm.yearTo ? parseInt(searchForm.yearTo) : undefined,
      language: searchForm.language,
      ratingMin: searchForm.ratingMin ? parseInt(searchForm.ratingMin) : undefined,
    };

    const results = BookService.advancedSearch(filters);
    console.log('Advanced search results:', results);
    
    // Navigate to search results with query
    const queryParams = new URLSearchParams();
    if (searchForm.title) queryParams.set('q', searchForm.title);
    navigate(`/search?${queryParams.toString()}`);
  };

  const clearForm = () => {
    setSearchForm({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publisher: '',
      yearFrom: '',
      yearTo: '',
      language: '',
      condition: '',
      priceMin: '',
      priceMax: '',
      ratingMin: ''
    });
  };


  return (
    <AppLayout headerTitle="Advanced Search" headerSubtitle="Find the perfect book">
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button and title */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-slate-800">Advanced Search</h1>
          </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter book title..."
                      value={searchForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Enter author name..."
                      value={searchForm.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      placeholder="Enter ISBN..."
                      value={searchForm.isbn}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <select
                      id="genre"
                      value={searchForm.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      placeholder="Enter publisher..."
                      value={searchForm.publisher}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Filters</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearFrom">Year From</Label>
                      <Input
                        id="yearFrom"
                        type="number"
                        placeholder="1900"
                        value={searchForm.yearFrom}
                        onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearTo">Year To</Label>
                      <Input
                        id="yearTo"
                        type="number"
                        placeholder="2024"
                        value={searchForm.yearTo}
                        onChange={(e) => handleInputChange('yearTo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={searchForm.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <select
                      id="condition"
                      value={searchForm.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Condition</option>
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Acceptable">Acceptable</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceMin">Min Price ($)</Label>
                      <Input
                        id="priceMin"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={searchForm.priceMin}
                        onChange={(e) => handleInputChange('priceMin', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceMax">Max Price ($)</Label>
                      <Input
                        id="priceMax"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        value={searchForm.priceMax}
                        onChange={(e) => handleInputChange('priceMax', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ratingMin">Minimum Rating</Label>
                    <select
                      id="ratingMin"
                      value={searchForm.ratingMin}
                      onChange={(e) => handleInputChange('ratingMin', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                      <option value="1">1+ Stars</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search Books
                </Button>
                <Button variant="outline" onClick={clearForm} className="flex-1">
                  Clear All Filters
                </Button>
              </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdvancedSearch;
