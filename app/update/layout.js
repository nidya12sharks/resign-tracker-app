// Layout khusus untuk halaman /update/[token] — sengaja TIDAK ada header
// HR ("+ Kasus Baru", tombol Keluar, dsb) karena halaman ini diakses pihak
// eksternal (atasan/IT/Finance/GA) lewat link, bukan HR yang login.

export default function UpdateLayout({ children }) {
  return <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>;
}
