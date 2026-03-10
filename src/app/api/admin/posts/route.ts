import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const HIERARCHY_CACHE_PATH = '/home/ssm-user/.openclaw/workspace/fergusonhouse/public/hierarchy.json';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await prisma.post.findUnique({
        where: { slug }
      });
      return NextResponse.json(post);
    }

    const posts = await prisma.post.findMany({
      include: { folder: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, slug, content, folderId, id } = await request.json();
    
    if (!title || !slug || !content || !folderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.upsert({
      where: { id: id || 'new-id' },
      update: { title, slug, content, folderId },
      create: { title, slug, content, folderId }
    });

    await rebuildHierarchyCache();

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post API Error:", error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id }
    });

    await rebuildHierarchyCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
