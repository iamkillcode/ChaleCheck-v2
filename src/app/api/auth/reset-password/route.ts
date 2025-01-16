import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received password reset request');
    
    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { email } = body;

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

    // Generate reset token even if user doesn't exist (security best practice)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    if (user) {
      console.log('User found, updating reset token');
      
      // Update user with reset token
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpires: tokenExpires
        }
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
    }

    // Always return success (security best practice)
    return NextResponse.json({ 
      message: "If an account exists with this email, you will receive password reset instructions." 
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ 
      error: "Failed to process password reset request" 
    }, { status: 500 });
  }
} 