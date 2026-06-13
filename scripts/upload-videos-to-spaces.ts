/**
 * UPLOAD VIDEOS TO DIGITALOCEAN SPACES
 * Uploads background videos from public/images/videos to your Spaces bucket
 */

import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';

const spacesClient = new S3({
  endpoint: 'https://sfo3.digitaloceanspaces.com',
  region: 'sfo3',
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY || '',
  },
});

const bucketName = process.env.DO_SPACES_BUCKET || 'tourplatform-bg-videos';
const videosDir = path.join(process.cwd(), 'public/images/videos');

const videos = [
  'home-bg.mov',
  'tours-bg.mov',
  'transfers-bg.mov',
  'bg-about.mov',
  'bg-contact.mov',
];

async function uploadVideo(filename: string) {
  const filePath = path.join(videosDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} not found, skipping...`);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const fileSize = fs.statSync(filePath).size;
  
  console.log(`📤 Uploading ${filename} (${(fileSize / 1024 / 1024).toFixed(2)} MB)...`);

  try {
    const upload = new Upload({
      client: spacesClient,
      params: {
        Bucket: bucketName,
        Key: filename,
        Body: fileStream,
        ContentType: 'video/quicktime',
        // Note: DigitalOcean Spaces doesn't support ACL - make bucket public in settings
      },
    });

    await upload.done();
    
    const videoUrl = `${process.env.DO_SPACES_CDN_URL || process.env.DO_SPACES_ENDPOINT}/${filename}`;
    console.log(`✅ ${filename} uploaded successfully!`);
    console.log(`   URL: ${videoUrl}\n`);
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error);
  }
}

async function main() {
  console.log('🚀 Starting video uploads to DigitalOcean Spaces...\n');
  console.log(`Bucket: ${bucketName}`);
  console.log(`Region: ${process.env.DO_SPACES_REGION}\n`);

  for (const video of videos) {
    await uploadVideo(video);
  }

  console.log('\n🎉 All uploads complete!');
  console.log('\nNext steps:');
  console.log('1. Update your components to use CDN URLs');
  console.log('2. Test video playback on your site');
}

main().catch(console.error);
