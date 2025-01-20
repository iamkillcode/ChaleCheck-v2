'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import Layout from '@/components/Layout';
import RestaurantCard from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Restaurant } from '@/types/restaurant';

type SortOption = 'rating' | 'reviews' | 'newest';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [priceFilter, setPriceFilter] = useState<number[]>([]);
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);

  const query = searchParams.get('q');
  const location = searchParams.get('location');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          ...(query && { q: query }),
          ...(location && { location }),
          sortBy,
          sortOrder,
          ...(priceFilter.length && { price: priceFilter.join(',') }),
          ...(cuisineFilter.length && { cuisine: cuisineFilter.join(',') }),
        });

        const response = await fetch(`/api/restaurants/search?${params}`);
        if (!response.ok) throw new Error('Failed to fetch results');
        
        let data = await response.json();

        // Client-side sorting
        data = data.sort((a: Restaurant, b: Restaurant) => {
          if (sortBy === 'rating') {
            const aRating = a.reviews.reduce((acc: number, r) => acc + r.rating, 0) / a.reviews.length;
            const bRating = b.reviews.reduce((acc: number, r) => acc + r.rating, 0) / b.reviews.length;
            return sortOrder === 'desc' ? bRating - aRating : aRating - bRating;
          }
          if (sortBy === 'reviews') {
            return sortOrder === 'desc'
              ? b.reviews.length - a.reviews.length
              : a.reviews.length - b.reviews.length;
          }
          // newest
          return sortOrder === 'desc'
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        setRestaurants(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, location, sortBy, sortOrder, priceFilter, cuisineFilter]);

  const togglePriceFilter = (price: number) => {
    setPriceFilter(prev =>
      prev.includes(price)
        ? prev.filter(p => p !== price)
        : [...prev, price]
    );
  };

  const toggleCuisineFilter = (cuisine: string) => {
    setCuisineFilter(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            {query
              ? `Results for "${query}"`
              : 'All Restaurants'}
            {location && ` in ${location}`}
          </h1>

          <div className="flex items-center gap-4">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border rounded-md px-2 py-1"
              >
                <option value="rating">Rating</option>
                <option value="reviews">Review Count</option>
                <option value="newest">Newest</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((price) => (
                      <Button
                        key={price}
                        variant={priceFilter.includes(price) ? 'default' : 'outline'}
                        onClick={() => togglePriceFilter(price)}
                        className="w-12"
                      >
                        {'$'.repeat(price)}
                      </Button>
                    ))}
                  </div>

                  <h3 className="font-medium mb-2 mt-6">Cuisine</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Local', 'Fast Food', 'African', 'Chinese', 'Indian', 'Italian'].map((cuisine) => (
                      <Button
                        key={cuisine}
                        variant={cuisineFilter.includes(cuisine) ? 'default' : 'outline'}
                        onClick={() => toggleCuisineFilter(cuisine)}
                        className="justify-start"
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isAuthenticated={!!session}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 mb-4">No restaurants found</p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 