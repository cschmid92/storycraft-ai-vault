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
    setFavorites(prev => ({
      ...prev,
      bookIds: prev.bookIds.includes(bookId)
        ? prev.bookIds.filter(id => id !== bookId)
        : [...prev.bookIds, bookId]
    }));
  };

  const isFavorite = (bookId: number): boolean => {
    return favorites.bookIds.includes(bookId);
  };

  const getFavoriteBooks = (): number[] => {
    return favorites.bookIds;
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteBooks
  };
};