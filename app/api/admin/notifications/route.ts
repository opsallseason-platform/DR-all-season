import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get unread bookings (created in last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, customer_name, service_type, status, created_at')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get unread chat messages
    const { data: chats, error: chatsError } = await supabase
      .from('chat_sessions')
      .select('id, customer_name, last_message, status, created_at')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(10);

    const notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      timestamp: string;
      read: boolean;
    }> = [];

    // Add booking notifications
    if (bookings && bookings.length > 0) {
      bookings.forEach(booking => {
        notifications.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          title: 'New Booking',
          message: `${booking.customer_name || 'Customer'} booked a ${booking.service_type || 'service'}`,
          timestamp: booking.created_at,
          read: false,
        });
      });
    }

    // Add chat notifications
    if (chats && chats.length > 0) {
      chats.forEach(chat => {
        notifications.push({
          id: `chat-${chat.id}`,
          type: 'chat',
          title: 'New Chat Message',
          message: `${chat.customer_name || 'Customer'}: ${chat.last_message?.substring(0, 50) || 'New message'}`,
          timestamp: chat.created_at,
          read: false,
        });
      });
    }

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return Response.json({
      success: true,
      notifications: notifications.slice(0, 10),
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
