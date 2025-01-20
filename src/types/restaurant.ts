// import { User } from './user'

export interface RestaurantReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  cuisine?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  images?: string[];
  reviews: RestaurantReview[];
  favoritedBy?: { email: string }[];
  isFavorited?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}
  
  