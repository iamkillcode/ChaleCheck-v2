import { Restaurant } from '@/types/restaurant'

export async function fetchRestaurantData(id: string): Promise<Restaurant | null> {
  try {
    const res = await fetch(`/api/restaurants/${id}`)
    if (!res.ok) throw new Error('Failed to fetch restaurant details')
    return await res.json()
  } catch (error) {
    console.error('Error fetching restaurant data:', error)
    return null
  }
}

