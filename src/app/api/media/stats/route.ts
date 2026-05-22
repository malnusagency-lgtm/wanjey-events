import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

export async function GET() {
  // Check authentication
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use api.resources which works on all Cloudinary plans (including free)
    const [imagesResult, videosResult] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: 'wanjey/', resource_type: 'image', max_results: 1 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'wanjey/', resource_type: 'video', max_results: 1 }),
    ]);

    // api.resources doesn't give a total count directly, so we fetch all and count
    const [allImages, allVideos] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: 'wanjey/', resource_type: 'image', max_results: 500 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'wanjey/', resource_type: 'video', max_results: 500 }),
    ]);

    const totalBytes = [...allImages.resources, ...allVideos.resources].reduce((acc, curr) => acc + curr.bytes, 0);

    return NextResponse.json({
      totalImages: allImages.resources.length,
      totalVideos: allVideos.resources.length,
      totalBytes: totalBytes,
    });
  } catch (error) {
    console.error('Cloudinary Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
