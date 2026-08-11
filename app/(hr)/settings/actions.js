'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { changePassword, changeEmail } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth';

export async function changeEmailAction(formData) {
  const email = formData.get('email');
  await changeEmail(email);
  redirect('/settings?emailsuccess=1');
}

export async function changePasswordAction(formData) {
  const current = formData.get('current');
  const newPassword = formData.get('new_password');
  const confirm = formData.get('confirm');

  if (newPassword !== confirm) {
    redirect('/settings?pwerror=mismatch');
  }

  const result = await changePassword(current, newPassword);
  if (!result.success) {
    redirect('/settings?pwerror=wrong');
  }

  // Password berubah -> semua sesi login (termasuk punya kita sekarang)
  // otomatis diinvalidate. Hapus cookie lokal juga, lalu minta login ulang.
  cookies().delete(SESSION_COOKIE);
  redirect('/login?reset=1');
}
