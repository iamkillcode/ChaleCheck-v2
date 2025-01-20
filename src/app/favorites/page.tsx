'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/types/restaurant';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(`/api/users/${session.user.email}/favorites`);
        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching favorites:', error.message);
        } else {
          console.error('Error fetching favorites:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600">
              You need to be signed in to view your favorites.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Favorites</h1>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isAuthenticated={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven&apos;t favorited any restaurants yet.</p>
            <p className="text-gray-600">
              Start exploring restaurants and save your favorites!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 