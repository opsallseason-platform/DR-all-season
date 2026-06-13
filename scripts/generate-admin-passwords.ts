/**
 * Generate Bcrypt Password Hashes for Admin Users
 * 
 * Usage:
 * npx tsx scripts/generate-admin-passwords.ts
 * 
 * This will generate secure password hashes that you can insert into the database.
 */

import bcrypt from 'bcryptjs';

const passwords = [
  'YourPassword123!', // Replace with actual password for admin 1
  'YourPassword456!', // Replace with actual password for admin 2
  'YourPassword789!', // Replace with actual password for admin 3
];

async function generateHashes() {
  console.log('🔐 Generating Bcrypt Password Hashes...\n');

  for (let i = 0; i < passwords.length; i++) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(passwords[i], saltRounds);
    
    console.log(`Admin ${i + 1}:`);
    console.log(`  Password: ${passwords[i]}`);
    console.log(`  Hash: ${hash}\n`);
  }

  console.log('📝 Next Steps:');
  console.log('1. Copy the hashes above');
  console.log('2. Update the password_hash values in supabase/migrations/008_create_admin_users.sql');
  console.log('3. Run the migration in your Supabase database');
  console.log('4. You can now login with these credentials at /admin/login\n');
}

generateHashes();
