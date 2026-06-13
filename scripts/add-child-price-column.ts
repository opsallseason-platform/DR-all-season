/**
 * ADD CHILD_PRICE COLUMN TO DATABASE
 * This script adds the child_price column to pricing_tiers table
 * 
 * Run with: npx tsx scripts/add-child-price-column.ts
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

async function addChildPriceColumn() {
  console.log('🔧 Adding child_price column to pricing_tiers table...\n');

  try {
    // Add the column using RPC (Remote Procedure Call)
    // Since Supabase JS client doesn't support ALTER TABLE directly,
    // we'll use the management API via fetch
    
    const serviceKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const projectUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    
    console.log('⚠️  The Supabase JS client cannot run ALTER TABLE commands.');
    console.log('    You need to add the column manually in the Supabase Dashboard.\n');
    
    console.log('📋 Steps to add child_price column:\n');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Paste this SQL:\n');
    console.log('--- COPY THIS SQL ---');
    console.log(`
ALTER TABLE pricing_tiers 
ADD COLUMN IF NOT EXISTS child_price NUMERIC(10, 2);

COMMENT ON COLUMN pricing_tiers.child_price 
IS 'Price per child (up to 12 years old). Typically 70% of adult price.';

UPDATE pricing_tiers 
SET child_price = ROUND(price_per_person * 0.7, 2)
WHERE child_price IS NULL;
    `);
    console.log('--- END SQL ---\n');
    console.log('6. Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)');
    console.log('7. Done! The column will be added with child prices calculated.\n');
    
    // Verify current state
    console.log('🔍 Checking current pricing_tiers structure...\n');
    const { data: pricing, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error checking pricing_tiers:', error.message);
    } else if (pricing && pricing.length > 0) {
      console.log('Current pricing tier structure:');
      console.log(JSON.stringify(pricing[0], null, 2));
      
      if ('child_price' in pricing[0]) {
        console.log('\n✅ child_price column already exists!');
      } else {
        console.log('\n⚠️  child_price column does NOT exist yet.');
        console.log('   Please follow the steps above to add it.');
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

addChildPriceColumn().catch(console.error);
