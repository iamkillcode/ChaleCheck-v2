import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const location = searchParams.get('location');
  const cuisine = searchParams.get('cuisine');

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          // Search in name and description
          {
            OR: [
              {
                name: {
                  contains: query || '',
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query || '',
                  mode: 'insensitive',
                },
              },
            ],
          },
          // Filter by location if provided
          location ? {
            address: {
              contains: location,
              mode: 'insensitive',
            },
          } : {},
          // Filter by cuisine if provided
          cuisine ? {
            cuisine: {
              equals: cuisine,
              mode: 'insensitive',
            },
          } : {},
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search restaurants' },
      { status: 500 }
    );
  }
} 