import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/utils/r2';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

  if (!r2Configured) {
    return NextResponse.json({ error: 'Storage provider not configured' }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await r2Client.send(command);
    if (!response.Body) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Convert S3 Body stream to array buffer bytes
    const bytes = await response.Body.transformToByteArray();
    const blob = new Blob([bytes as any]);

    return new Response(blob, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('R2 download proxy error:', error);
    return NextResponse.json({ error: 'Failed to retrieve asset from R2' }, { status: 404 });
  }
}
