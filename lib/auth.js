// Helper autentikasi. Semua fungsi di sini hanya pakai Web Crypto API supaya
// kompatibel dijalankan di Edge Middleware maupun Server Action biasa.

export const SESSION_COOKIE = 'hr_session';

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return toHex(hashBuffer);
}

export function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashPasswordWithSalt(password, salt) {
  return sha256(`${salt}:${password}`);
}
