import Link from 'next/link';
import { logoutAction } from '@/app/actions';

export default function HrLayout({ children }) {
  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-tight text-ink">
            Resign Tracker
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/new"
              className="text-sm font-medium px-4 py-2 rounded-full bg-ink text-white hover:opacity-90 transition"
            >
              + Kasus Baru
            </Link>
            <Link href="/settings" className="text-sm text-steel hover:text-ink transition">
              Pengaturan
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-steel hover:text-ink transition">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
