import React from 'react';
import { Calendar, Building2, FileText, Globe, Hash, Bookmark, DollarSign } from 'lucide-react';
import { Book } from '../types/entities';

interface BookDetailsGridProps {
  book: Book;
}

const BookDetailsGrid = ({ book }: BookDetailsGridProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Book Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="font-medium text-slate-700">Year:</span>
          <span className="text-slate-600">{book.year}</span>
        </div>
        
        {book.publisher && (
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">Publisher:</span>
            <span className="text-slate-600">{book.publisher}</span>
          </div>
        )}
        
        {book.pages && (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">Pages:</span>
            <span className="text-slate-600">{book.pages}</span>
          </div>
        )}
        
        {book.language && (
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">Language:</span>
            <span className="text-slate-600">{book.language}</span>
          </div>
        )}
        
        {book.isbn10 && (
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">ISBN-10:</span>
            <span className="text-slate-600">{book.isbn10}</span>
          </div>
        )}
        
        {book.isbn13 && (
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">ISBN-13:</span>
            <span className="text-slate-600">{book.isbn13}</span>
          </div>
        )}
        
        {book.binding && (
          <div className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">Binding:</span>
            <span className="text-slate-600">{book.binding}</span>
          </div>
        )}
        
        {book.listPrice && (
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">List Price:</span>
            <span className="text-slate-600">${book.listPrice}</span>
          </div>
        )}
        
        {book.subject && (
          <div className="flex items-center space-x-2 md:col-span-2">
            <span className="font-medium text-slate-700">Subject:</span>
            <span className="text-slate-600">{book.subject}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsGrid;
