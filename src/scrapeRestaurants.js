const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const scrapeRestaurants = async () => {
  try {
    const response = await axios.get('https://www.google.com/search?q=top+restaurants+in+Kumasi');
    const html = response.data;
    const $ = cheerio.load(html);

    const restaurants = [];

    $('.BVG0Nb').each((index, element) => {
      if (index < 10) {
        const name = $(element).text();
        const address = $(element).next('.BNeawe').text();
        const phone = $(element).nextAll('.BNeawe').first().text();
        const cuisine = 'Various';

        restaurants.push({
          name,
          address,
          phone,
          cuisine,
        });
      }
    });

    // Insert into the database
    for (const restaurant of restaurants) {
      await prisma.restaurant.create({
        data: restaurant,
      });
    }

    console.log('Restaurants added to the database:', restaurants);
  } catch (error) {
    console.error('Error scraping restaurants:', error);
  } finally {
    await prisma.$disconnect();
  }
};

scrapeRestaurants(); 