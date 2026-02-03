import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      include: { 
        children: {
          include: { 
            children: true,
            posts: true
          }
        },
        posts: true
      },
      where: { parentId: null }
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Folder/Post API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch hierarchy' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, parentId } = await request.json();
    const folder = await prisma.folder.create({
      data: { name, parentId: parentId || null }
    });
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
