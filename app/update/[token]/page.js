import { notFound } from 'next/navigation';
import { getClearanceByToken, clearanceLabel, markViewed } from '@/lib/db';
import { updateClearanceAction } from './actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function UpdateStatusPage({ params }) {
  const clearance = await getClearanceByToken(params.token);
  if (!clearance) notFound();

  const done = clearance.status === 'selesai';

  // Tandai link ini sudah dibuka (kalau belum selesai & belum pernah ditandai)
  if (!done && !clearance.dilihat_at) {
    await markViewed(params.token);
  }

  const action = updateClearanceAction.bind(null, params.token);

  return (
    <div className="max-w-md mx-auto">
      <p className="text-xs uppercase tracking-wide text-steel mb-2">
        {clearanceLabel(clearance.jenis)}
      </p>
      <p className="font-display text-2xl text-ink mb-1">{clearance.case.nama_karyawan}</p>
      <p className="text-sm text-steel mb-8">
        {clearance.case.posisi} · Efektif terakhir{' '}
        {new Date(clearance.case.tanggal_efektif).toLocaleDateString('id-ID')}
      </p>

      {done ? (
        <div className="bg-white border border-brass/40 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-full border-2 border-brass text-brass flex items-center justify-center text-[10px] font-semibold uppercase -rotate-6 mb-3">
            Selesai
          </div>
          <p className="text-sm text-ink font-medium">Sudah ditandai selesai</p>
          {clearance.catatan && (
            <p className="text-xs text-steel mt-2">Catatan: &ldquo;{clearance.catatan}&rdquo;</p>
          )}
        </div>
      ) : (
        <form action={action} className="bg-white border border-line rounded-2xl p-6 space-y-4">
          <p className="text-xs text-steel">
            Konfirmasi kalau proses clearance dari pihak Anda untuk karyawan ini sudah selesai.
          </p>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Catatan (opsional)</label>
            <textarea
              name="catatan"
              rows={3}
              placeholder="cth. Laptop & ID card sudah dikembalikan"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Tandai Selesai
          </button>
        </form>
      )}
    </div>
  );
}
