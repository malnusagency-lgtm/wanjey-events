import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');

  if (!folder) {
    return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
  }

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

    const media = [
      ...imageResult.resources.map((r: any) => mapResource(r, 'image')),
      ...videoResult.resources.map((r: any) => mapResource(r, 'video')),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Cloudinary API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

