'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  restaurant: {
    name: string;
    id: string;
  };
}

export default function UserProfile() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch(`/api/users/${session.user.email}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUser(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserReviews = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch(`/api/users/${session.user.email}/reviews`);
        if (!res.ok) {
          throw new Error('Failed to fetch user reviews');
        }
        const data = await res.json();
        setReviews(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, [session]);

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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="mt-1 text-sm text-gray-500">Welcome, {user?.name}!</p>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Your Reviews</h2>
            {reviews.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {review.restaurant.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rating: {review.rating}/5
                        </p>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
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
      </div>
    </Layout>
  );
} 