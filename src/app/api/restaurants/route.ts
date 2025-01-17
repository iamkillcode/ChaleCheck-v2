import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all restaurants
export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany();
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

// POST a new restaurant
export async function POST(request: Request) {
  try {
    const { name, description, address, phone, cuisine } = await request.json();

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        address,
        phone,
        cuisine,
      },
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
} 