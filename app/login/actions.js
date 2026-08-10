'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hashPassword, SESSION_COOKIE } from '@/lib/auth';

export async function loginAction(formData) {
  const password = formData.get('password');
  const next = formData.get('next') || '/';

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const token = await hashPassword(process.env.ADMIN_PASSWORD);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 hari
    path: '/',
  });

  redirect(next);
}
