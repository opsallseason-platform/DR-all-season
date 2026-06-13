import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Sanitize filename: lowercase, replace spaces with underscores, keep extension
    const originalName = file.name.replace(/\s+/g, '_').toLowerCase();
    const ext = originalName.split('.').pop() || 'png';
    const baseName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/g, '');
    const fileName = `${baseName}_${Date.now()}.${ext}`;

    // Save to public/images/excursions/
    const uploadDir = join(process.cwd(), 'public', 'images', 'excursions');
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const publicUrl = `/images/excursions/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
