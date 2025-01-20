import axios from 'axios';
import { prisma } from '@/lib/prisma';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface PlaceResult {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  photos?: Array<{ photo_reference: string }>;
}

async function fetchGooglePlaces() {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+accra&key=${GOOGLE_PLACES_API_KEY}`
    );

    const places = response.data.results;
    
    for (const place of places) {
      const detailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,photos&key=${GOOGLE_PLACES_API_KEY}`
      );

      const details: PlaceResult = detailsResponse.data.result;

      await prisma.restaurant.create({
        data: {
          name: details.name,
          address: details.formatted_address,
          phone: details.formatted_phone_number,
          images: details.photos 
            ? {
                create: details.photos.map(photo => ({
                  url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
                }))
              }
            : undefined
        }
      });
    }

    console.log('Successfully imported restaurants from Google Places');
  } catch (error) {
    console.error('Error fetching from Google Places:', error);
  }
}

export default fetchGooglePlaces; 