import { resetPasswordAction } from './actions';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token || '';
  const error = searchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="max-w-sm w-full bg-white border border-line rounded-2xl p-6">
        <p className="font-display text-2xl text-ink mb-1">Buat Password Baru</p>
        <p className="text-sm text-steel mb-6">Masukkan password baru untuk akun HR.</p>

        <form action={resetPasswordAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Password Baru</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Ulangi Password Baru
            </label>
            <input
              type="password"
              name="confirm"
              required
              minLength={6}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          {error === 'mismatch' && (
            <p className="text-xs text-red-600">Password baru tidak sama.</p>
          )}
          {error === 'invalid' && (
            <p className="text-xs text-red-600">
              Link tidak valid atau sudah kedaluwarsa. Minta link reset baru.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Simpan Password Baru
          </button>
        </form>
      </div>
    </div>
  );
}
