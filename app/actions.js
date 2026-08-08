'use server';

import { deleteCase } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteCaseAction(id) {
  await deleteCase(id);
  revalidatePath('/');
}
