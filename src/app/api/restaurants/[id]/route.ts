import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import bcrypt from 'bcryptjs';



export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Optional: Add authorization check
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          take: 10, // Limit to 10 most recent reviews
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        favoritedBy: {
          select: {
            email: true,
          },
        },
        _count: {
          select: { reviews: true }
        }
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

    