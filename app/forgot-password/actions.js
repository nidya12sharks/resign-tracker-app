'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createResetToken } from '@/lib/db';
import { sendResetEmail } from '@/lib/email';

export async function requestResetAction() {
  const result = await createResetToken();
  if (!result) {
    redirect('/forgot-password?error=noemail');
  }

  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const resetUrl = `${protocol}://${host}/reset-password?token=${result.token}`;

  try {
    await sendResetEmail(result.email, resetUrl);
  } catch (err) {
    console.error('Gagal kirim email reset:', err);
    redirect('/forgot-password?error=sendfail');
  }

  redirect('/forgot-password?sent=1');
}
