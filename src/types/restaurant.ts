export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: User;
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
  reviews: Review[];
  favoritedBy?: User[];
  isFavorited?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}
  
  