'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteCase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE } from '@/lib/auth';

export async function deleteCaseAction(id) {
  await deleteCase(id);
  revalidatePath('/');
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE);
  redirect('/login');
}
