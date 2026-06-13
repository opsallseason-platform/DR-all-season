/**
 * DATABASE VERIFICATION SCRIPT
 * Check what's currently in your Supabase database before making changes
 * 
 * Run with: npx tsx scripts/check-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
    }
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n');
  console.log(`Project URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

  // Check services table
  console.log('📋 SERVICES TABLE');
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('id, title_en, category, status, featured, featured_image')
    .order('category')
    .order('title_en');

  if (servicesError) {
    console.error('❌ Error fetching services:', servicesError.message);
  } else {
    console.log(`✅ Found ${services?.length || 0} services\n`);
    
    // Group by category
    const tours = services?.filter(s => s.category === 'tour') || [];
    const excursions = services?.filter(s => s.category === 'excursion') || [];
    const transfers = services?.filter(s => s.category === 'transfer') || [];

    console.log('   Tours:', tours.length);
    tours.forEach(t => console.log(`      - ${t.title_en} (${t.status})`));
    
    console.log('\n   Excursions:', excursions.length);
    excursions.forEach(e => console.log(`      - ${e.title_en} (${e.status})`));
    
    console.log('\n   Transfers:', transfers.length);
    transfers.forEach(t => console.log(`      - ${t.title_en} (${t.status})`));
  }

  // Check pricing_tiers table
  console.log('\n\n💰 PRICING TIERS TABLE');
  const { data: pricing, error: pricingError } = await supabase
    .from('pricing_tiers')
    .select('id, service_id, price_per_person, child_price, min_passengers, max_passengers');

  if (pricingError) {
    console.error('❌ Error fetching pricing_tiers:', pricingError.message);
  } else {
    console.log(`✅ Found ${pricing?.length || 0} pricing tiers\n`);
    
    // Check if child_price column exists
    const hasChildPrice = pricing && pricing.length > 0 && 'child_price' in pricing[0];
    console.log(`   Child price column exists: ${hasChildPrice ? '✅ YES' : '❌ NO'}`);
    
    if (pricing && pricing.length > 0) {
      console.log('\n   Sample pricing tier:');
      console.log('   ', JSON.stringify(pricing[0], null, 2));
    }
  }

  console.log('\n\n✅ DATABASE SUMMARY');
  console.log('Your database names/slugs are the source of truth and should not be changed.');
  console.log('Use the admin panel to edit pricing and service details only.');

  console.log('\n✅ Database check complete!\n');
}

checkDatabase().catch(console.error);
