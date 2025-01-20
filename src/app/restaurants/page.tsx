'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Restaurant } from '@/types/restaurant';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        setRestaurants(data);
        
        // Extract unique cuisine types
        const uniqueCuisines = Array.from(new Set(
          data
            .map((r: Restaurant) => r.cuisine)
            .filter((cuisine: string | undefined): cuisine is string => 
              typeof cuisine === 'string'
            )
        )) as string[];
        setCuisineTypes(uniqueCuisines);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover the best restaurants in Ghana
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Cuisines</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="border-t border-gray-200">
            {filteredRestaurants.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredRestaurants.map((restaurant) => (
                  <li key={restaurant.id} className="hover:bg-gray-50">
                    <Link 
                      href={`/restaurants/${restaurant.id}`}
                      className="block px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-blue-600 truncate">
                            {restaurant.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {restaurant.address}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {restaurant.cuisine || 'Various'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No restaurants found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 