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
    // Fetch both images and videos from the specified folder
    const result = await cloudinary.search
      .expression(`folder:wanjey/${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const media = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      type: resource.resource_type, // 'image' or 'video'
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at
    }));

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Cloudinary API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
