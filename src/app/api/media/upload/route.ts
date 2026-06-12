import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from '@/utils/r2';
import path from 'path';

export async function POST(request: Request) {
  // Check authorization
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const folder = formData.get('folder') as string;
    const files = formData.getAll('files') as File[];

    if (!folder) {
      return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const r2Configured = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

    // If R2 is not configured, fall back to local disk storage
    if (!r2Configured) {
      const fs = require('fs');
      const dirPath = path.join(process.cwd(), 'public', 'uploads', folder);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const uploadedFiles = [];
      for (const file of files) {
        if (!file.name) continue;
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const cleanName = `${baseName}${ext}`;
        const filePath = path.join(dirPath, cleanName);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        uploadedFiles.push({
          id: `local/${folder}/${cleanName}`,
          name: cleanName,
          url: `/uploads/${folder}/${cleanName}`,
        });
      }
      return NextResponse.json({ success: true, files: uploadedFiles });
    }

    // Otherwise, upload to Cloudflare R2!
    const uploadedFiles = [];
    for (const file of files) {
      if (!file.name) continue;

      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanName = `${baseName}${ext}`;
      const key = `wanjey/${folder}/${cleanName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      // Send PutObject command to R2
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      });

      await r2Client.send(command);

      const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
      const url = `${cleanDomain}/${key}`;

      uploadedFiles.push({
        id: key,
        name: cleanName,
        url: url,
      });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload files' }, { status: 500 });
  }
}
