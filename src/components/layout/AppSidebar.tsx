
import React from 'react';
import { Coins, ShoppingCart, Info, Plus, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Book, Collection } from '../../types/entities';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBooksForSale } from '../../hooks/useBooksForSale';
import { useBooksRead } from '../../contexts/BooksReadContext';
import { useCollections } from '../../contexts/CollectionsContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  selectedCollection: Collection | null;
  onSelectCollection: (collection: Collection | null) => void;
  onOpenCollectionModal: () => void;
  books: Book[];
  onBookClick: (book: Book) => void;
  onDeleteCollection?: (collectionId: number | string) => void;
}

const AppSidebar = ({ 
  selectedCollection, 
  onSelectCollection, 
  onOpenCollectionModal,
  books,
  onBookClick,
  onDeleteCollection
}: AppSidebarProps) => {
  const navigate = useNavigate();
  const { collections } = useCollections(); // Use own hook for reactive updates
  const { getMyBooksForSale } = useBooksForSale();
  const { getFavoriteBooks } = useFavorites();
  const { booksReadList } = useBooksRead();
  
  console.log('AppSidebar render - collections:', collections.length, 'booksRead:', booksReadList.length, 'favorites:', getFavoriteBooks().length);
  collections.forEach(collection => {
    console.log(`Collection ${collection.name} has ${collection.bookIds?.length || 0} books`);
  });
  
  const myBooksForSale = getMyBooksForSale();
  const booksForSaleCount = myBooksForSale.filter(sale => 
    sale.status === 'Available'
  ).length;
  
  // Calculate counts fresh on every render (like Favorites does)
  const getCollectionCount = (collectionId: number | string) => {
    if (collectionId === 'favorites') {
      return getFavoriteBooks().length;
    } else if (collectionId === 'books-read') {
      return booksReadList.length;
    } else {
      const collection = collections.find(c => c.id === collectionId);
      return collection?.bookIds?.length || 0;
    }
  };

  // Standard collections - recalculated every render
  const standardCollections = [
    { 
      id: 'favorites', 
      name: "Favorites ❤️", 
      count: getFavoriteBooks().length, 
      color: "bg-red-500" 
    },
    { 
      id: 'books-read', 
      name: "Books read 📖", 
      count: booksReadList.length, 
      color: "bg-green-500" 
    },
  ];


  return (
    <Sidebar className="bg-white/60 backdrop-blur-md border-r border-slate-200">
      <SidebarContent className="p-4 pt-20">
        {/* Quick Access */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Quick Access
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/about" className="flex items-center text-slate-600 hover:bg-slate-100">
                    <Info className="h-4 w-4 mr-3" />
                    <span>About Bacondo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/buy-used-books" className="flex items-center text-slate-600 hover:bg-slate-100">
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    <span>Buy Used Books</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/books-for-sale" className="flex items-center text-slate-600 hover:bg-slate-100">
                    <Coins className="h-4 w-4 mr-3" />
                    <span>My Books for Sale</span>
                    {booksForSaleCount > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-auto">
                        {booksForSaleCount}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            My Collections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Standard Collections */}
              {standardCollections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton 
                    onClick={() => navigate(`/collections/${collection.id}`)}
                    className={`w-full flex items-center space-x-3 ${
                      String(selectedCollection?.id) === String(collection.id)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                    <span className="text-sm flex-1 truncate text-left">{collection.name}</span>
                    <span className="text-xs text-slate-500">{collection.count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* User Collections */}
              {collections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton 
                    onClick={() => navigate(`/collections/${collection.id}`)}
                    className={`w-full flex items-center space-x-3 ${
                      String(selectedCollection?.id) === String(collection.id)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${collection.color}`} />
                    <span className="text-sm flex-1 truncate text-left">{collection.name}</span>
                    <span className="text-xs text-slate-500">{getCollectionCount(collection.id)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* New Collection Button */}
              <SidebarMenuItem>
                <Button 
                  onClick={() => {
                    console.log('AppSidebar: New Collection button clicked');
                    onOpenCollectionModal();
                    console.log('AppSidebar: onOpenCollectionModal called');
                  }}
                  variant="outline"
                  className="w-full justify-start text-slate-600 border-dashed border-slate-300 hover:bg-slate-50 mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Collection
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Social Media Icons */}
      <SidebarFooter className="border-t border-slate-200 pt-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Follow Us
          </h4>
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
              <Facebook className="h-4 w-4 text-blue-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-pink-100">
              <Instagram className="h-4 w-4 text-pink-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
              <Linkedin className="h-4 w-4 text-blue-700" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
              <Twitter className="h-4 w-4 text-blue-500" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
