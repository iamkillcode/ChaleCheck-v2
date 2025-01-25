import puppeteer from "puppeteer";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Zod schema for validating restaurant data
 */
const RestaurantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().nullable(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().nullable(),
  cuisine: z.string().nullable(),
  priceLevel: z.number().min(1).max(4, "Price level must be between 1 and 4"),
  reviews: z.array(z.any()).optional(),
  favoritedBy: z.array(z.any()).optional(),
  images: z.array(z.any()).optional(),
  isNew: z.boolean().optional()
});

export type Restaurant = z.infer<typeof RestaurantSchema>;

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

    const restaurants = await page.evaluate(() => {
      const items = document.querySelectorAll(".restaurants-list-ListCell__cellContainer--2mpJS");
      return Array.from(items).map((item) => ({
        name: item.querySelector(".restaurants-list-ListCell__restaurantName--2aSdo")?.textContent?.trim() || "",
        description: null,
        address: item.querySelector(".restaurants-list-ListCell__neighborhood--3f2yS")?.textContent?.trim() || "",
        phone: null,
        cuisine: item.querySelector(".restaurants-list-ListCell__cuisine--23fr2")?.textContent?.trim() || null,
        priceLevel: 1
      }));
    });

    for (const restaurant of restaurants) {
      try {
        const validatedData = RestaurantSchema.parse(restaurant);
        await prisma.restaurant.create({
          data: {
            name: validatedData.name,
            description: validatedData.description,
            address: validatedData.address,
            phone: validatedData.phone,
            cuisine: validatedData.cuisine,
            priceLevel: validatedData.priceLevel
          }
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

export default scrapeRestaurants; 