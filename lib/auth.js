// Helper autentikasi sederhana berbasis password tunggal (disimpan di env var
// ADMIN_PASSWORD). Cocok untuk Edge Middleware karena hanya pakai Web Crypto
// API (bukan modul 'crypto' Node biasa).

export const SESSION_COOKIE = 'hr_session';

export async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
