'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/types/restaurant';
import { useDebounce } from '@/hooks/useDebounce';
import Layout from '@/components/Layout';

const popularCuisines = [
  { name: 'Local', icon: '🇬🇭' },
  { name: 'Fast Food', icon: '🍔' },
  { name: 'African', icon: '🍲' },
  { name: 'Chinese', icon: '🥢' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Italian', icon: '🍝' },
];

const locations = ['Accra', 'Kumasi', 'Tema', 'Takoradi'];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Accra');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<{
    trending: Restaurant[];
    new: Restaurant[];
    top: Restaurant[];
  }>({
    trending: [],
    new: [],
    top: [],
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          ...(debouncedSearch && { q: debouncedSearch }),
          ...(selectedLocation && { location: selectedLocation }),
          ...(selectedCuisine && { cuisine: selectedCuisine }),
        });

        const response = await fetch(`/api/restaurants/search?${params}`);
        if (!response.ok) throw new Error('Failed to fetch restaurants');
        
        const data = await response.json();
        
        // Sort restaurants into categories
        setRestaurants({
          trending: data.slice(0, 3),
          new: data.filter((r: Restaurant) => r.isNew).slice(0, 3),
          top: data.sort((a: Restaurant, b: Restaurant) => {
            const aRating = a.reviews.length ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
            const bRating = b.reviews.length ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
            return bRating - aRating;
          }).slice(0, 3),
        });
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [debouncedSearch, selectedLocation, selectedCuisine]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}&location=${selectedLocation}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {session ? `Welcome back, ${session.user?.name?.split(' ')[0]}!` : "Discover Ghana&apos;s Best Dining"}
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              {session ? 'Continue exploring your favorite restaurants' : 'Find and review the best restaurants near you'}
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl bg-white rounded-lg p-2">
              <div className="flex-1 flex items-center gap-2 text-gray-800">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus:ring-0 text-lg"
                />
              </div>
              <div className="flex items-center gap-2 text-gray-800 border-l pl-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <select 
                  className="border-0 focus:ring-0 bg-transparent text-gray-600"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="bg-black text-white hover:bg-black/90">
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Quick Filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {popularCuisines.map((cuisine) => (
              <Button
                key={cuisine.name}
                variant="outline"
                className={`h-auto py-4 flex flex-col items-center gap-2 hover:bg-gray-50 ${
                  selectedCuisine === cuisine.name ? 'border-primary text-primary' : ''
                }`}
                onClick={() => setSelectedCuisine(
                  selectedCuisine === cuisine.name ? null : cuisine.name
                )}
              >
                <span className="text-2xl">{cuisine.icon}</span>
                <span>{cuisine.name}</span>
              </Button>
            ))}
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="trending" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new">
                <Clock className="w-4 h-4 mr-2" />
                New & Hot
              </TabsTrigger>
              <TabsTrigger value="top">
                <Award className="w-4 h-4 mr-2" />
                Top Rated
              </TabsTrigger>
            </TabsList>

            {Object.entries(restaurants).map(([category, items]) => (
              <TabsContent 
                key={category} 
                value={category}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))
                ) : items.length > 0 ? (
                  items.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      isAuthenticated={!!session}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No restaurants found
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Featured Collections */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Best of Accra', 'Date Night Spots', 'Hidden Gems', 'Outdoor Dining'].map((collection) => (
                <div 
                  key={collection} 
                  className="group cursor-pointer hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
                  onClick={() => router.push(`/collections/${collection.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {collection}
                      </h3>
                      <p className="text-sm text-gray-200">12 Places</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}