'use server';

import { createCase } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function createCaseAction(formData) {
  const namaKaryawan = formData.get('nama_karyawan');
  const nip = formData.get('nip');
  const jabatan = formData.get('jabatan');
  const unitKerja = formData.get('unit_kerja');
  const tanggalPengajuan = formData.get('tanggal_pengajuan');
  const tanggalMasuk = formData.get('tanggal_masuk');
  const tanggalEfektif = formData.get('tanggal_efektif');

  if (!namaKaryawan || !jabatan || !tanggalPengajuan || !tanggalEfektif) {
    throw new Error('Nama, jabatan, tanggal pengajuan, dan tanggal keluar wajib diisi');
  }

  const caseId = await createCase({
    namaKaryawan,
    nip,
    jabatan,
    unitKerja,
    tanggalPengajuan,
    tanggalMasuk,
    tanggalEfektif,
  });

  redirect(`/case/${caseId}`);
}
