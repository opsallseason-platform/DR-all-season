/**
 * TEST DIGITALOCEAN SPACES CONNECTION
 */

import { config } from 'dotenv';
import { S3, ListBucketsCommand } from '@aws-sdk/client-s3';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const spacesClient = new S3({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY || '',
  },
});

async function testConnection() {
  console.log('🔍 Testing DigitalOcean Spaces connection...\n');
  console.log('Access Key:', process.env.DO_SPACES_ACCESS_KEY?.substring(0, 8) + '...');
  console.log('Secret Key:', process.env.DO_SPACES_SECRET_KEY ? '✓ Set' : '✗ Missing');
  console.log();

  try {
    const command = new ListBucketsCommand({});
    const response = await spacesClient.send(command);
    
    console.log('✅ Connection successful!');
    console.log('\nYour buckets:');
    response.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (created: ${bucket.CreationDate})`);
    });
  } catch (error: any) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.Code || error.code);
    console.error('HTTP Status:', error.$metadata?.httpStatusCode);
  }
}

testConnection().catch(console.error);
