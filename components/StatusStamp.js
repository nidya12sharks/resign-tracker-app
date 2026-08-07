export default function StatusStamp({ label, status, catatan }) {
  const done = status === 'selesai';

  return (
    <div className="flex items-start gap-4 py-4">
      <div
        className={`shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-center leading-tight ${
          done
            ? 'border-brass text-brass -rotate-6'
            : 'border-dashed border-line text-steel'
        }`}
      >
        {done ? 'Selesai' : 'Belum'}
      </div>
      <div>
        <p className="font-medium text-ink text-sm">{label}</p>
        {catatan && <p className="text-xs text-steel mt-1">&ldquo;{catatan}&rdquo;</p>}
      </div>
    </div>
  );
}
