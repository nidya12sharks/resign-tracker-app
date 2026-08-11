'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyLogin, createSession } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth';

export async function loginAction(formData) {
  const password = formData.get('password');
  const next = formData.get('next') || '/';

  const ok = await verifyLogin(password);
  if (!ok) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const token = await createSession();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  redirect(next);
}
