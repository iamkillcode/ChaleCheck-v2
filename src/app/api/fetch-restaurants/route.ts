import { NextResponse } from "next/server";
import axios from 'axios';
import { prisma } from "@/lib/prisma";

export async function GET() {
  const apiKey = 'AIzaSyBPldhZH9NhfAk-uTdUyPt1kt6Sxb-3_3Q'; // Replace with your Google API key
  const locations = ['Accra, Ghana', 'Kumasi, Ghana'];
  const restaurants = [];

  try {
    for (const location of locations) {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${location}&key=${apiKey}`;
      const response = await axios.get(url);
      
      // Log the response data
      console.log('Response from Google Places API:', response.data);

      const places = response.data.results;

      for (const place of places) {
        restaurants.push({
          name: place.name,
          address: place.formatted_address,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          placeId: place.place_id,
        });
      }
    }

    // Store restaurants in the database
    for (const restaurant of restaurants) {
      await prisma.restaurant.create({
        data: {
          name: restaurant.name,
          address: restaurant.address,
          phone: '', // You may need to fetch phone numbers separately
          cuisine: 'Various', // Placeholder
        },
      });
    }

    return NextResponse.json({ message: "Restaurants fetched and stored successfully." });
  } catch (error) {
    console.error('Error fetching restaurants from Google Places:', error);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
} 