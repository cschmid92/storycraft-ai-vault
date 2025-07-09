import { useState, useEffect } from 'react';
import { UserRating } from '../types/entities';

const USER_RATINGS_STORAGE_KEY = 'bacondo-user-ratings';
const CURRENT_USER_ID = 999;

const loadUserRatings = (): UserRating[] => {
  try {
    const stored = localStorage.getItem(USER_RATINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user ratings from localStorage:', error);
  }
  return []; // Start with empty array
};

const saveUserRatings = (ratings: UserRating[]) => {
  try {
    localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  } catch (error) {
    console.error('Error saving user ratings to localStorage:', error);
  }
};

export const useUserRatings = () => {
  const [userRatings, setUserRatings] = useState<UserRating[]>(() => loadUserRatings());

  useEffect(() => {
    saveUserRatings(userRatings);
  }, [userRatings]);

  const rateBook = (bookId: number, rating: number) => {
    setUserRatings(prev => {
      const existingIndex = prev.findIndex(r => r.bookId === bookId && r.userId === CURRENT_USER_ID);
      
      if (existingIndex >= 0) {
        // Update existing rating
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], rating };
        return updated;
      } else {
        // Add new rating
        return [...prev, {
          id: Date.now(),
          userId: CURRENT_USER_ID,
          bookId,
          rating
        }];
      }
    });
  };

  const getUserRating = (bookId: number): number | undefined => {
    const rating = userRatings.find(r => r.bookId === bookId && r.userId === CURRENT_USER_ID);
    return rating?.rating;
  };

  const getRatedBooks = (): number[] => {
    return userRatings
      .filter(r => r.userId === CURRENT_USER_ID && r.rating > 0)
      .map(r => r.bookId);
  };

  return {
    userRatings,
    rateBook,
    getUserRating,
    getRatedBooks
  };
};