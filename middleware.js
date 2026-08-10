import { NextResponse } from 'next/server';
import { SESSION_COOKIE, hashPassword } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Halaman ini selalu boleh diakses tanpa login:
  // - /update/[token] -> diakses pihak terkait (atasan/IT/dst) lewat link unik
  // - /login -> halaman login itu sendiri
  if (pathname.startsWith('/update/') || pathname === '/login') {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;

  // Kalau ADMIN_PASSWORD belum diset di environment variable, jangan kunci
  // semua orang keluar (supaya gak lockout total pas awal setup) — biarkan
  // dashboard tetap bisa diakses sampai passwordnya di-set.
  if (!password) {
    return NextResponse.next();
  }

  const expected = await hashPassword(password);
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (cookie !== expected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
