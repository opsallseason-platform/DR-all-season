import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';
import { AvailabilityCheck } from '@/types';

// GET /api/availability - Check availability for a service on a specific date
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');
  const date = searchParams.get('date');

  if (!serviceId || !date) {
    return Response.json(
      { success: false, error: 'Service ID and date are required' },
      { status: 400 }
    );
  }

  try {
    // Validate date format
    let serviceDate: Date;
    try {
      serviceDate = new Date(date);
      if (isNaN(serviceDate.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      return Response.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Check if service exists and is active
    const { data: service, error: serviceError } = await supabaseDb
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('status', 'active')
      .maybeSingle();

    if (serviceError) throw serviceError;

    if (!service) {
      return Response.json(
        { success: false, error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Check if the requested date is in the past
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (serviceDate < now) {
      return Response.json(
        { 
          success: true,
          availability: {
            serviceId,
            date,
            available: false,
            maxCapacity: 0,
            bookedCount: 0,
            availableTimes: [],
            error: 'Cannot check availability for past dates'
          }
        },
        { status: 200 }
      );
    }

    // Format date as ISO string for Supabase date comparison
    const dateStr = serviceDate.toISOString().split('T')[0];

    // Check if there's an availability override for this date
    const { data: override, error: overrideError } = await supabaseDb
      .from('availability_overrides')
      .select('*')
      .eq('service_id', serviceId)
      .eq('override_date', dateStr)
      .maybeSingle();

    if (overrideError) throw overrideError;

    // If the date is marked as unavailable
    if (override && !override.is_available) {
      return Response.json(
        { 
          success: true,
          availability: {
            serviceId,
            date,
            available: false,
            maxCapacity: override.custom_capacity || 0,
            bookedCount: 0,
            availableTimes: [],
            reason: override.reason || 'Service unavailable on this date'
          }
        },
        { status: 200 }
      );
    }

    // Calculate capacity - use override if available, otherwise use base capacity
    const maxCapacity = override?.custom_capacity || service.base_capacity;

    // Check existing bookings for this service and date
    const { data: existingBookings, error: bookingsError } = await supabaseDb
      .from('bookings')
      .select('*')
      .eq('service_id', serviceId)
      .eq('service_date', dateStr)
      .neq('booking_status', 'cancelled');

    if (bookingsError) throw bookingsError;

    const bookings = existingBookings || [];

    // Calculate total booked passengers
    const totalBookedPassengers = bookings.reduce((sum: number, booking: any) => sum + booking.num_passengers, 0);

    // Get service schedules for the specific day of the week
    const dayOfWeek = serviceDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const { data: schedules, error: schedulesError } = await supabaseDb
      .from('service_schedules')
      .select('*')
      .eq('service_id', serviceId)
      .eq('is_active', true)
      .or(`day_of_week.eq.${dayOfWeek},specific_date.eq.${dateStr}`);

    if (schedulesError) throw schedulesError;

    // If no schedules are defined for this day, the service is not available
    if (!schedules || schedules.length === 0) {
      return Response.json(
        { 
          success: true,
          availability: {
            serviceId,
            date,
            available: false,
            maxCapacity,
            bookedCount: totalBookedPassengers,
            availableTimes: [],
            reason: 'No schedule available for this date'
          }
        },
        { status: 200 }
      );
    }

    // Determine available times based on capacity
    const availableTimes: string[] = [];
    
    for (const schedule of schedules) {
      // For each scheduled time, check if there's capacity
      const timeBookings = bookings.filter((booking: any) => booking.service_time === schedule.departure_time);
      const timeBookedCount = timeBookings.reduce((sum: number, booking: any) => sum + booking.num_passengers, 0);
      const timeRemainingCapacity = maxCapacity - timeBookedCount;
      
      if (timeRemainingCapacity > 0) {
        availableTimes.push(schedule.departure_time);
      }
    }

    const availability: AvailabilityCheck = {
      serviceId,
      date,
      available: availableTimes.length > 0,
      availableTimes: availableTimes.length > 0 ? availableTimes : undefined,
      maxCapacity,
      bookedCount: totalBookedPassengers
    };

    return Response.json({ 
      success: true, 
      availability 
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/availability - Bulk availability check
export async function POST(request: NextRequest) {
  try {
    const { serviceId, dates }: { serviceId: string; dates: string[] } = await request.json();

    if (!serviceId || !dates || !Array.isArray(dates)) {
      return Response.json(
        { success: false, error: 'Service ID and dates array are required' },
        { status: 400 }
      );
    }

    // Check if service exists and is active
    const { data: service, error: serviceError } = await supabaseDb
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('status', 'active')
      .maybeSingle();

    if (serviceError) throw serviceError;

    if (!service) {
      return Response.json(
        { success: false, error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Process each date
    const results: AvailabilityCheck[] = [];

    for (const date of dates) {
      // Validate date format
      let serviceDate: Date;
      try {
        serviceDate = new Date(date);
        if (isNaN(serviceDate.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch (error) {
        results.push({
          serviceId,
          date,
          available: false,
          error: 'Invalid date format'
        } as AvailabilityCheck);
        continue;
      }

      // Check if the requested date is in the past
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (serviceDate < now) {
        results.push({
          serviceId,
          date,
          available: false,
          maxCapacity: 0,
          bookedCount: 0,
          availableTimes: [],
          reason: 'Cannot check availability for past dates'
        });
        continue;
      }

      const dateStr = serviceDate.toISOString().split('T')[0];

      // Check if there's an availability override for this date
      const { data: override } = await supabaseDb
        .from('availability_overrides')
        .select('*')
        .eq('service_id', serviceId)
        .eq('override_date', dateStr)
        .maybeSingle();

      // If the date is marked as unavailable
      if (override && !override.is_available) {
        results.push({
          serviceId,
          date,
          available: false,
          maxCapacity: override.custom_capacity || 0,
          bookedCount: 0,
          availableTimes: [],
          reason: override.reason || 'Service unavailable on this date'
        });
        continue;
      }

      // Calculate capacity
      const maxCapacity = override?.custom_capacity || service.base_capacity;

      // Check existing bookings for this service and date
      const { data: existingBookings } = await supabaseDb
        .from('bookings')
        .select('*')
        .eq('service_id', serviceId)
        .eq('service_date', dateStr)
        .neq('booking_status', 'cancelled');

      const bookings = existingBookings || [];

      // Calculate total booked passengers
      const totalBookedPassengers = bookings.reduce((sum: number, booking: any) => sum + booking.num_passengers, 0);

      // Get service schedules for the specific day of the week
      const dayOfWeek = serviceDate.getDay();
      
      const { data: schedules } = await supabaseDb
        .from('service_schedules')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .or(`day_of_week.eq.${dayOfWeek},specific_date.eq.${dateStr}`);

      // If no schedules are defined for this day
      if (!schedules || schedules.length === 0) {
        results.push({
          serviceId,
          date,
          available: false,
          maxCapacity,
          bookedCount: totalBookedPassengers,
          availableTimes: [],
          reason: 'No schedule available for this date'
        });
        continue;
      }

      // Determine available times based on capacity
      const availableTimes: string[] = [];
      
      for (const schedule of schedules) {
        const timeBookings = bookings.filter((booking: any) => booking.service_time === schedule.departure_time);
        const timeBookedCount = timeBookings.reduce((sum: number, booking: any) => sum + booking.num_passengers, 0);
        const timeRemainingCapacity = maxCapacity - timeBookedCount;
        
        if (timeRemainingCapacity > 0) {
          availableTimes.push(schedule.departure_time);
        }
      }

      results.push({
        serviceId,
        date,
        available: availableTimes.length > 0,
        availableTimes: availableTimes.length > 0 ? availableTimes : undefined,
        maxCapacity,
        bookedCount: totalBookedPassengers
      });
    }

    return Response.json({ 
      success: true, 
      availability: results 
    });
  } catch (error) {
    console.error('Error checking bulk availability:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
