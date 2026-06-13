import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
import path from 'path';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/utils/r2';

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

async function deleteR2File(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch (err) {
    console.error(`Error deleting R2 key ${key}:`, err);
    return false;
  }
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

  const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

  if (!r2Configured) {
    return NextResponse.json(
      { error: 'Cloudflare R2 is not configured. Please set the R2 environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { public_id, items } = body;

    // Handle bulk delete
    if (items && Array.isArray(items)) {
      const results = await Promise.all(
        items.map(async (item: { public_id: string }) => {
          if (item.public_id.startsWith('local/')) {
            const success = deleteLocalFile(item.public_id);
            return { result: success ? 'ok' : 'not found', public_id: item.public_id };
          } else if (r2Configured) {
            const success = await deleteR2File(item.public_id);
            return { result: success ? 'ok' : 'error', public_id: item.public_id };
          }
          return { result: 'skipped (unsupported)', public_id: item.public_id };
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

    if (r2Configured) {
      const success = await deleteR2File(public_id);
      return NextResponse.json({ success: true, result: success ? 'deleted' : 'error' });
    }

    return NextResponse.json({ error: 'Storage provider not configured for deletion' }, { status: 400 });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete media' }, { status: 500 });
  }
}
