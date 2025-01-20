import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Next.js 13+ route segment config
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to favorite a restaurant" },
        { status: 401 }
      );
    }

    const restaurantId = params.id;
    const userEmail = session.user.email;

    // Update the restaurant to add the user to favoritedBy
    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        favoritedBy: {
          connect: { email: userEmail }
        }
      },
      include: {
        favoritedBy: true
      }
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error favoriting restaurant:', error);
    return NextResponse.json(
      { error: "Failed to favorite restaurant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update the restaurant to remove the user from favoritedBy
    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        favoritedBy: {
          disconnect: { email: session.user.email }
        }
      },
      include: {
        favoritedBy: true
      }
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}