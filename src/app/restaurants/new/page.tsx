'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function AddRestaurant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      cuisine: formData.get('cuisine'),
    };

    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add restaurant');
      }

      setSuccess('Restaurant added successfully!');
      setTimeout(() => {
        router.push('/restaurants');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Restaurant</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new restaurant
            </p>
          </div>

          <div className="px-4 py-5 sm:px-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  id="description"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                />
              </div>

              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                  Cuisine Type
                </label>
                <Input
                  type="text"
                  name="cuisine"
                  id="cuisine"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Adding Restaurant...' : 'Add Restaurant'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 