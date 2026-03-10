import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get the start of the current week (Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const schedule = await prisma.blogSchedule.findMany({
      where: {
        date: {
          gte: startOfWeek,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, topic, slug, status, week_no } = body;

    const newEntry = await prisma.blogSchedule.create({
      data: {
        date: new Date(date),
        topic,
        slug,
        status: status || 'PENDING',
        week_no,
      },
    });

    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Failed to create schedule entry:', error);
    return NextResponse.json({ error: 'Failed to create schedule entry' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updatedEntry = await prisma.blogSchedule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Failed to update schedule entry:', error);
    return NextResponse.json({ error: 'Failed to update schedule entry' }, { status: 500 });
  }
}
