import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Resign Tracker',
  description: 'Tracking proses clearance resign karyawan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans min-h-screen">
        <header className="border-b border-line bg-white">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-display text-xl tracking-tight text-ink">
              Resign Tracker
            </Link>
            <Link
              href="/new"
              className="text-sm font-medium px-4 py-2 rounded-full bg-ink text-white hover:opacity-90 transition"
            >
              + Kasus Baru
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
