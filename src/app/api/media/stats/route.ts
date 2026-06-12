import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

function getLocalStats() {
  let totalImages = 0;
  let totalVideos = 0;
  let totalBytes = 0;

  const folders = ['past', 'upcoming', 'gallery'];
  for (const folder of folders) {
    const dirPath = path.join(process.cwd(), 'public', 'uploads', folder);
    if (fs.existsSync(dirPath)) {
      try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          if (file.startsWith('.')) continue;
          const ext = path.extname(file).toLowerCase();
          const isVideo = ['.mp4', '.mov', '.webm', '.avi', '.m4v'].includes(ext);
          if (isVideo) totalVideos++;
          else totalImages++;

          const stat = fs.statSync(path.join(dirPath, file));
          totalBytes += stat.size;
        }
      } catch (err) {
        console.error(`Error reading local stats for ${folder}:`, err);
      }
    }
  }

  return { totalImages, totalVideos, totalBytes };
}

export async function GET() {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const localStats = getLocalStats();
  const isCloudNameDisabled = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === 'dgd0puzlc';

  if (isCloudNameDisabled) {
    console.warn('Cloudinary account dgd0puzlc is disabled. Returning local stats only.');
    return NextResponse.json(localStats);
  }

  try {
    // api.resources doesn't give a total count directly, so we fetch all and count
    const [allImages, allVideos] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: 'wanjey/', resource_type: 'image', max_results: 500 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'wanjey/', resource_type: 'video', max_results: 500 }),
    ]);

    const cloudinaryBytes = [...allImages.resources, ...allVideos.resources].reduce((acc, curr) => acc + curr.bytes, 0);

    return NextResponse.json({
      totalImages: allImages.resources.length + localStats.totalImages,
      totalVideos: allVideos.resources.length + localStats.totalVideos,
      totalBytes: cloudinaryBytes + localStats.totalBytes,
    });
  } catch (error: any) {
    console.warn('Cloudinary Stats Error, returning local stats only:', error.message || error);
    return NextResponse.json(localStats);
  }
}
