import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to favorite restaurants" },
        { status: 401 }
      );
    }

    const user = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        favorites: {
          connect: { id: params.id }
        }
      }
    });

    return NextResponse.json({ message: "Restaurant added to favorites" });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to manage favorites" },
        { status: 401 }
      );
    }

    const user = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        favorites: {
          disconnect: { id: params.id }
        }
      }
    });

    return NextResponse.json({ message: "Restaurant removed from favorites" });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
} 