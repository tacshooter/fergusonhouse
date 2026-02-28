import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const page = await prisma.staticPage.findUnique({
        where: { id }
      });
      return NextResponse.json(page);
    }

    const pages = await prisma.staticPage.findMany();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch static pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, title, subtitle, content } = await request.json();
    
    if (!id || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const page = await prisma.staticPage.upsert({
      where: { id },
      update: { title, subtitle: subtitle || "", content },
      create: { id, title, subtitle: subtitle || "", content }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Static Page API Error:", error);
    return NextResponse.json({ error: 'Failed to save static page' }, { status: 500 });
  }
}
