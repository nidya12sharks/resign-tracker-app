import { loginAction } from './actions';

export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }) {
  const next = searchParams?.next || '/';
  const error = searchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="max-w-sm w-full bg-white border border-line rounded-2xl p-6">
        <p className="font-display text-2xl text-ink mb-1">Resign Tracker</p>
        <p className="text-sm text-steel mb-6">Masuk sebagai HR untuk mengakses dashboard.</p>

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600">Password salah, coba lagi.</p>
          )}
          <button
            type="submit"
            className="w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
