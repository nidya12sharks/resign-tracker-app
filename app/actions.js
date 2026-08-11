'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteCase, deleteSession } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE } from '@/lib/auth';

export async function deleteCaseAction(id) {
  await deleteCase(id);
  revalidatePath('/');
}

export async function logoutAction() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  await deleteSession(token);
  cookies().delete(SESSION_COOKIE);
  redirect('/login');
}
