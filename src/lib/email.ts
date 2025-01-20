import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ChaleCheck <noreply@chalecheck.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
      throw error;
    } else {
      console.error('Unknown error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.NEXTAUTH_URL) {
    throw new Error('NEXTAUTH_URL is not set');
  }

  const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    text: `Welcome to Chalecheck! Click this link to verify your email address: ${confirmLink}`,
    html: `
      <h1>Welcome to Chalecheck!</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${confirmLink}">${confirmLink}</a>
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  if (!process.env.NEXTAUTH_URL) {
    throw new Error('NEXTAUTH_URL is not set');
  }

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset your Chalecheck password',
    text: `Click this link to reset your password: ${resetLink}\nThis link will expire in 1 hour.`,
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `
  });
} 