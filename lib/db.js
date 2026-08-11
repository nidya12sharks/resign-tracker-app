import { sql } from '@vercel/postgres';
import { sha256, randomToken, hashPasswordWithSalt } from './auth';

// 4 unit yang harus memberi clearance, sesuai form fisik "Daftar Clearance"
export const CLEARANCE_TYPES = [
  { jenis: 'hcga', label: 'Human Capital & General Affair' },
  { jenis: 'it', label: 'IT' },
  { jenis: 'operasional', label: 'Operasional' },
  { jenis: 'atasan', label: 'Atasan Langsung' },
];

// Checklist default per unit, sesuai form fisik
const CHECKLIST_TEMPLATE = {
  hcga: [
    'ID Card',
    'Kartu Nama',
    'Kunci Loker',
    'Seragam',
    'Kendaraan Dinas',
    'Laptop/PC/HP',
    'Tas/Ransel',
    'Reimbursement',
  ],
  it: [
    'Pengecekan Kondisi Laptop/PC/HP',
    'Email Perusahaan',
    'Akun CBS',
    'Akun SLIK',
    'Akun CRM',
    'Akun Pefindo',
    'Akun Lainnya',
  ],
  operasional: ['Kredit/Pinjaman'],
  atasan: ['Dokumen Serah Terima Jabatan'],
};

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS cases (
      id SERIAL PRIMARY KEY,
      nama_karyawan TEXT NOT NULL,
      posisi TEXT NOT NULL,
      tanggal_pengajuan DATE NOT NULL,
      tanggal_efektif DATE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE cases ADD COLUMN IF NOT EXISTS nip TEXT;`;
  await sql`ALTER TABLE cases ADD COLUMN IF NOT EXISTS unit_kerja TEXT;`;
  await sql`ALTER TABLE cases ADD COLUMN IF NOT EXISTS tanggal_masuk DATE;`;

  await sql`
    CREATE TABLE IF NOT EXISTS clearances (
      id SERIAL PRIMARY KEY,
      case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      jenis TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'belum',
      catatan TEXT,
      token TEXT UNIQUE NOT NULL,
      dilihat_at TIMESTAMP,
      updated_at TIMESTAMP
    );
  `;
  await sql`ALTER TABLE clearances ADD COLUMN IF NOT EXISTS dilihat_at TIMESTAMP;`;

  await sql`
    CREATE TABLE IF NOT EXISTS clearance_items (
      id SERIAL PRIMARY KEY,
      clearance_id INTEGER NOT NULL REFERENCES clearances(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      checked BOOLEAN NOT NULL DEFAULT FALSE,
      keterangan TEXT,
      urutan INTEGER NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_account (
      id SERIAL PRIMARY KEY,
      email TEXT,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      reset_token TEXT,
      reset_token_expires TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP NOT NULL
    );
  `;

  // Seed akun admin pertama kali dari env var ADMIN_PASSWORD (kalau tabel
  // masih kosong). Setelah ini, password disimpan & diubah lewat database,
  // bukan env var lagi.
  const { rows: existingAccount } = await sql`SELECT id FROM admin_account LIMIT 1;`;
  if (existingAccount.length === 0 && process.env.ADMIN_PASSWORD) {
    const salt = randomToken(16);
    const hash = await hashPasswordWithSalt(process.env.ADMIN_PASSWORD, salt);
    await sql`
      INSERT INTO admin_account (email, password_hash, password_salt)
      VALUES (${process.env.ADMIN_EMAIL || null}, ${hash}, ${salt});
    `;
  }

  schemaReady = true;
}

export function clearanceLabel(jenis) {
  return CLEARANCE_TYPES.find((c) => c.jenis === jenis)?.label ?? jenis;
}

// Tiga state: 'belum' (belum dibuka), 'diproses' (link dibuka tapi belum semua item selesai), 'selesai'
export function displayStatus(clearance) {
  if (clearance.status === 'selesai') return 'selesai';
  if (clearance.dilihat_at) return 'diproses';
  return 'belum';
}

export async function markViewed(token) {
  await ensureSchema();
  await sql`
    UPDATE clearances
    SET dilihat_at = NOW()
    WHERE token = ${token} AND status = 'belum' AND dilihat_at IS NULL;
  `;
}

export async function getCases() {
  await ensureSchema();
  const { rows: cases } = await sql`SELECT * FROM cases ORDER BY created_at DESC;`;
  const { rows: clearances } = await sql`SELECT * FROM clearances;`;

  return cases.map((c) => {
    const items = clearances.filter((cl) => cl.case_id === c.id);
    const selesai = items.filter((cl) => cl.status === 'selesai').length;
    return {
      ...c,
      clearances: items,
      selesai,
      total: items.length,
      overallDone: items.length > 0 && selesai === items.length,
    };
  });
}

export async function getCaseById(id) {
  await ensureSchema();
  const { rows: cases } = await sql`SELECT * FROM cases WHERE id = ${id};`;
  if (cases.length === 0) return null;

  const { rows: clearances } = await sql`
    SELECT * FROM clearances WHERE case_id = ${id} ORDER BY id;
  `;
  const { rows: items } = await sql`
    SELECT ci.* FROM clearance_items ci
    JOIN clearances cl ON cl.id = ci.clearance_id
    WHERE cl.case_id = ${id}
    ORDER BY ci.urutan, ci.id;
  `;

  const clearancesWithItems = clearances.map((cl) => ({
    ...cl,
    items: items.filter((i) => i.clearance_id === cl.id),
  }));

  return { ...cases[0], clearances: clearancesWithItems };
}

export async function createCase({
  namaKaryawan,
  nip,
  jabatan,
  unitKerja,
  tanggalPengajuan,
  tanggalMasuk,
  tanggalEfektif,
}) {
  await ensureSchema();

  const { rows } = await sql`
    INSERT INTO cases (nama_karyawan, nip, posisi, unit_kerja, tanggal_pengajuan, tanggal_masuk, tanggal_efektif)
    VALUES (${namaKaryawan}, ${nip || null}, ${jabatan}, ${unitKerja || null}, ${tanggalPengajuan}, ${tanggalMasuk || null}, ${tanggalEfektif})
    RETURNING id;
  `;
  const caseId = rows[0].id;

  for (const type of CLEARANCE_TYPES) {
    const token = crypto.randomUUID();
    const { rows: clRows } = await sql`
      INSERT INTO clearances (case_id, jenis, token)
      VALUES (${caseId}, ${type.jenis}, ${token})
      RETURNING id;
    `;
    const clearanceId = clRows[0].id;

    const template = CHECKLIST_TEMPLATE[type.jenis] || [];
    for (let i = 0; i < template.length; i++) {
      await sql`
        INSERT INTO clearance_items (clearance_id, label, urutan)
        VALUES (${clearanceId}, ${template[i]}, ${i});
      `;
    }
  }

  return caseId;
}

export async function getClearanceByToken(token) {
  await ensureSchema();
  const { rows } = await sql`SELECT * FROM clearances WHERE token = ${token};`;
  if (rows.length === 0) return null;

  const clearance = rows[0];
  const { rows: cases } = await sql`SELECT * FROM cases WHERE id = ${clearance.case_id};`;
  const { rows: items } = await sql`
    SELECT * FROM clearance_items WHERE clearance_id = ${clearance.id} ORDER BY urutan, id;
  `;

  return { ...clearance, case: cases[0], items };
}

// items: [{ id, checked, keterangan }]
export async function updateClearanceItems(token, items) {
  await ensureSchema();
  const { rows } = await sql`SELECT id FROM clearances WHERE token = ${token};`;
  if (rows.length === 0) return;
  const clearanceId = rows[0].id;

  for (const item of items) {
    await sql`
      UPDATE clearance_items
      SET checked = ${item.checked}, keterangan = ${item.keterangan || null}
      WHERE id = ${item.id} AND clearance_id = ${clearanceId};
    `;
  }

  const { rows: allItems } = await sql`
    SELECT checked FROM clearance_items WHERE clearance_id = ${clearanceId};
  `;
  const allChecked = allItems.length > 0 && allItems.every((i) => i.checked);

  await sql`
    UPDATE clearances
    SET status = ${allChecked ? 'selesai' : 'belum'}, updated_at = NOW()
    WHERE id = ${clearanceId};
  `;
}

export async function deleteCase(id) {
  await ensureSchema();
  await sql`DELETE FROM cases WHERE id = ${id};`;
}

// ===== Akun HR, sesi login, dan reset password =====

export async function verifyLogin(password) {
  await ensureSchema();
  const { rows } = await sql`SELECT password_hash, password_salt FROM admin_account LIMIT 1;`;
  if (rows.length === 0) return false;
  const attempt = await hashPasswordWithSalt(password, rows[0].password_salt);
  return attempt === rows[0].password_hash;
}

export async function createSession() {
  await ensureSchema();
  const token = randomToken();
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari
  await sql`
    INSERT INTO admin_sessions (token_hash, expires_at)
    VALUES (${tokenHash}, ${expiresAt.toISOString()});
  `;
  return token;
}

export async function validateSession(token) {
  if (!token) return false;
  await ensureSchema();
  const tokenHash = await sha256(token);
  const { rows } = await sql`
    SELECT id FROM admin_sessions WHERE token_hash = ${tokenHash} AND expires_at > NOW();
  `;
  return rows.length > 0;
}

export async function deleteSession(token) {
  if (!token) return;
  await ensureSchema();
  const tokenHash = await sha256(token);
  await sql`DELETE FROM admin_sessions WHERE token_hash = ${tokenHash};`;
}

export async function invalidateAllSessions() {
  await ensureSchema();
  await sql`DELETE FROM admin_sessions;`;
}

export async function getAdminEmail() {
  await ensureSchema();
  const { rows } = await sql`SELECT email FROM admin_account LIMIT 1;`;
  return rows[0]?.email || null;
}

export async function changeEmail(newEmail) {
  await ensureSchema();
  await sql`UPDATE admin_account SET email = ${newEmail}, updated_at = NOW();`;
}

export async function changePassword(currentPassword, newPassword) {
  await ensureSchema();
  const ok = await verifyLogin(currentPassword);
  if (!ok) return { success: false, error: 'wrong' };

  const salt = randomToken(16);
  const hash = await hashPasswordWithSalt(newPassword, salt);
  await sql`
    UPDATE admin_account SET password_hash = ${hash}, password_salt = ${salt}, updated_at = NOW();
  `;
  await invalidateAllSessions();
  return { success: true };
}

export async function createResetToken() {
  await ensureSchema();
  const { rows } = await sql`SELECT email FROM admin_account LIMIT 1;`;
  if (rows.length === 0 || !rows[0].email) return null;

  const token = randomToken();
  const tokenHash = await sha256(token);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

  await sql`
    UPDATE admin_account
    SET reset_token = ${tokenHash}, reset_token_expires = ${expires.toISOString()};
  `;

  return { token, email: rows[0].email };
}

export async function resetPasswordWithToken(token, newPassword) {
  await ensureSchema();
  const tokenHash = await sha256(token);
  const { rows } = await sql`
    SELECT id FROM admin_account WHERE reset_token = ${tokenHash} AND reset_token_expires > NOW();
  `;
  if (rows.length === 0) return { success: false };

  const salt = randomToken(16);
  const hash = await hashPasswordWithSalt(newPassword, salt);
  await sql`
    UPDATE admin_account
    SET password_hash = ${hash}, password_salt = ${salt}, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW()
    WHERE id = ${rows[0].id};
  `;
  await invalidateAllSessions();
  return { success: true };
}
