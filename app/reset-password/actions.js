'use server';

import { redirect } from 'next/navigation';
import { resetPasswordWithToken } from '@/lib/db';

export async function resetPasswordAction(formData) {
  const token = formData.get('token');
  const password = formData.get('password');
  const confirm = formData.get('confirm');

  if (password !== confirm) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&error=mismatch`);
  }

  const result = await resetPasswordWithToken(token, password);
  if (!result.success) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&error=invalid`);
  }

  redirect('/login?reset=1');
}
