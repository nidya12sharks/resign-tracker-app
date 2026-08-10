'use server';

import { updateClearanceItems } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateClearanceAction(token, itemIds, formData) {
  const items = itemIds.map((id) => ({
    id,
    checked: formData.get(`checked_${id}`) === 'on',
    keterangan: formData.get(`ket_${id}`),
  }));

  await updateClearanceItems(token, items);
  revalidatePath(`/update/${token}`);
  revalidatePath('/');
}
