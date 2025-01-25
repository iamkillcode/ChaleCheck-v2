import useSWR from "swr";
import type { Restaurant } from "@/types/restaurant";

/**
 * Generic data fetcher for SWR
 * @param url - The URL to fetch data from
 * @returns Promise with the JSON response
 */
const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

/**
 * Custom hook to fetch restaurant data
 * @param id - Restaurant ID
 * @returns SWR response with restaurant data
 */
export function useRestaurant(id: string) {
  return useSWR<Restaurant>(`/api/restaurants/${id}`, fetcher);
} 