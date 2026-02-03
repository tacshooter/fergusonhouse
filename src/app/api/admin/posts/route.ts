import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    const posts = await prisma.post.findMany({
      where: folderId ? { folderId } : {},
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, slug, content, folderId } = await request.json();
    
    if (!title || !slug || !content || !folderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.upsert({
      where: { slug },
      update: { title, content, folderId },
      create: { title, slug, content, folderId }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post API Error:", error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}
