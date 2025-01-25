import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';
import { z } from "zod";
import useSWR from 'swr';

/**
 * Restaurant data model interface
 */
export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  priceLevel: number;
  address: string;
  cuisine?: string;
}

/**
 * Zod schema for validating restaurant data
 */
const RestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().nullable(),
  address: z.string().min(1, "Address is required"),
  priceLevel: z.number().min(1).max(4, "Price level must be between 1 and 4")
});

type RestaurantValidation = z.infer<typeof RestaurantSchema>;

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
 * Scrapes restaurant data from TripAdvisor
 * @throws {Error} If scraping or database operations fail
 */
async function scrapeRestaurants(): Promise<void> {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.tripadvisor.com/Restaurants-g293797-Accra_Greater_Accra.html", {
      waitUntil: "networkidle0"
    });

    const restaurants: Restaurant[] = await page.evaluate(() => {
      const items = document.querySelectorAll(".restaurants-list-ListCell__cellContainer--2mpJS");
      return Array.from(items).map((item): Restaurant => {
        const nameElement = item.querySelector(".restaurants-list-ListCell__restaurantName--2aSdo");
        const addressElement = item.querySelector(".restaurants-list-ListCell__neighborhood--3f2yS");
        const cuisineElement = item.querySelector(".restaurants-list-ListCell__cuisine--23fr2");

        return {
          id: "",
          name: nameElement?.textContent?.trim() || "",
          description: null,
          priceLevel: 1,
          address: addressElement?.textContent?.trim() || "",
          cuisine: cuisineElement?.textContent?.trim()
        };
      });
    });

    for (const restaurant of restaurants) {
      try {
        const validatedData = RestaurantSchema.parse(restaurant);
        await prisma.restaurant.create({
          data: {
            name: validatedData.name,
            address: validatedData.address,
            description: validatedData.description,
            cuisine: restaurant.cuisine
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error for restaurant:", restaurant, error.errors);
        } else {
          console.error("Database error for restaurant:", restaurant, error);
        }
      }
    }

    console.log("Successfully scraped and saved restaurants");
  } catch (error) {
    console.error("Error scraping restaurants:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Custom hook to fetch restaurant data
 * @param id - Restaurant ID
 * @returns SWR response with restaurant data
 */
export function useRestaurant(id: string) {
  return useSWR<Restaurant>(`/api/restaurants/${id}`, fetcher);
}

export default scrapeRestaurants;

// Improve loading states with skeletons
// export function RestaurantSkeleton(): JSX.Element {
//     return (
//         <div className="animate-pulse">
//             <div className="h-48 bg-gray-200 rounded-lg"></div>
//             <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
//         </div>
//     );
// }

/**
 * Error boundary component for handling React errors
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 text-red-500">
          An error occurred. Please try again later.
        </div>
      );
    }

    return this.props.children;
  }
} 