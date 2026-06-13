import { supabaseDb } from '@/lib/supabase/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  bookingId?: string;
  customerId?: string;
  type: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  bookingId,
  customerId,
  type
}: SendEmailParams): Promise<{ success: boolean; error?: string; messageId?: string; communicationId?: string }> {
  try {
    // Create a communication record in the database first
    const { data: communication, error: createError } = await supabaseDb
      .from('communications')
      .insert({
        customer_id: customerId || null,
        booking_id: bookingId || null,
        type,
        direction: 'outbound',
        subject,
        content: html,
        status: 'pending',
      })
      .select()
      .single();

    if (createError) throw createError;

    // Send the actual email
    const { data, error } = await resend.emails.send({
      from: 'DR All Season Travel <bookings@drallseasontravel.com>', // Update with your verified domain
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      // Update the communication status to failed
      await supabaseDb
        .from('communications')
        .update({ 
          status: 'failed',
          error_message: error.message,
          sent_at: new Date().toISOString(),
        })
        .eq('id', communication.id);
      
      return { success: false, error: error.message };
    }

    // Update the communication status to sent
    await supabaseDb
      .from('communications')
      .update({ 
        status: 'sent',
        resend_email_id: data?.id,
        sent_at: new Date().toISOString(),
      })
      .eq('id', communication.id);

    return { success: true, messageId: data?.id, communicationId: communication.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Function to send booking confirmation emails
export async function sendBookingConfirmationEmail(
  bookingId: string,
  customerEmail: string,
  customerName: string,
  serviceTitle: string,
  bookingDate: string,
  bookingTime: string,
  bookingReference: string
): Promise<{ success: boolean; error?: string; communicationId?: string }> {
  const subject = `Your Booking Confirmation - ${bookingReference}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1A2332;">Booking Confirmation</h1>
      <p>Dear ${customerName},</p>
      <p>Thank you for booking with D.R All Season Travel! Your booking has been confirmed.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1A2332; margin-top: 0;">Booking Details</h2>
        <p><strong>Service:</strong> ${serviceTitle}</p>
        <p><strong>Date:</strong> ${bookingDate}</p>
        <p><strong>Time:</strong> ${bookingTime}</p>
        <p><strong>Booking Reference:</strong> ${bookingReference}</p>
      </div>
      
      <p>If you have any questions or need to make changes to your booking, please contact us.</p>
      
      <p>Best regards,<br/>The D.R All Season Travel Team</p>
    </div>
  `;

  const result = await sendEmail({
    to: customerEmail,
    subject,
    html,
    type: 'booking_confirmation',
    bookingId,
    customerId: undefined,
  });
  
  return result;
}

// Function to send promotional emails to customers
export async function sendPromotionalEmail(
  to: string | string[],
  subject: string,
  content: string
): Promise<{ success: boolean; error?: string; communicationId?: string }> {
  const result = await sendEmail({
    to,
    subject,
    html: content,
    type: 'promotional',
  });
  
  return result;
}

// Function to send follow-up emails to customers
export async function sendFollowUpEmail(
  to: string | string[],
  subject: string,
  content: string
): Promise<{ success: boolean; error?: string; communicationId?: string }> {
  const result = await sendEmail({
    to,
    subject,
    html: content,
    type: 'follow_up',
  });
  
  return result;
}
