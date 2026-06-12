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

function deleteLocalFile(publicId: string) {
  if (publicId.startsWith('local/')) {
    const parts = publicId.split('/'); // ['local', folder, filename]
    if (parts.length === 3) {
      const [_, folder, filename] = parts;
      const filePath = path.join(process.cwd(), 'public', 'uploads', folder, filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return true;
        }
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }
  }
  return false;
}

export async function POST(request: Request) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { public_id, resource_type, items } = body;

    // Handle bulk delete
    if (items && Array.isArray(items)) {
      const results = await Promise.all(
        items.map(async (item: { public_id: string; resource_type: string }) => {
          if (item.public_id.startsWith('local/')) {
            const success = deleteLocalFile(item.public_id);
            return { result: success ? 'ok' : 'not found', public_id: item.public_id };
          } else {
            return cloudinary.uploader.destroy(item.public_id, {
              resource_type: item.resource_type || 'image',
            });
          }
        })
      );
      return NextResponse.json({ success: true, results });
    }

    // Handle single delete
    if (!public_id) {
      return NextResponse.json({ error: 'public_id or items is required' }, { status: 400 });
    }

    if (public_id.startsWith('local/')) {
      const success = deleteLocalFile(public_id);
      return NextResponse.json({ success: true, result: success ? 'deleted' : 'not_found' });
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
