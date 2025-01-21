import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Define correct route segment config
export const dynamic = 'force-dynamic';

// Remove incorrect type definition
// type RouteSegment = { ... }

async function updateFavoriteStatus(restaurantId: string, userEmail: string, isFavorite: boolean) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    throw new Error('Unauthorized');
  }

  return await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      favoritedBy: isFavorite 
        ? { connect: { id: user.id } }
        : { disconnect: { id: user.id } }
    },
    include: {
      favoritedBy: true
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get restaurantId from URL
    const restaurantId = request.url.split('/restaurants/')[1].split('/favorite')[0];

    const restaurant = await updateFavoriteStatus(restaurantId, session.user.email, true);
    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: error.message === "Unauthorized" ? 401 : 500 }
      );
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get restaurantId from URL
    const restaurantId = request.url.split('/restaurants/')[1].split('/favorite')[0];

    const restaurant = await updateFavoriteStatus(restaurantId, session.user.email, false);
    return NextResponse.json(restaurant);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: error.message === "Unauthorized" ? 401 : 500 }
      );
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}