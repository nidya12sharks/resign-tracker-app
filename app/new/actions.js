'use server';

import { createCase } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function createCaseAction(formData) {
  const namaKaryawan = formData.get('nama_karyawan');
  const posisi = formData.get('posisi');
  const tanggalPengajuan = formData.get('tanggal_pengajuan');
  const tanggalEfektif = formData.get('tanggal_efektif');

  if (!namaKaryawan || !posisi || !tanggalPengajuan || !tanggalEfektif) {
    throw new Error('Semua field wajib diisi');
  }

  const caseId = await createCase({
    namaKaryawan,
    posisi,
    tanggalPengajuan,
    tanggalEfektif,
  });

  redirect(`/case/${caseId}`);
}
