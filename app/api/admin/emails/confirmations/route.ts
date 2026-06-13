import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';
import { sendBookingConfirmationEmail } from '@/lib/email/service';

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return Response.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      );
    }

    // Fetch booking details from the database
    const { data: booking, error: fetchError } = await supabaseDb
      .from('bookings')
      .select('*, services(title_en, title_es, category)')
      .eq('id', bookingId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!booking) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Format the booking date for display
    const bookingDate = new Date(booking.service_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send the confirmation email
    const result = await sendBookingConfirmationEmail(
      booking.id,
      booking.customer_email,
      `${booking.customer_first_name} ${booking.customer_last_name}`,
      booking.services?.title_en || booking.services?.title_es || 'Service',
      bookingDate,
      booking.service_time,
      booking.booking_reference
    );

    if (!result.success) {
      return Response.json(
        { error: result.error || 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    return Response.json({ 
      message: 'Confirmation email sent successfully',
      communicationId: result.communicationId 
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
