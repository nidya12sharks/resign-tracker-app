import { sql } from '@vercel/postgres';

export const CLEARANCE_TYPES = [
  { jenis: 'atasan', label: 'Approval Atasan' },
  { jenis: 'it', label: 'Clearance IT' },
  { jenis: 'finance', label: 'Clearance Finance' },
  { jenis: 'ga', label: 'Clearance GA' },
];

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

  // Aman dijalankan berkali-kali walau kolom sudah ada (untuk deployment lama)
  await sql`ALTER TABLE clearances ADD COLUMN IF NOT EXISTS dilihat_at TIMESTAMP;`;

  schemaReady = true;
}

export function clearanceLabel(jenis) {
  return CLEARANCE_TYPES.find((c) => c.jenis === jenis)?.label ?? jenis;
}

// Tiga state: 'belum' (belum dibuka), 'diproses' (link dibuka tapi belum submit), 'selesai'
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

  return { ...cases[0], clearances };
}

export async function createCase({ namaKaryawan, posisi, tanggalPengajuan, tanggalEfektif }) {
  await ensureSchema();

  const { rows } = await sql`
    INSERT INTO cases (nama_karyawan, posisi, tanggal_pengajuan, tanggal_efektif)
    VALUES (${namaKaryawan}, ${posisi}, ${tanggalPengajuan}, ${tanggalEfektif})
    RETURNING id;
  `;
  const caseId = rows[0].id;

  for (const type of CLEARANCE_TYPES) {
    const token = crypto.randomUUID();
    await sql`
      INSERT INTO clearances (case_id, jenis, token)
      VALUES (${caseId}, ${type.jenis}, ${token});
    `;
  }

  return caseId;
}

export async function getClearanceByToken(token) {
  await ensureSchema();
  const { rows } = await sql`SELECT * FROM clearances WHERE token = ${token};`;
  if (rows.length === 0) return null;

  const clearance = rows[0];
  const { rows: cases } = await sql`SELECT * FROM cases WHERE id = ${clearance.case_id};`;

  return { ...clearance, case: cases[0] };
}

export async function markClearanceOpened(token) {
  await ensureSchema();
  await sql`
    UPDATE clearances
    SET status = 'diproses', updated_at = NOW()
    WHERE token = ${token} AND status = 'belum';
  `;
}

export async function updateClearanceByToken(token, catatan) {
  await ensureSchema();
  await sql`
    UPDATE clearances
    SET status = 'selesai', catatan = ${catatan || null}, updated_at = NOW()
    WHERE token = ${token};
  `;
}
