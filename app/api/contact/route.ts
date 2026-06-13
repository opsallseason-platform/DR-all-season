import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';

/**
 * Business hours (Dominican Republic - AST, UTC-4):
 * Mon-Fri: 8:00 AM - 8:00 PM
 * Sat: 9:00 AM - 6:00 PM
 * Sun: 10:00 AM - 4:00 PM
 */
function isAfterBusinessHours(): boolean {
  // Get current time in Dominican Republic (AST = UTC-4)
  const now = new Date();
  const utcHours = now.getUTCHours();
  const drHour = ((utcHours - 4) + 24) % 24;
  const drDay = now.getUTCDay(); // 0 = Sunday, 6 = Saturday

  // Adjust day if hour shift crosses midnight
  let adjustedDay = drDay;
  if (utcHours < 4) {
    adjustedDay = (drDay - 1 + 7) % 7;
  }

  switch (adjustedDay) {
    case 0: // Sunday: 10:00 AM - 4:00 PM
      return drHour < 10 || drHour >= 16;
    case 6: // Saturday: 9:00 AM - 6:00 PM
      return drHour < 9 || drHour >= 18;
    default: // Mon-Fri: 8:00 AM - 8:00 PM
      return drHour < 8 || drHour >= 20;
  }
}

function getNextBusinessDay(): string {
  const now = new Date();
  // Work in DR timezone
  const drOffset = -4 * 60; // AST offset in minutes
  const localOffset = now.getTimezoneOffset();
  const drTime = new Date(now.getTime() + (localOffset + drOffset) * 60000);
  
  // Add 1 day to get next day
  drTime.setDate(drTime.getDate() + 1);
  
  // Skip to Monday if next day is Sunday
  if (drTime.getDay() === 0) {
    drTime.setDate(drTime.getDate() + 1);
  }
  
  return drTime.toISOString().split('T')[0];
}

// POST /api/contact - Save contact form submission as a lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check - if 'website' field is filled, it's a bot
    if (body.website) {
      console.log('Spam detected: honeypot field filled');
      return Response.json(
        { success: false, error: 'Spam detected' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return Response.json(
        { success: false, error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return Response.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const afterHours = isAfterBusinessHours();
    const followUpDate = afterHours ? getNextBusinessDay() : null;

    // Insert into leads table
    const { data: lead, error } = await supabaseDb
      .from('leads')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject,
        message: body.message,
        source: 'contact_form',
        status: 'new',
        is_after_hours: afterHours,
        follow_up_date: followUpDate,
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(
      { 
        success: true, 
        message: afterHours 
          ? 'Message received! We will call you back on the next business day.' 
          : 'Message received! We will get back to you shortly.',
        leadId: lead.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving contact form:', error);
    return Response.json(
      { success: false, error: 'Failed to submit message. Please try again.' },
      { status: 500 }
    );
  }
}
