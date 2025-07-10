import { useState, useEffect } from 'react';
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

export const useFavorites = () => {
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
    console.log(`isFavorite(${bookId}):`, result, 'current favorites:', favorites?.bookIds);
    return result;
  };

  const getFavoriteBooks = (): number[] => {
    const result = favorites?.bookIds || [];
    console.log('getFavoriteBooks():', result);
    return result;
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteBooks
  };
};