import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
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
    const body = await request.json();
    const { public_id, resource_type, items } = body;

    if (items && Array.isArray(items)) {
      const results = await Promise.all(
        items.map(async (item: { public_id: string; resource_type: string }) => {
          return cloudinary.uploader.destroy(item.public_id, {
            resource_type: item.resource_type || 'image',
          });
        })
      );
      return NextResponse.json({ success: true, results });
    }

    if (!public_id) {
      return NextResponse.json({ error: 'public_id or items is required' }, { status: 400 });
    }

    // Cloudinary destroy method requires resource_type for videos
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || 'image',
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
