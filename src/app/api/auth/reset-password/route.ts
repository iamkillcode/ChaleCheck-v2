import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!resend) {
      console.error('Resend API key is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

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
      await resend.emails.send({
        from: 'ChaleCheck <noreply@chalecheck.com>',
        to: email,
        subject: 'Password Reset',
        text: 'Click the link to reset your password',
        html: `<p>Click <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}">here</a> to reset your password</p>`,
      });
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