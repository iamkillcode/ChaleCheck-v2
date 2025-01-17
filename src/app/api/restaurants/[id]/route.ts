import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        reviews: true, // Include reviews if you have a Review model
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return NextResponse.json({ error: "Failed to fetch restaurant details" }, { status: 500 });
  }
} 