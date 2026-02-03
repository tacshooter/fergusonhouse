import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let folders = await prisma.folder.findMany({
      include: { 
        children: {
          include: { children: true }
        } 
      },
      where: { parentId: null }
    });

    // Auto-seed if empty
    if (folders.length === 0) {
      await prisma.folder.create({
        data: {
          name: 'blog',
          children: {
            create: [
              { name: 'projects' },
              { name: 'conventions' },
              { name: 'automated-code-gen' },
            ]
          }
        }
      });
      
      folders = await prisma.folder.findMany({
        include: { 
          children: {
            include: { children: true }
          } 
        },
        where: { parentId: null }
      });
    }

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Folder API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
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
    console.error(error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
