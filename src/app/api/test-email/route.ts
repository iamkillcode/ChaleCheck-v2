import { NextResponse } from "next/server";
import { sendEmail } from '@/lib/email';

export async function GET() {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });

    return NextResponse.json({ message: 'Test email sent' });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
} 