import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';

interface Restaurant {
  name: string;
  address: string;
  cuisine?: string;
  phone?: string;
}

async function scrapeRestaurants(): Promise<void> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.tripadvisor.com/Restaurants-g293797-Accra_Greater_Accra.html');

    const restaurants: Restaurant[] = await page.evaluate(() => {
      const items = document.querySelectorAll('.restaurants-list-ListCell__cellContainer--2mpJS');
      return Array.from(items).map(item => {
        const nameElement = item.querySelector('.restaurants-list-ListCell__restaurantName--2aSdo');
        const addressElement = item.querySelector('.restaurants-list-ListCell__neighborhood--3f2yS');
        const cuisineElement = item.querySelector('.restaurants-list-ListCell__cuisine--23fr2');

        return {
          name: nameElement?.textContent?.trim() || '',
          address: addressElement?.textContent?.trim() || '',
          cuisine: cuisineElement?.textContent?.trim(),
        };
      });
    });

    for (const restaurant of restaurants) {
      if (restaurant.name && restaurant.address) {
        await prisma.restaurant.create({
          data: {
            name: restaurant.name,
            address: restaurant.address,
            cuisine: restaurant.cuisine,
          },
        });
      }
    }

    console.log('Successfully scraped and saved restaurants');
  } catch (error) {
    console.error('Error scraping restaurants:', error);
  } finally {
    await browser.close();
  }
}

export default scrapeRestaurants; 