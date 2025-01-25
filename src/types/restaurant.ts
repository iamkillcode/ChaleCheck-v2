/**
 * Restaurant review interface
 */
export interface RestaurantReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

/**
 * Restaurant data model interface
 */
export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  cuisine: string | null;
  priceLevel: number;
  isNew: boolean;
  reviews: RestaurantReview[];
  images: Array<{
    id: string;
    url: string;
    restaurantId: string;
  }>;
  favoritedBy: Array<{
    id: string;
    email: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}
  
  