import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MEDIA_DIR = path.resolve('..', '..', 'bigvoice', 'bigvoice 2');
const OUTPUT_FILE = path.resolve('scripts', 'uploaded_media.json');

async function uploadMedia() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Error: BLOB_READ_WRITE_TOKEN is missing in .env.local');
    process.exit(1);
  }

  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`Error: Media directory not found at ${MEDIA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MEDIA_DIR).filter(file => {
    return file.endsWith('.mp4') || file.endsWith('.jpg') || file.endsWith('.jpeg');
  });

  console.log(`Found ${files.length} files to upload from ${MEDIA_DIR}`);

  const uploadedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(MEDIA_DIR, file);
    const blobName = `bigvoices/${file}`;

    console.log(`[${i + 1}/${files.length}] Uploading ${file}...`);
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const blob = await put(blobName, fileBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      console.log(`✅ Uploaded: ${blob.url}`);
      
      uploadedFiles.push({
        originalName: file,
        type: file.endsWith('.mp4') ? 'video' : 'image',
        url: blob.url
      });
      
      // Save progress
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uploadedFiles, null, 2));
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }

  console.log(`\n🎉 Upload complete! Results saved to ${OUTPUT_FILE}`);
}

uploadMedia();
