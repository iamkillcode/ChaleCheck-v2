import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Log the raw request
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);

    // Parse the JSON
    const body = JSON.parse(rawBody);
    console.log('Parsed body:', body);

    const { email, name, password } = body;

    if (!email || !name || !password) {
      console.log('Missing fields:', { email: !!email, name: !!name, password: !!password });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
        }
      });

      console.log('User created successfully:', { email: user.email, name: user.name });

      return NextResponse.json(
        { user: { email: user.email, name: user.name } },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json(
        { error: "Failed to create user in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
} 