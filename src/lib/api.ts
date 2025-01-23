import { Restaurant } from '@/types/restaurant'

export async function fetchRestaurantData(id: string): Promise<Restaurant | null> {
  try {
    const res = await fetch(`/api/restaurants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable cache
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch restaurant details');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    throw error; // Let the component handle the error
  }
}

