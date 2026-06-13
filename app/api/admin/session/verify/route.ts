import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if session exists and is not expired
    const { data: session, error } = await supabase
      .from('admin_sessions')
      .select('*, admin_users(email, full_name, is_active)')
      .eq('token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Check if admin is still active
    if (!session.admin_users?.is_active) {
      return NextResponse.json({ valid: false }, { status: 403 });
    }

    return NextResponse.json({ 
      valid: true, 
      user: {
        email: session.admin_users.email,
        name: session.admin_users.full_name || session.admin_users.name,
      }
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
