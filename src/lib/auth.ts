import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

export async function setSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, 'valid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === 'valid';
}
