import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
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

    // Ensure the directory exists
    const dirPath = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.name) continue;

      // Clean filename to make it URL-safe and prevent traversal
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanName = `${baseName}${ext}`;
      
      const filePath = path.join(dirPath, cleanName);

      // Write file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      uploadedFiles.push({
        id: `local/${folder}/${cleanName}`,
        name: cleanName,
        url: `/uploads/${folder}/${cleanName}`,
      });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Local upload API error:', error);
    return NextResponse.json({ error: 'Failed to upload files locally' }, { status: 500 });
  }
}
