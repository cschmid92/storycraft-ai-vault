
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Book, BookForSale } from '../types/entities';
import AppLayout from '../components/layout/AppLayout';
import BuyUsedBooksFilters from '../components/BuyUsedBooksFilters';
import UsedBookGrid from '../components/UsedBookGrid';
import ContactSellerModal from '../components/ContactSellerModal';
import MessengerModal from '../components/MessengerModal';
import { useCollections, Collection } from '../hooks/useCollections';
import { useBooksRead } from '../hooks/useBooksRead';
import { booksForSale } from '../data/mockData';

const BuyUsedBooks = () => {
  const { collections, addCollection, addBookToCollection } = useCollections();
  const { getBooksReadCount } = useBooksRead();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [isContactSellerModalOpen, setIsContactSellerModalOpen] = useState(false);
  const [selectedBookForContact, setSelectedBookForContact] = useState<BookForSale | null>(null);
  const [isMessengerModalOpen, setIsMessengerModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>(undefined);

  // Get books for purchase (excluding own books)
  const filteredBooksForSale = booksForSale.filter(sale => sale.sellerId !== 999);

  // Get unique genres for filtering from the centralized data
  const genres = Array.from(new Set(filteredBooksForSale.map(sale => sale.book?.genre).filter(Boolean)));

  // Filter books based on search term, genre, and distance using centralized data
  const filteredBooks = filteredBooksForSale.filter(sale => {
    const book = sale.book;
    if (!book) return false;
    
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    const matchesDistance = !maxDistance || (sale.distance && sale.distance <= maxDistance);
    
    return matchesSearch && matchesGenre && matchesDistance;
  });

  const handleBookClick = (bookForSale: BookForSale) => {
    // Will be handled by AppLayout modals
  };

  const handleContactSeller = (bookForSale: BookForSale) => {
    setSelectedBookForContact(bookForSale);
    setIsContactSellerModalOpen(true);
  };

  const handleMessageSent = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsMessengerModalOpen(true);
  };

  return (
    <AppLayout headerTitle="Bacondo" headerSubtitle="Your Digital Library">
      <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-4 md:mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h2 className="text-2xl font-bold text-slate-800 ml-2 inline-block">Buy Used Books</h2>
            </div>

            {/* Search and Filters */}
            <BuyUsedBooksFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              maxDistance={maxDistance}
              onDistanceChange={setMaxDistance}
              genres={genres}
            />

            <div className="mb-8">
              <p className="text-slate-600">{filteredBooks.length} books available from the community</p>
            </div>

            <UsedBookGrid
              booksForSale={filteredBooks}
              onBookClick={handleBookClick}
              onContactSeller={handleContactSeller}
            />
          </div>
        
        <ContactSellerModal
          bookForSale={selectedBookForContact}
          isOpen={isContactSellerModalOpen}
          onClose={() => setIsContactSellerModalOpen(false)}
          onMessageSent={handleMessageSent}
        />
        
        <MessengerModal
          isOpen={isMessengerModalOpen}
          onClose={() => setIsMessengerModalOpen(false)}
          selectedConversationId={selectedConversationId}
        />
      </div>
    </AppLayout>
  );
};

export default BuyUsedBooks;
