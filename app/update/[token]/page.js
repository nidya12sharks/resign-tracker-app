import { notFound } from 'next/navigation';
import { getClearanceByToken, clearanceLabel, markViewed } from '@/lib/db';
import { updateClearanceAction } from './actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function UpdateStatusPage({ params }) {
  const clearance = await getClearanceByToken(params.token);
  if (!clearance) notFound();

  if (!clearance.dilihat_at) {
    await markViewed(params.token);
  }

  const done = clearance.status === 'selesai';
  const itemIds = clearance.items.map((i) => i.id);
  const action = updateClearanceAction.bind(null, params.token, itemIds);

  return (
    <div className="max-w-lg mx-auto">
      <p className="text-xs uppercase tracking-wide text-steel mb-2">
        {clearanceLabel(clearance.jenis)}
      </p>
      <p className="font-display text-2xl text-ink mb-1">{clearance.case.nama_karyawan}</p>
      <div className="text-sm text-steel mb-6 space-y-0.5">
        <p>
          NIP {clearance.case.nip || '-'} · {clearance.case.posisi}
          {clearance.case.unit_kerja ? ` · ${clearance.case.unit_kerja}` : ''}
        </p>
        <p>Tanggal keluar {new Date(clearance.case.tanggal_efektif).toLocaleDateString('id-ID')}</p>
      </div>

      {done && (
        <div className="mb-4 text-xs font-medium text-brass bg-brass/10 border border-brass/30 rounded-lg px-3 py-2">
          Semua item di unit ini sudah ditandai selesai. Kamu tetap bisa mengubahnya di bawah kalau perlu.
        </div>
      )}

      <form action={action} className="bg-white border border-line rounded-2xl p-6">
        <p className="text-xs text-steel mb-4">
          Centang item yang sudah selesai diproses, isi keterangan bila perlu, lalu klik Simpan.
        </p>
        <div className="divide-y divide-line">
          {clearance.items.map((item) => (
            <div key={item.id} className="py-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name={`checked_${item.id}`}
                  defaultChecked={item.checked}
                  className="mt-1 w-4 h-4 accent-ink shrink-0"
                />
                <span className="text-sm text-ink">{item.label}</span>
              </label>
              <input
                type="text"
                name={`ket_${item.id}`}
                defaultValue={item.keterangan || ''}
                placeholder="Keterangan (opsional)"
                className="mt-1.5 ml-7 w-[calc(100%-1.75rem)] border border-line rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
