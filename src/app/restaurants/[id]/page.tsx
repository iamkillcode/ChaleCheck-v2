'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import ReviewForm from '@/components/ReviewForm';
import FavoriteButton from '@/components/FavoriteButton';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  cuisine: string | null;
  reviews: Review[];
  favoritedBy?: { email: string }[];
}

export default function RestaurantDetails({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurantData = async (id: string) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (!res.ok) throw new Error('Failed to fetch restaurant details');
      const data = await res.json();
      setRestaurant(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    params.then(({ id }) => {
      fetchRestaurantData(id);
    });
  }, [params]);

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500 text-center py-10">{error}</div></Layout>;
  if (!restaurant) return <Layout><div className="text-center py-10">Restaurant not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{restaurant.cuisine || 'Various Cuisine'}</p>
            </div>
            {session?.user && (
              <FavoriteButton 
                restaurantId={restaurant.id}
                initialIsFavorited={restaurant.favoritedBy?.some(
                  user => user.email === session.user?.email
                ) || false}
              />
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{restaurant.phone || 'Not available'}</dd>
            </div>
            {restaurant.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{restaurant.description}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Reviews</h2>
          
          {session?.user && (
            <ReviewForm 
              restaurantId={restaurant.id} 
              onReviewAdded={fetchRestaurantData}
            />
          )}

          <div className="mt-6 space-y-6">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}