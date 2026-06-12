import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

  try {
    // Fetch images and videos separately using api.resources (works on all Cloudinary plans)
    const [imageResult, videoResult] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        prefix: `wanjey/${folder}/`,
        resource_type: 'image',
        max_results: 100,
      }),
      cloudinary.api.resources({
        type: 'upload',
        prefix: `wanjey/${folder}/`,
        resource_type: 'video',
        max_results: 100,
      }),
    ]);

    const mapResource = (resource: any, type: string) => ({
      id: resource.public_id,
      url: resource.secure_url,
      type,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
    });

    const cloudinaryMedia = [
      ...imageResult.resources.map((r: any) => mapResource(r, 'image')),
      ...videoResult.resources.map((r: any) => mapResource(r, 'video')),
    ];

    const media = [...cloudinaryMedia, ...localMedia].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ media, cloudinary_disabled: false });
  } catch (error: any) {
    // If Cloudinary fails (e.g. disabled customer), fall back to local media
    console.warn('Cloudinary API Error, falling back to local files:', error.message || error);
    const media = localMedia.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({ media, cloudinary_disabled: true });
  }
}

