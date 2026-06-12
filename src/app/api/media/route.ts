import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from '@/utils/r2';

export const dynamic = 'force-dynamic';

function getLocalMedia(folder: string) {
  const dirPath = path.join(process.cwd(), 'public', 'uploads', folder);
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  try {
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => !file.startsWith('.')) // ignore hidden files
      .map(file => {
        const url = `/uploads/${folder}/${file}`;
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.webm', '.avi', '.m4v'].includes(ext);
        const stat = fs.statSync(path.join(dirPath, file));
        return {
          id: `local/${folder}/${file}`,
          url: url,
          type: isVideo ? 'video' : 'image',
          width: 1200,
          height: 800,
          created_at: stat.mtime.toISOString(),
        };
      });
  } catch (err) {
    console.error('Error reading local directory:', err);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');

  if (!folder) {
    return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
  }

  // Always collect local media
  const localMedia = getLocalMedia(folder);

  const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

  if (!r2Configured) {
    // Fall back to local media if R2 is not configured
    const media = localMedia.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({
      media,
      r2_disabled: true,
      cloudinary_disabled: true, // Cloudinary is retired
    });
  }

  try {
    const prefix = `wanjey/${folder}/`;
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await r2Client.send(command);
    const r2Media = (response.Contents || [])
      .filter(item => item.Key && item.Key !== prefix) // filter out prefix folder placeholder itself
      .map(item => {
        const key = item.Key!;
        const ext = path.extname(key).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.webm', '.avi', '.m4v'].includes(ext);
        
        // Construct R2 public URL
        const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
        const url = `${cleanDomain}/${key}`;

        return {
          id: key,
          url: url,
          type: isVideo ? 'video' : 'image',
          width: 1200,
          height: 800,
          created_at: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString(),
        };
      });

    const media = [...r2Media, ...localMedia].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      media,
      r2_disabled: false,
      cloudinary_disabled: true,
    });
  } catch (error: any) {
    console.error('Cloudflare R2 listing error, falling back to local files:', error.message || error);
    const media = localMedia.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({
      media,
      r2_disabled: false, // Keep R2 mode active for client UI feedback
      cloudinary_disabled: true,
      error_message: error.message || String(error)
    });
  }
}
