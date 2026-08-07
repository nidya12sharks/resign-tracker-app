# Resign Tracker

Aplikasi tracking proses clearance resign karyawan. HR membuat kasus resign baru,
sistem otomatis membuat 4 link unik (Approval Atasan, Clearance IT, Clearance Finance,
Clearance GA) yang bisa dibagikan ke masing-masing pihak — mereka update status sendiri
tanpa perlu login.

## Struktur Halaman

- `/` — Dashboard overview semua kasus resign (HR)
- `/new` — Form tambah kasus resign baru
- `/case/[id]` — Detail kasus + 4 link unik untuk dibagikan (HR)
- `/update/[token]` — Halaman publik untuk update status (dibuka oleh atasan/IT/Finance/GA)

## Menjalankan di Komputer Sendiri (Development)

1. Install dependencies:
   ```
   npm install
   ```
2. Siapkan database Postgres (lihat bagian "Setup Database" di bawah), lalu isi
   `.env.local` (copy dari `.env.example`) dengan connection string-nya:
   ```
   POSTGRES_URL="postgres://..."
   ```
3. Jalankan:
   ```
   npm run dev
   ```
4. Buka `http://localhost:3000`

## Deploy ke Vercel (Publik)

1. Push folder ini ke repository GitHub baru.
2. Buka [vercel.com](https://vercel.com), login pakai akun GitHub, lalu **Add New → Project**
   dan pilih repository ini.
3. Klik **Deploy** — Vercel otomatis mendeteksi ini project Next.js.
4. **Setup Database** (wajib, aplikasi ini butuh database untuk menyimpan data):
   - Di dashboard project Vercel, buka tab **Storage**
   - Klik **Create Database → Postgres** (biasanya via integrasi Neon)
   - Setelah dibuat, Vercel **otomatis mengisi** environment variable `POSTGRES_URL`
     untuk project ini — tidak perlu copy-paste manual
5. Redeploy project (Vercel biasanya minta redeploy sekali setelah database
   terhubung — tinggal klik **Redeploy** di tab Deployments)
6. Selesai! Buka link `namaproject.vercel.app` — dashboard akan otomatis membuat
   tabel yang dibutuhkan saat pertama kali diakses.

## Setup Database (kalau mau connect manual / development lokal)

Aplikasi ini pakai [`@vercel/postgres`](https://vercel.com/docs/storage/vercel-postgres),
yang bisa connect ke database Postgres manapun (Neon, Supabase, dll) selama kamu
punya connection string-nya. Tabel dibuat otomatis oleh aplikasi saat pertama kali
diakses — tidak perlu jalankan migration manual.

## Yang Sengaja Ditunda (Ship Early)

- Notifikasi otomatis (email/WA) saat status berubah — untuk sekarang, HR
  membagikan link secara manual lewat WA/email
- Polish visual tambahan (animasi, dsb) — fokus dulu ke fungsi utama: buat kasus,
  generate link, update status
