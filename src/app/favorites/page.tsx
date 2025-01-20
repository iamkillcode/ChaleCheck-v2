'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  cuisine: string | null;
  reviews: {
    rating: number;
  }[];
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/users/favorites');
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        setFavorites(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchFavorites();
    }
  }, [session]);

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (!session?.user) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to view your favorites</h2>
          <Link href="/login" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Go to Login
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">My Favorite Restaurants</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your personally curated collection of favorite restaurants
            </p>
          </div>

          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-6 w-6 bg-blue-200 rounded-full"></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading your favorites...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start adding restaurants to your favorites!
              </p>
              <div className="mt-6">
                <Link
                  href="/restaurants"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Restaurants
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {favorites.map((restaurant) => (
                  <li key={restaurant.id} className="hover:bg-gray-50">
                    <Link
                      href={`/restaurants/${restaurant.id}`}
                      className="block"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-blue-600 truncate">
                              {restaurant.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {restaurant.address}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {restaurant.cuisine || 'Various'}
                            </span>
                            {restaurant.reviews.length > 0 && (
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                  />
                                </svg>
                                {getAverageRating(restaurant.reviews)}
                                <span className="ml-1">
                                  ({restaurant.reviews.length} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 