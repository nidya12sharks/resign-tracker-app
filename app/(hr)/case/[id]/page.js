import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCaseById, clearanceLabel, displayStatus } from '@/lib/db';
import CopyLinkButton from '@/components/CopyLinkButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const STATUS_BADGE = {
  belum: 'bg-line/40 text-steel',
  diproses: 'bg-steel/15 text-steel',
  selesai: 'bg-brass/15 text-brass',
};
const STATUS_LABEL = { belum: 'Belum', diproses: 'Diproses', selesai: 'Selesai' };

export default async function CaseDetailPage({ params }) {
  const c = await getCaseById(params.id);
  if (!c) notFound();

  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return (
    <div>
      <p className="font-display text-3xl text-ink">{c.nama_karyawan}</p>
      <div className="text-sm text-steel mt-1 space-y-0.5">
        <p>
          NIP {c.nip || '-'} · {c.posisi}
          {c.unit_kerja ? ` · ${c.unit_kerja}` : ''}
        </p>
        <p>
          Masuk {c.tanggal_masuk ? new Date(c.tanggal_masuk).toLocaleDateString('id-ID') : '-'} · Keluar{' '}
          {new Date(c.tanggal_efektif).toLocaleDateString('id-ID')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="text-sm font-medium text-ink mb-4">Progres Clearance</p>
          <div className="space-y-5">
            {c.clearances.map((cl) => {
              const st = displayStatus(cl);
              return (
                <div key={cl.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-ink">{clearanceLabel(cl.jenis)}</p>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${STATUS_BADGE[st]}`}
                    >
                      {STATUS_LABEL[st]}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {cl.items.map((item) => (
                      <li key={item.id} className="text-xs flex items-start gap-2">
                        <span className={item.checked ? 'text-brass' : 'text-line'}>
                          {item.checked ? '✓' : '○'}
                        </span>
                        <span className={item.checked ? 'text-ink' : 'text-steel'}>
                          {item.label}
                          {item.keterangan && (
                            <span className="text-steel italic"> — {item.keterangan}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6 h-fit">
          <p className="text-sm font-medium text-ink mb-1">Bagikan Link ke Tiap Pihak</p>
          <p className="text-xs text-steel mb-4">
            Kirim link berikut ke masing-masing pihak lewat WA/email supaya mereka bisa isi
            checklist sendiri, tanpa perlu login.
          </p>
          <div className="space-y-3">
            {c.clearances.map((cl) => (
              <div
                key={cl.id}
                className="flex items-center justify-between border border-line rounded-lg px-3 py-2.5"
              >
                <p className="text-sm text-ink">{clearanceLabel(cl.jenis)}</p>
                <CopyLinkButton url={`${baseUrl}/update/${cl.token}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
