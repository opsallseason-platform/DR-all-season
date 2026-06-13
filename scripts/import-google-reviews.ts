/**
 * Google Reviews Import Script
 * 
 * This script imports Google Business Profile reviews directly into Supabase.
 * 
 * Since Google doesn't provide a free API for reviews, you need to:
 * 1. Manually copy reviews from your Google profiles
 * 2. Add them to the googleReviews array below
 * 3. Run: npx tsx scripts/import-google-reviews.ts
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkaqzdnffdprcbrawfjq.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYXF6ZG5mZmRwcmNicmF3ZmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NTE2NjgsImV4cCI6MjA4MjAyNzY2OH0.Paoa93bz7Rr-PFfLYwiDV7y1vVsKp42Xu8jeu3B1Kac'
);

// Google Reviews from DR All Season Travel profiles
const googleReviews = [
  {
    name: 'Josue Amezcua',
    rating: 5,
    comment: 'Had a terrible flight experience, but these folks know how to take care of you from the start and made my vacation so much better.',
  },
  {
    name: 'MC',
    rating: 5,
    comment: 'The best to company that offers services to make your experience one of the best while visiting the island.',
  },
  {
    name: 'Yoly Reyes',
    rating: 5,
    comment: 'The best transportation I have ever had in Punta Cana RD. Thanks to Yery',
  },
];

async function importReviews() {
  console.log('📥 Importing Google Reviews...\n');

  for (const review of googleReviews) {
    try {
      // Step 1: Create or find customer entry for the reviewer
      let customerId;
      const nameParts = review.name.split(' ');
      const firstName = nameParts[0] || review.name;
      const lastName = nameParts.slice(1).join(' ') || '';
      const email = `${review.name.replace(/\s+/g, '.').toLowerCase()}@google-review.com`;

      // Try to find existing customer first
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        console.log(`✓ Found existing customer: ${review.name}`);
      } else {
        // Create new customer
        customerId = uuidv4();
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert([{
            id: customerId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (customerError) {
          console.error(`❌ Error creating customer for ${review.name}:`, customerError.message);
          continue;
        }
        console.log(`✓ Created customer: ${review.name}`);
      }

      // Step 2: Insert review with required fields
      const reviewId = uuidv4();
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert([{
          id: reviewId,
          customer_id: customerId,
          booking_id: '21fa5986-4d9f-43b1-b574-f0db4bdcf6ea', // Existing booking
          service_id: '640c2071-ecc8-40df-a0f4-8abf430f8956', // Default service
          rating: review.rating,
          comment: review.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (reviewError) {
        console.error(`❌ Error creating review for ${review.name}:`, reviewError.message);
      } else {
        console.log(`✅ Imported review from ${review.name} (${review.rating}⭐)`);
      }
    } catch (err) {
      console.error(`❌ Failed to import review from ${review.name}:`, err);
    }
  }

  console.log('\n✨ Import complete!');
  console.log(`📊 Total reviews processed: ${googleReviews.length}`);
}

importReviews();
