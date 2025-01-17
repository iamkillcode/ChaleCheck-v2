const axios = require('axios');

const fetchRestaurants = async (location) => {
  const apiKey = 'AIzaSyBPldhZH9NhfAk-uTdUyPt1kt6Sxb-3_3Q'; // Replace with your Google API key
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${location}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const restaurants = response.data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      placeId: place.place_id,
    }));

    console.log(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants from Google Places:', error);
  }
};

// Fetch restaurants in Accra
fetchRestaurants('Accra, Ghana');

// Fetch restaurants in Kumasi
fetchRestaurants('Kumasi, Ghana'); 