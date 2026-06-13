import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';
import { randomBytes, randomUUID } from 'crypto';
import { CreateBookingRequest, BookingResponse } from '@/types';

// Helper function to generate booking reference
function generateBookingReference(): string {
  const prefix = 'DR';
  const date = new Date().toISOString().slice(2, 4) + new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(8, 10);
  const random = randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}${date}${random}`;
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingRequest = await request.json();
    
    // Validate required fields
    if (!body.serviceId || !body.serviceDate || !body.serviceTime || !body.numPassengers || !body.customerEmail || !body.customerFirstName || !body.customerLastName) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if service exists and is active
    const { data: service, error: serviceError } = await supabaseDb
      .from('services')
      .select('*, pricing_tiers(*)')
      .eq('id', body.serviceId)
      .eq('status', 'active')
      .maybeSingle();

    if (serviceError) throw serviceError;

    if (!service) {
      return Response.json(
        { success: false, error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Sort pricing tiers by min_passengers
    const pricingTiers = (service.pricing_tiers || []).sort((a: any, b: any) => a.min_passengers - b.min_passengers);

    // Find the appropriate pricing tier based on passenger count
    let pricingTier = pricingTiers.find((tier: any) => 
      body.numPassengers >= tier.min_passengers && 
      (tier.max_passengers === null || body.numPassengers <= tier.max_passengers)
    );

    // If no exact tier found, use the highest tier
    if (!pricingTier && pricingTiers.length > 0) {
      pricingTier = pricingTiers
        .filter((tier: any) => tier.max_passengers === null || body.numPassengers >= tier.min_passengers)
        .sort((a: any, b: any) => b.min_passengers - a.min_passengers)[0];
      
      // If still no match, use the first available tier as fallback
      if (!pricingTier) {
        pricingTier = pricingTiers[0];
      }
    }

    // If no pricing tiers exist at all, use the service base_price or default
    if (!pricingTier) {
      pricingTier = {
        price_per_person: service.base_price || service.price || 0,
        min_passengers: 1,
        max_passengers: null,
      };
    }

    // Check availability for the selected date and time
    const serviceDate = new Date(body.serviceDate);
    const dateStr = serviceDate.toISOString().split('T')[0];
    
    // Check if the requested date is in the past
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (serviceDate < now) {
      return Response.json(
        { success: false, error: 'Cannot book for past dates' },
        { status: 400 }
      );
    }

    // Check if there's an availability override for this date
    const { data: override } = await supabaseDb
      .from('availability_overrides')
      .select('*')
      .eq('service_id', body.serviceId)
      .eq('override_date', dateStr)
      .maybeSingle();

    // If the date is marked as unavailable
    if (override && !override.is_available) {
      return Response.json(
        { success: false, error: 'Service not available on selected date' },
        { status: 400 }
      );
    }

    // Calculate capacity (default to 50 if not configured)
    const maxCapacity = override?.custom_capacity || service.base_capacity || 50;
    
    // Check existing bookings for this service and date
    const { data: existingBookings } = await supabaseDb
      .from('bookings')
      .select('*')
      .eq('service_id', body.serviceId)
      .eq('service_date', dateStr)
      .eq('service_time', body.serviceTime)
      .neq('booking_status', 'cancelled');

    const bookings = existingBookings || [];
    const totalBookedPassengers = bookings.reduce((sum: number, b: any) => sum + b.num_passengers, 0);
    const remainingCapacity = maxCapacity - totalBookedPassengers;

    if (body.numPassengers > remainingCapacity) {
      return Response.json(
        { success: false, error: `Not enough capacity. Only ${remainingCapacity} spots remaining.` },
        { status: 400 }
      );
    }

    // Find customer or create new one
    const { data: existingCustomer } = await supabaseDb
      .from('customers')
      .select('*')
      .eq('email', body.customerEmail)
      .maybeSingle();

    let customer = existingCustomer;

    if (!customer) {
      const { data: newCustomer, error: createCustomerError } = await supabaseDb
        .from('customers')
        .insert({
          email: body.customerEmail,
          first_name: body.customerFirstName,
          last_name: body.customerLastName,
          phone: body.customerPhone || '',
          country: 'DO',
          preferred_language: body.language || 'en',
          hotel_name: body.customerHotel || '',
        })
        .select()
        .single();

      if (createCustomerError) throw createCustomerError;
      customer = newCustomer;
    } else {
      // Update customer info
      const { data: updatedCustomer, error: updateCustomerError } = await supabaseDb
        .from('customers')
        .update({
          first_name: body.customerFirstName,
          last_name: body.customerLastName,
          phone: body.customerPhone || customer.phone || '',
          preferred_language: body.language || customer.preferred_language,
          hotel_name: body.customerHotel || customer.hotel_name || '',
        })
        .eq('id', customer.id)
        .select()
        .single();

      if (updateCustomerError) throw updateCustomerError;
      customer = updatedCustomer;
    }

    // Calculate pricing
    const pricePerPerson = Number(pricingTier.price_per_person);
    const subtotal = pricePerPerson * body.numPassengers;
    const taxAmount = subtotal * 0.18; // 18% tax
    const totalAmount = subtotal + taxAmount;

    // Generate unique booking reference
    let bookingReference = generateBookingReference();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const tempReference = generateBookingReference();
      const { data: existingBooking } = await supabaseDb
        .from('bookings')
        .select('id')
        .eq('booking_reference', tempReference)
        .maybeSingle();
      
      if (!existingBooking) {
        bookingReference = tempReference;
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return Response.json(
        { success: false, error: 'Could not generate unique booking reference' },
        { status: 500 }
      );
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabaseDb
      .from('bookings')
      .insert({
        id: randomUUID(),
        booking_reference: bookingReference,
        service_id: body.serviceId,
        customer_id: customer.id,
        service_date: dateStr,
        service_time: body.serviceTime,
        num_passengers: body.numPassengers,
        price_per_person: pricePerPerson,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        currency: 'USD',
        booking_status: 'pending',
        payment_status: 'pending',
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone || '',
        customer_first_name: body.customerFirstName,
        customer_last_name: body.customerLastName,
        customer_hotel: body.customerHotel || '',
        language: body.language || 'en',
        special_requests: body.specialRequests || '',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Update service total bookings count (non-critical)
    try {
      const { data: svc } = await supabaseDb
        .from('services')
        .select('total_bookings')
        .eq('id', body.serviceId)
        .single();
      if (svc) {
        await supabaseDb
          .from('services')
          .update({ total_bookings: (svc.total_bookings || 0) + 1 })
          .eq('id', body.serviceId);
      }
    } catch {
      // Non-critical: silently fail
    }

    // Return success response
    const response: BookingResponse = {
      success: true,
      booking: {
        id: booking.id,
        bookingReference: booking.booking_reference,
        serviceId: booking.service_id,
        customerId: booking.customer_id,
        serviceDate: booking.service_date,
        serviceTime: booking.service_time,
        numPassengers: booking.num_passengers,
        pricePerPerson: Number(booking.price_per_person),
        subtotal: Number(booking.subtotal),
        taxAmount: Number(booking.tax_amount),
        totalAmount: Number(booking.total_amount),
        currency: booking.currency,
        bookingStatus: booking.booking_status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
        paymentStatus: booking.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone || undefined,
        customerFirstName: booking.customer_first_name,
        customerLastName: booking.customer_last_name,
        customerHotel: booking.customer_hotel || undefined,
        language: booking.language,
        specialRequests: booking.special_requests || undefined,
        assignedDriverGuide: booking.assigned_driver_guide || undefined,
        internalNotes: booking.internal_notes || undefined,
        inventoryLockedUntil: booking.inventory_locked_until || undefined,
        createdAt: booking.created_at,
        confirmedAt: booking.confirmed_at || undefined,
        cancelledAt: booking.cancelled_at || undefined,
        completedAt: booking.completed_at || undefined,
        updatedAt: booking.updated_at,
      },
      bookingReference: booking.booking_reference
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get booking by reference
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingReference = searchParams.get('reference');

  if (!bookingReference) {
    return Response.json(
      { success: false, error: 'Booking reference is required' },
      { status: 400 }
    );
  }

  try {
    const { data: booking, error } = await supabaseDb
      .from('bookings')
      .select('*, services(title_en, title_es, category)')
      .eq('booking_reference', bookingReference)
      .maybeSingle();

    if (error) throw error;

    if (!booking) {
      return Response.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      booking: {
        id: booking.id,
        bookingReference: booking.booking_reference,
        serviceId: booking.service_id,
        customerId: booking.customer_id,
        serviceDate: booking.service_date,
        serviceTime: booking.service_time,
        numPassengers: booking.num_passengers,
        pricePerPerson: Number(booking.price_per_person),
        subtotal: Number(booking.subtotal),
        taxAmount: Number(booking.tax_amount),
        totalAmount: Number(booking.total_amount),
        currency: booking.currency,
        bookingStatus: booking.booking_status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
        paymentStatus: booking.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone || undefined,
        customerFirstName: booking.customer_first_name,
        customerLastName: booking.customer_last_name,
        customerHotel: booking.customer_hotel || undefined,
        language: booking.language,
        specialRequests: booking.special_requests || undefined,
        assignedDriverGuide: booking.assigned_driver_guide || undefined,
        internalNotes: booking.internal_notes || undefined,
        inventoryLockedUntil: booking.inventory_locked_until || undefined,
        createdAt: booking.created_at,
        confirmedAt: booking.confirmed_at || undefined,
        cancelledAt: booking.cancelled_at || undefined,
        completedAt: booking.completed_at || undefined,
        updatedAt: booking.updated_at,
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
