import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const location = searchParams.get('location');
    const cuisine = searchParams.get('cuisine');

    const restaurants = await prisma.restaurant.findMany({
      where: {
        OR: [
          { name: { contains: q || '', mode: 'insensitive' } },
          { description: { contains: q || '', mode: 'insensitive' } },
          { address: { contains: location || '', mode: 'insensitive' } },
          { cuisine: { contains: cuisine || '', mode: 'insensitive' } },
        ],
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
        favoritedBy: true,
        images: true,
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to search restaurants' },
      { status: 500 }
    );
  }
} 