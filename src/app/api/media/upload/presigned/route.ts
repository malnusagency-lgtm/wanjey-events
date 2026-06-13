import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from '@/utils/r2';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

export async function POST(request: Request) {
  // Check authorization
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { filename, folder, contentType } = body;

    if (!filename || !folder) {
      return NextResponse.json({ error: 'Filename and folder parameters are required' }, { status: 400 });
    }

    const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
    if (!r2Configured) {
      return NextResponse.json({ error: 'Cloudflare R2 is not configured.' }, { status: 500 });
    }

    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanName = `${baseName}${ext}`;
    const key = `wanjey/${folder}/${cleanName}`;

    // Create S3 command
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
    });

    // Generate Presigned URL (valid for 15 minutes / 900 seconds)
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
    const url = `${cleanDomain}/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      url,
    });
  } catch (error: any) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate upload URL' }, { status: 500 });
  }
}
