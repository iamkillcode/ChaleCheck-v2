import { User } from './user'

export interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: User
  restaurant: {
    id: string
    name: string
  }
} 