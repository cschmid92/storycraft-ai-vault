import { useState, useEffect } from 'react';
import { Favorites } from '../types/entities';

const FAVORITES_STORAGE_KEY = 'bacondo-favorites';
const CURRENT_USER_ID = 999;

const loadFavorites = (): Favorites => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
  }
  return {
    id: 1,
    userId: CURRENT_USER_ID,
    bookIds: [2, 5, 7] // Default favorites matching previous data
  };
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