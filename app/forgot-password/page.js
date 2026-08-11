import { requestResetAction } from './actions';

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage({ searchParams }) {
  const sent = searchParams?.sent;
  const error = searchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="max-w-sm w-full bg-white border border-line rounded-2xl p-6">
        <p className="font-display text-2xl text-ink mb-1">Lupa Password</p>
        <p className="text-sm text-steel mb-6">
          Link reset password akan dikirim ke email HR yang terdaftar di pengaturan akun.
        </p>

        {sent ? (
          <div className="text-sm text-ink bg-brass/10 border border-brass/30 rounded-lg p-3">
            Link reset sudah dikirim. Cek inbox (atau folder spam) di email yang terdaftar ya.
          </div>
        ) : (
          <form action={requestResetAction} className="space-y-4">
            {error === 'noemail' && (
              <p className="text-xs text-red-600">
                Belum ada email yang terdaftar untuk akun ini. Minta HR yang masih bisa login
                untuk mengisi email di halaman Pengaturan Akun dulu.
              </p>
            )}
            {error === 'sendfail' && (
              <p className="text-xs text-red-600">
                Gagal mengirim email. Kemungkinan konfigurasi layanan email (Resend) belum
                benar — hubungi yang mengelola aplikasi ini.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
            >
              Kirim Link Reset
            </button>
          </form>
        )}

        <a href="/login" className="block text-center text-xs text-steel hover:text-ink mt-4">
          Kembali ke login
        </a>
      </div>
    </div>
  );
}
