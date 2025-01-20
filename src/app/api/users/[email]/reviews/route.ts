import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const reviews = await prisma.review.findMany({
      where: { user: { email: params.email } },
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