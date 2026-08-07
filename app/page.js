import Link from 'next/link';
import { getCases } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cases = await getCases();

  return (
    <div>
      <div className="mb-8">
        <p className="font-display text-3xl text-ink">Daftar Kasus Resign</p>
        <p className="text-sm text-steel mt-1">
          Pantau progres clearance tiap karyawan yang mengajukan resign.
        </p>
      </div>

      {cases.length === 0 ? (
        <div className="border border-dashed border-line rounded-2xl p-10 text-center bg-white">
          <p className="text-steel">Belum ada kasus resign yang tercatat.</p>
          <Link href="/new" className="inline-block mt-4 text-sm font-medium underline text-ink">
            Tambah kasus resign pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-steel">
                <th className="px-5 py-3 font-medium">Karyawan</th>
                <th className="px-5 py-3 font-medium">Posisi</th>
                <th className="px-5 py-3 font-medium">Efektif Terakhir</th>
                <th className="px-5 py-3 font-medium">Progres</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-line last:border-0 hover:bg-paper transition"
                >
                  <td className="px-5 py-4">
                    <Link href={`/case/${c.id}`} className="font-medium text-ink hover:underline">
                      {c.nama_karyawan}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-steel">{c.posisi}</td>
                  <td className="px-5 py-4 text-steel">
                    {new Date(c.tanggal_efektif).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-5 py-4 text-steel">
                    {c.selesai}/{c.total} selesai
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        c.overallDone
                          ? 'bg-brass/15 text-brass'
                          : 'bg-steel/15 text-steel'
                      }`}
                    >
                      {c.overallDone ? 'Selesai' : 'Proses Berjalan'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
