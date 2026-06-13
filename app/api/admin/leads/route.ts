import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';

// GET /api/admin/leads - Fetch leads for admin dashboard
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // filter by status
  const source = searchParams.get('source'); // filter by source
  const today = searchParams.get('today'); // if 'true', only show today's follow-ups

  try {
    let query = supabaseDb
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (source && source !== 'all') {
      query = query.eq('source', source);
    }

    if (today === 'true') {
      const todayStr = new Date().toISOString().split('T')[0];
      query = query.lte('follow_up_date', todayStr).eq('status', 'new');
    }

    const { data: leads, error } = await query.limit(100);

    if (error) throw error;

    return Response.json({ success: true, leads: leads || [] });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/leads - Update lead status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return Response.json(
        { success: false, error: 'Lead ID and status are required' },
        { status: 400 }
      );
    }

    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabaseDb
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, lead: data });
  } catch (error) {
    console.error('Error updating lead:', error);
    return Response.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
