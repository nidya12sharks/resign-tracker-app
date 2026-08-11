import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { validateSession } from '@/lib/db';

const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/update/') || PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let valid = false;
  try {
    valid = await validateSession(token);
  } catch (err) {
    console.error('Gagal validasi sesi:', err);
  }

  if (!valid) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
