import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';

// GET /api/admin/bookings - Fetch all bookings for admin
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const payment = searchParams.get('payment');
  const search = searchParams.get('search');
  const id = searchParams.get('id');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  try {
    // If fetching a single booking by ID
    if (id) {
      const { data: booking, error } = await supabaseDb
        .from('bookings')
        .select('*, services(title_en, title_es, category)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      return Response.json({
        success: true,
        bookings: booking ? [booking] : [],
        total: booking ? 1 : 0,
        page: 1,
        limit: 1,
      });
    }

    let query = supabaseDb
      .from('bookings')
      .select('*, services(title_en, title_es, category)', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Hide archived bookings unless specifically filtering for them
    if (status && status !== 'all') {
      query = query.eq('booking_status', status);
    } else {
      query = query.neq('booking_status', 'archived');
    }

    if (payment && payment !== 'all') {
      query = query.eq('payment_status', payment);
    }

    if (search) {
      query = query.or(
        `booking_reference.ilike.%${search}%,customer_email.ilike.%${search}%,customer_first_name.ilike.%${search}%,customer_last_name.ilike.%${search}%,id.eq.${search}`
      );
    }

    const { data: bookings, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return Response.json({
      success: true,
      bookings: bookings || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings - Archive or permanently delete a booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action') || 'archive'; // 'archive' or 'delete'

    if (!id) {
      return Response.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      const { error } = await supabaseDb
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return Response.json({ success: true, action: 'deleted' });
    } else {
      // Archive: set booking_status to 'archived'
      const { error } = await supabaseDb
        .from('bookings')
        .update({ booking_status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return Response.json({ success: true, action: 'archived' });
    }
  } catch (error) {
    console.error('Error deleting/archiving booking:', error);
    return Response.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/bookings - Update booking status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, booking_status, payment_status, special_requests, internal_notes } = body;

    if (!id) {
      return Response.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (booking_status) {
      updateData.booking_status = booking_status;
      if (booking_status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (booking_status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      } else if (booking_status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
    }

    if (payment_status) updateData.payment_status = payment_status;
    if (special_requests !== undefined) updateData.special_requests = special_requests;
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes;

    const { data: booking, error } = await supabaseDb
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select('*, services(title_en, title_es, category)')
      .single();

    if (error) throw error;

    return Response.json({ success: true, booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return Response.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
