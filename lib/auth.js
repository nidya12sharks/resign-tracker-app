// Helper autentikasi. Password admin disimpan (dalam bentuk hash) di
// database supaya bisa diganti sendiri oleh pengguna lewat halaman
// "Ganti Password" — tidak perlu ubah environment variable tiap kali ganti.
//
// SESSION_SECRET dipakai untuk menandatangani cookie sesi login, terpisah
// dari password itu sendiri, supaya Middleware (yang jalan di Edge Runtime,
// tidak bisa akses database) tetap bisa memverifikasi sesi tanpa query DB.

export const SESSION_COOKIE = 'hr_session';

async function hmac(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password) {
  const pepper = process.env.SESSION_SECRET || '';
  const enc = new TextEncoder().encode(password + pepper);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken() {
  const payload = 'hr-authenticated';
  const sig = await hmac(process.env.SESSION_SECRET || '', payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token) {
  if (!token || !process.env.SESSION_SECRET) return false;
  const [payload, sig] = token.split('.');
  if (payload !== 'hr-authenticated') return false;
  const expected = await hmac(process.env.SESSION_SECRET, payload);
  return sig === expected;
}
