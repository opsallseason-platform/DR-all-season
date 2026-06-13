/**
 * UPLOAD VIDEOS TO DIGITALOCEAN SPACES - SIMPLE VERSION
 */

import { config } from 'dotenv';
import { S3 } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const spacesClient = new S3({
  endpoint: 'https://sfo3.digitaloceanspaces.com',
  region: 'sfo3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY || '',
  },
});

const bucketName = 'tourplatform-bg-videos';

async function uploadVideo(filename: string, videosDir: string) {
  const filePath = path.join(videosDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} not found, skipping...`);
    return;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2);
  
  console.log(`📤 Uploading ${filename} (${fileSize} MB)...`);

  try {
    await spacesClient.putObject({
      Bucket: bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: 'video/mp4',
    });
    
    const videoUrl = `https://tourplatform-bg-videos.sfo3.cdn.digitaloceanspaces.com/${filename}`;
    console.log(`✅ ${filename} uploaded successfully!`);
    console.log(`   URL: ${videoUrl}\n`);
  } catch (error: any) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    console.error(`   Error code: ${error.Code || error.code}`);
    if (error.$metadata) {
      console.error(`   HTTP Status: ${error.$metadata.httpStatusCode}`);
    }
    console.log();
  }
}

async function main() {
  const videos = [
    'home-bg.mp4',
    'tours-bg.mp4', 
    'transfers-bg.mp4',
    'bg-about.mp4',
    'bg-contact.mp4',
  ];

  const videosDir = path.join(process.cwd(), 'public/images/videos/compressed');

  console.log('🚀 Starting video uploads to DigitalOcean Spaces...\n');
  console.log(`Bucket: ${bucketName}\n`);

  for (const video of videos) {
    await uploadVideo(video, videosDir);
  }

  console.log('\n✅ Upload process complete!');
}

main().catch(console.error);
