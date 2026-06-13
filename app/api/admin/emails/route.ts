import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, type, bookingId, customerId } = await request.json();

    if (!to || !subject || !content || !type) {
      return Response.json(
        { error: 'Missing required fields: to, subject, content, and type' },
        { status: 400 }
      );
    }

    // Create a communication record in the database
    const { data: communication, error } = await supabaseDb
      .from('communications')
      .insert({
        customer_id: customerId || null,
        booking_id: bookingId || null,
        type,
        direction: 'outbound',
        subject,
        content,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ 
      id: communication.id,
      message: 'Email queued for sending successfully'
    });
  } catch (error) {
    console.error('Error creating email communication:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
