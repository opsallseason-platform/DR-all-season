import { NextRequest } from 'next/server';
import { sendBookingConfirmationEmail } from '@/lib/email/service';
import { supabaseDb } from '@/lib/supabase/db';

export async function POST(request: NextRequest) {
  try {
    console.log('=== SEND CONFIRMATION EMAIL STARTED ===');
    const { bookingId } = await request.json();
    console.log('Booking ID:', bookingId);

    if (!bookingId) {
      return Response.json({ success: false, error: 'Booking ID is required' }, { status: 400 });
    }

    // Fetch booking details with service info
    console.log('Fetching booking from database...');
    const { data: booking, error: bookingError } = await supabaseDb
      .from('bookings')
      .select(`
        *,
        services(title_en, title_es, category)
      `)
      .eq('id', bookingId)
      .single();

    console.log('Booking query result:', { booking, bookingError });

    if (bookingError || !booking) {
      console.error('Booking fetch error:', bookingError);
      return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // Build customer name
    const customerName = `${booking.customer_first_name} ${booking.customer_last_name}`;
    console.log('Customer name:', customerName);
    
    // Get service title (prefer English)
    const serviceTitle = booking.services?.title_en || booking.services?.title_es || 'Tour/Transfer';
    console.log('Service title:', serviceTitle);

    // Format date nicely
    const bookingDate = new Date(booking.service_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    console.log('Booking date:', bookingDate);

    // Send confirmation email
    console.log('Attempting to send email via Resend...');
    const result = await sendBookingConfirmationEmail(
      bookingId,
      booking.customer_email,
      customerName,
      serviceTitle,
      bookingDate,
      booking.service_time,
      booking.booking_reference
    );

    console.log('Email send result:', result);

    if (result.success) {
      return Response.json({ 
        success: true, 
        message: 'Confirmation email sent successfully',
        communicationId: result.communicationId 
      });
    } else {
      console.error('Email send failed:', result.error);
      return Response.json({ 
        success: false, 
        error: result.error || 'Failed to send email' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('=== ERROR IN SEND CONFIRMATION ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    return Response.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
