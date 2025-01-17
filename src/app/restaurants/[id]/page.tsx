'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

export default function RestaurantDetails({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        const data = await res.json();
        setRestaurant(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [params.id]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-500 text-center py-10">{error}</div>
      </Layout>
    );
  }

  if (!restaurant) {
    return (
      <Layout>
        <div className="text-center py-10">Restaurant not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{restaurant.cuisine}</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{restaurant.address}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{restaurant.phone || 'Not available'}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{restaurant.description || 'No description available'}</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Reviews</h2>
          {restaurant.reviews?.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {restaurant.reviews.map((review) => (
                <li key={review.id} className="border-b pb-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Rating: {review.rating}/5</p>
                      <p className="text-sm text-gray-500">{review.comment}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
} 