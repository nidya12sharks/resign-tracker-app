import { getAdminEmail } from '@/lib/db';
import { changePasswordAction, changeEmailAction } from './actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function SettingsPage({ searchParams }) {
  const email = await getAdminEmail();
  const pwError = searchParams?.pwerror;
  const pwSuccess = searchParams?.pwsuccess;
  const emailSuccess = searchParams?.emailsuccess;

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <p className="font-display text-3xl text-ink mb-1">Pengaturan Akun</p>
        <p className="text-sm text-steel">
          Ubah password login, atau atur email tujuan kalau suatu saat perlu reset password.
        </p>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <p className="text-sm font-medium text-ink mb-1">Email untuk Reset Password</p>
        <p className="text-xs text-steel mb-4">
          Kalau password lupa, link reset akan dikirim ke email ini lewat halaman "Lupa
          Password" di layar login.
        </p>
        <form action={changeEmailAction} className="flex gap-2">
          <input
            type="email"
            name="email"
            defaultValue={email || ''}
            required
            placeholder="hc@perusahaan.com"
            className="flex-1 border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
          <button
            type="submit"
            className="bg-ink text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Simpan
          </button>
        </form>
        {emailSuccess && <p className="text-xs text-brass mt-2">Email tersimpan.</p>}
      </div>

      <div className="bg-white border border-line rounded-2xl p-6">
        <p className="text-sm font-medium text-ink mb-4">Ubah Password</p>
        <form action={changePasswordAction} className="space-y-3">
          <input
            type="password"
            name="current"
            required
            placeholder="Password saat ini"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
          <input
            type="password"
            name="new_password"
            required
            minLength={6}
            placeholder="Password baru"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
          <input
            type="password"
            name="confirm"
            required
            minLength={6}
            placeholder="Ulangi password baru"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
          />
          {pwError === 'mismatch' && (
            <p className="text-xs text-red-600">Password baru tidak sama.</p>
          )}
          {pwError === 'wrong' && (
            <p className="text-xs text-red-600">Password saat ini salah.</p>
          )}
          {pwSuccess && (
            <p className="text-xs text-brass">Password berhasil diubah.</p>
          )}
          <button
            type="submit"
            className="w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Ubah Password
          </button>
        </form>
        <p className="text-xs text-steel mt-3">
          Setelah password diubah, semua sesi login (termasuk di perangkat lain) akan otomatis
          keluar dan perlu login ulang pakai password baru.
        </p>
      </div>
    </div>
  );
}
