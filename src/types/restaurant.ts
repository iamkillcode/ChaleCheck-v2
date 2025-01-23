// import { User } from './user'
import { Review } from './review'
import { User } from './user'

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
  description: string | null;
  address: string;
  phone: string | null;
  cuisine: string | null;
  priceLevel: number;
  images: string[];
  reviews: Review[];
  favoritedBy: User[];
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  isFavorited?: boolean;
}
  
  