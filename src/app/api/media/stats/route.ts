import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const revalidate = 60; // Cache for 60 seconds

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
    // Get total counts across our specific folders
    const [imagesResult, videosResult] = await Promise.all([
      cloudinary.search
        .expression('folder:wanjey/* AND resource_type:image')
        .max_results(1)
        .execute(),
      cloudinary.search
        .expression('folder:wanjey/* AND resource_type:video')
        .max_results(1)
        .execute()
    ]);

    return NextResponse.json({
      totalImages: imagesResult.total_count,
      totalVideos: videosResult.total_count,
    });
  } catch (error) {
    console.error('Cloudinary Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
