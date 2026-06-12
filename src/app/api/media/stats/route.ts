import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
import path from 'path';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/utils/r2';

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

  const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

  if (!r2Configured) {
    return NextResponse.json(localStats);
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: 'wanjey/',
    });

    const response = await r2Client.send(command);
    const contents = response.Contents || [];

    let r2Images = 0;
    let r2Videos = 0;
    let r2Bytes = 0;

    for (const item of contents) {
      if (!item.Key) continue;
      const ext = path.extname(item.Key).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.webm', '.avi', '.m4v'].includes(ext);
      if (isVideo) r2Videos++;
      else r2Images++;

      r2Bytes += item.Size || 0;
    }

    return NextResponse.json({
      totalImages: r2Images + localStats.totalImages,
      totalVideos: r2Videos + localStats.totalVideos,
      totalBytes: r2Bytes + localStats.totalBytes,
    });
  } catch (error: any) {
    console.warn('R2 Stats Error, returning local stats only:', error.message || error);
    return NextResponse.json(localStats);
  }
}
