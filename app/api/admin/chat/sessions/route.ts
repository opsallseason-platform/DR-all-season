import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .in('status', ['active', 'escalated'])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    // Transform sessions to match expected format
    const transformedSessions = (sessions || []).map((session: any) => ({
      id: session.id,
      sessionToken: session.session_token,
      channel: session.channel || 'web',
      whatsappPhone: session.whatsapp_phone,
      status: session.escalated_at ? 'escalated' : session.status,
      language: session.language,
      messages: Array.isArray(session.messages) ? session.messages : [],
      botData: session.bot_data,
      escalatedAt: session.escalated_at,
      createdAt: session.created_at,
      updatedAt: session.updated_at
    }));

    return NextResponse.json({ sessions: transformedSessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
