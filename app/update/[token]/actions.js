'use server';

import { updateClearanceByToken } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateClearanceAction(token, formData) {
  const catatan = formData.get('catatan');
  await updateClearanceByToken(token, catatan);
  revalidatePath(`/update/${token}`);
}
