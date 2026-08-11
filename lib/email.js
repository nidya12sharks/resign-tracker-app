// Kirim email lewat Resend API (https://resend.com) pakai fetch biasa,
// supaya tidak perlu tambah dependency npm baru.

export async function sendResetEmail(toEmail, resetUrl) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY belum diset di environment variable.');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Resign Tracker <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Reset Password - Resign Tracker',
      html: `
        <p>Ada permintaan reset password untuk dashboard Resign Tracker.</p>
        <p>Klik link berikut untuk membuat password baru (berlaku 1 jam):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Kalau kamu tidak merasa meminta ini, abaikan saja email ini.</p>
      `,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal mengirim email: ${text}`);
  }
}
