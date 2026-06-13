/**
 * Script to create a new admin user
 * Run with: npx tsx scripts/create-admin-user.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = 'osisolis@hotmail.com';
  const password = 'Admin123!';
  const fullName = 'Admin User';
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user in admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          id: randomUUID(),
          email,
          password_hash: hashedPassword,
          full_name: fullName,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('User ID:', data[0].id);
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
