'use client';

import { useState } from 'react';

interface FavoriteButtonProps {
  restaurantId: string;
  initialIsFavorited: boolean;
}

export default function FavoriteButton({ restaurantId, initialIsFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch(`/api/restaurants/${restaurantId}/favorite`, {
        method,
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
        isFavorited 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{isFavorited ? 'Favorited' : 'Add to Favorites'}</span>
    </button>
  );
} 