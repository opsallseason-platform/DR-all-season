import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || !html) {
      return Response.json(
        { success: false, error: 'To, subject, and message are required' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      type: 'manual', // Manual email from admin
    });

    if (result.success) {
      return Response.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
        communicationId: result.communicationId,
      });
    } else {
      return Response.json(
        { success: false, error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
