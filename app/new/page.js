import { createCaseAction } from './actions';

export default function NewCasePage() {
  return (
    <div className="max-w-lg">
      <p className="font-display text-3xl text-ink mb-1">Kasus Resign Baru</p>
      <p className="text-sm text-steel mb-8">
        Isi data karyawan, sistem akan membuatkan link checklist clearance untuk tiap unit.
      </p>

      <form
        action={createCaseAction}
        className="bg-white border border-line rounded-2xl p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Nama</label>
          <input
            name="nama_karyawan"
            required
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            placeholder="cth. Siti Rahma"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              NIP (Nomor Induk Pegawai)
            </label>
            <input
              name="nip"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="cth. 2019001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Jabatan</label>
            <input
              name="jabatan"
              required
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="cth. Staff Operasional"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Unit Kerja/Departemen
          </label>
          <input
            name="unit_kerja"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            placeholder="cth. Operasional Cabang A"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Tanggal Masuk</label>
            <input
              type="date"
              name="tanggal_masuk"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Tanggal Pengajuan</label>
            <input
              type="date"
              name="tanggal_pengajuan"
              required
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Tanggal Keluar</label>
            <input
              type="date"
              name="tanggal_efektif"
              required
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition"
        >
          Buat Kasus & Generate Link
        </button>
      </form>
    </div>
  );
}
