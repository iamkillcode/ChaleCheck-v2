'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FavoriteButton from './FavoriteButton';
import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showDistance?: boolean;
  isAuthenticated?: boolean;
}

export default function RestaurantCard({ 
  restaurant, 
  showDistance = true,
  isAuthenticated = false 
}: RestaurantCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const averageRating = restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) / restaurant.reviews.length;
  const priceLevel = restaurant.priceLevel || 2;

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="group h-full hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {restaurant.images?.[0] ? (
            <CldImage
              src={restaurant.images[0]}
              alt={restaurant.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                isImageLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
              }`}
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
          {isAuthenticated && (
            <div className="absolute top-2 right-2 z-10">
              <FavoriteButton
                restaurantId={restaurant.id}
                initialIsFavorited={restaurant.isFavorited}
              />
            </div>
          )}
        </div>

        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {restaurant.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                {restaurant.cuisine}
                <span className="mx-1">•</span>
                <span className="flex items-center">
                  {Array(priceLevel).fill(0).map((_, i) => (
                    <DollarSign key={i} className="w-3 h-3 fill-current" />
                  ))}
                </span>
              </CardDescription>
            </div>
            {restaurant.isNew && (
              <Button variant="outline" className="text-xs px-2 py-1 h-auto border-primary text-primary">
                New
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= averageRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({restaurant.reviews.length} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address}</span>
              </div>
              {showDistance && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>15 mins</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 