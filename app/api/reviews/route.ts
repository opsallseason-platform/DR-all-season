import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, customerId, serviceId, rating, title, comment } = await request.json();

    if (!bookingId || !customerId || !serviceId || !rating) {
      return Response.json(
        { error: 'Missing required fields: bookingId, customerId, serviceId, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify that the booking exists and belongs to the customer
    const { data: booking, error: bookingError } = await supabaseDb
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('customer_id', customerId)
      .eq('service_id', serviceId)
      .maybeSingle();

    if (bookingError) throw bookingError;

    if (!booking) {
      return Response.json(
        { error: 'Booking not found or does not belong to the customer' },
        { status: 404 }
      );
    }

    // Check if the service exists
    const { data: service, error: serviceError } = await supabaseDb
      .from('services')
      .select('id')
      .eq('id', serviceId)
      .maybeSingle();

    if (serviceError) throw serviceError;

    if (!service) {
      return Response.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check if the customer already submitted a review for this booking
    const { data: existingReview } = await supabaseDb
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (existingReview) {
      return Response.json(
        { error: 'Review already submitted for this booking' },
        { status: 400 }
      );
    }

    // Create the review
    const { data: review, error: createError } = await supabaseDb
      .from('reviews')
      .insert({
        booking_id: bookingId,
        customer_id: customerId,
        service_id: serviceId,
        rating,
        title: title || null,
        comment: comment || null,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Update the service's average rating
    const { data: allReviews } = await supabaseDb
      .from('reviews')
      .select('rating')
      .eq('service_id', serviceId);

    if (allReviews && allReviews.length > 0) {
      const averageRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
      
      await supabaseDb
        .from('services')
        .update({ average_rating: averageRating })
        .eq('id', serviceId);
    }

    return Response.json({ 
      message: 'Review submitted successfully',
      reviewId: review.id 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const customerId = searchParams.get('customerId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build the query
    let query = supabaseDb
      .from('reviews')
      .select('*, customers(first_name, last_name), services(title_en, title_es)', { count: 'exact' });

    if (serviceId) query = query.eq('service_id', serviceId);
    if (customerId) query = query.eq('customer_id', customerId);

    const { data: reviews, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const total = count || 0;

    return Response.json({ 
      reviews: reviews || [],
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
