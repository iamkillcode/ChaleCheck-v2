import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Extract email from URL
    const email = request.url.split('/users/')[1].split('/reviews')[0];

    const reviews = await prisma.review.findMany({
      where: { user: { email } },
      include: {
        restaurant: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json({ error: "Failed to fetch user reviews" }, { status: 500 });
  }
} 