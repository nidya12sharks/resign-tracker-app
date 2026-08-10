import { Fraunces, Inter } from 'next/font/google';
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
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
