import { NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    await setSession();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
