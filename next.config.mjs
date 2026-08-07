/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Matikan client-side router cache untuk halaman dinamis, supaya data
    // selalu ke-fetch ulang dari database tiap kali pindah halaman via link,
    // bukan pakai versi lama yang sempat ke-cache di browser.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
