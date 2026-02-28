import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Using absolute path based on the known environment
const HIERARCHY_CACHE_PATH = '/home/ubuntu/.openclaw/workspace/fergusonhouse/public/hierarchy.json';

export async function GET() {
  try {
    if (fs.existsSync(HIERARCHY_CACHE_PATH)) {
      const data = fs.readFileSync(HIERARCHY_CACHE_PATH, 'utf-8');
      return NextResponse.json(JSON.parse(data), {
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
          'X-Cache-Status': 'HIT'
        },
      });
    }

    const folders = await rebuildHierarchyCache();
    return NextResponse.json(folders, {
      headers: { 'X-Cache-Status': 'MISS' }
    });
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
    
    await rebuildHierarchyCache();
    
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}

async function rebuildHierarchyCache() {
  const folders = await prisma.folder.findMany({
    include: { 
      children: {
        include: { 
          children: true,
          posts: {
            select: { id: true, title: true, slug: true, published: true }
          }
        }
      },
      posts: {
        select: { id: true, title: true, slug: true, published: true }
      }
    },
    where: { parentId: null }
  });

  try {
    fs.writeFileSync(HIERARCHY_CACHE_PATH, JSON.stringify(folders));
  } catch (e) {
    console.error("Failed to write hierarchy cache file:", e);
  }
  return folders;
}
