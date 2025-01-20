import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Log the incoming request
    console.log('Received password reset request');
    
    const { email } = await req.json();
    console.log('Request body:', email);
    
    if (!email) {
      console.log('No email provided');
      return NextResponse.json({ 
        error: "Email is required" 
      }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: "If an account exists with this email, you will receive password reset instructions.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('Reset email sent successfully');
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      return NextResponse.json({ 
        error: "Failed to send reset email" 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: "If an account exists with this email, you will receive password reset instructions.",
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ 
      error: "Failed to process password reset request" 
    }, { status: 500 });
  }
} 