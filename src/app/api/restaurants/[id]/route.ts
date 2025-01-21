import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Extract restaurant ID from URL
    const restaurantId = request.url.split('/restaurants/')[1].split('/')[0];

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        favoritedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json({ error: "Failed to fetch restaurant" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract restaurant ID from URL
    const restaurantId = request.url.split('/restaurants/')[1].split('/')[0];
    const data = await request.json();
    
    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data,
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract restaurant ID from URL
    const restaurantId = request.url.split('/restaurants/')[1].split('/')[0];

    await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    );
  }
}
