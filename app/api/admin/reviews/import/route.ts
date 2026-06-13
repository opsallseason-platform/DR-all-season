import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simple UUID v4 generator without external dependency
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviews } = body;

    console.log('Received reviews:', reviews);

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      console.error('No reviews provided');
      return Response.json({ success: false, error: 'No reviews provided' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let importedCount = 0;

    for (const review of reviews) {
      try {
        const { name, rating, comment } = review;

        if (!name || !comment) {
          console.error('Missing name or comment');
          continue;
        }

        // Step 1: Create customer
        let customerId = generateUUID();
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || name;
        const lastName = nameParts.slice(1).join(' ') || '';
        const email = `${name.replace(/\s+/g, '.').toLowerCase()}@google-review.com`;

        const { error: customerError } = await supabase
          .from('customers')
          .insert([{
            id: customerId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (customerError) {
          // Check if customer already exists
          if (customerError.code === '23505') {
            // Customer exists, fetch it
            const { data: existingCustomer } = await supabase
              .from('customers')
              .select('id')
              .eq('email', email)
              .single();

            if (!existingCustomer) {
              console.error(`Customer exists but not found: ${name}`);
              continue;
            }
            customerId = existingCustomer.id; // Use existing customer ID
            console.log(`Using existing customer: ${name}`);
          } else {
            console.error(`Error creating customer ${name}:`, customerError.message);
            continue;
          }
        } else {
          console.log(`Created new customer: ${name}`);
        }

        // Step 2: Create review (booking_id is optional for manual imports)
        const reviewId = generateUUID();
        const { error: reviewError } = await supabase
          .from('reviews')
          .insert([{
            id: reviewId,
            customer_id: customerId,
            booking_id: null, // No booking required for manual imports
            service_id: null, // No service required for manual imports
            rating: rating || 5,
            comment: comment,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (reviewError) {
          console.error(`Error creating review for ${name}:`, reviewError.message);
          continue;
        }

        console.log(`✅ Successfully imported review from ${name}`);
        importedCount++;
      } catch (err) {
        console.error(`Failed to import review:`, err);
      }
    }

    return Response.json({ success: true, count: importedCount });
  } catch (error) {
    console.error('Error in import reviews API:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}