import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
