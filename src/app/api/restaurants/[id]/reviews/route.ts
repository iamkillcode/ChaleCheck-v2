import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to leave a review" },
        { status: 401 }
      );
    }

    // Extract restaurant ID from URL
    const restaurantId = request.url.split('/restaurants/')[1].split('/reviews')[0];
    const { rating, comment } = await request.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        user: { connect: { email: session.user.email! } },
        restaurant: { connect: { id: restaurantId } },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}