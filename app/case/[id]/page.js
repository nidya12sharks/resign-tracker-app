import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCaseById, clearanceLabel, displayStatus } from '@/lib/db';
import CopyLinkButton from '@/components/CopyLinkButton';
import StatusStamp from '@/components/StatusStamp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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
      <p className="text-sm text-steel mt-1">
        {c.posisi} · Efektif terakhir {new Date(c.tanggal_efektif).toLocaleDateString('id-ID')}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="text-sm font-medium text-ink mb-2">Progres Clearance</p>
          <div className="divide-y divide-line">
            {c.clearances.map((cl) => (
              <StatusStamp
                key={cl.id}
                label={clearanceLabel(cl.jenis)}
                status={displayStatus(cl)}
                catatan={cl.catatan}
              />
            ))}
          </div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="text-sm font-medium text-ink mb-1">Bagikan Link ke Tiap Pihak</p>
          <p className="text-xs text-steel mb-4">
            Kirim link berikut ke masing-masing pihak lewat WA/email supaya mereka bisa update
            status sendiri, tanpa perlu login.
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
