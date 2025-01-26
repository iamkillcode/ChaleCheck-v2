import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type RestaurantCreateInput = Prisma.RestaurantCreateInput;

const CreateRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().nullable().optional(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().nullable().optional(),
  cuisine: z.string().nullable().optional(),
  priceLevel: z.coerce.number().min(1).max(4).default(1)
}).required();

// GET all restaurants
export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        reviews: {
          include: {
            user: true
          }
        },
        favoritedBy: true,
        images: true
      }
    });
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

// POST a new restaurant
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateRestaurantSchema.parse(body);

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name: validatedData.name,
        description: validatedData.description ?? null,
        address: validatedData.address,
        phone: validatedData.phone ?? null,
        cuisine: validatedData.cuisine ?? null,
        priceLevel: validatedData.priceLevel
      },
      include: {
        reviews: {
          include: {
            user: true
          }
        },
        favoritedBy: true,
        images: true
      }
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
} 