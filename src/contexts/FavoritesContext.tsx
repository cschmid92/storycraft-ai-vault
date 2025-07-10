import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Favorites } from '../types/entities';
import { mockFavorites } from '../data/mockData';

const FAVORITES_STORAGE_KEY = 'bacondo-favorites';

const loadFavorites = (): Favorites => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure the structure is correct
      if (parsed && Array.isArray(parsed.bookIds)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
  }
  return mockFavorites;
};

const saveFavorites = (favorites: Favorites) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

interface FavoritesContextType {
  favorites: Favorites;
  toggleFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
  getFavoriteBooks: () => number[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorites>(() => loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = (bookId: number) => {
    console.log('toggleFavorite called with bookId:', bookId);
    setFavorites(prev => {
      // Ensure prev has the correct structure
      const currentBookIds = prev?.bookIds || [];
      console.log('Current favorites before toggle:', currentBookIds);
      
      const newBookIds = currentBookIds.includes(bookId)
        ? currentBookIds.filter(id => id !== bookId)
        : [...currentBookIds, bookId];
      
      console.log('New favorites after toggle:', newBookIds);
      
      return {
        ...prev,
        bookIds: newBookIds
      };
    });
  };

  const isFavorite = (bookId: number): boolean => {
    const result = favorites?.bookIds?.includes(bookId) || false;
    return result;
  };

  const getFavoriteBooks = (): number[] => {
    const result = favorites?.bookIds || [];
    return result;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      getFavoriteBooks
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};