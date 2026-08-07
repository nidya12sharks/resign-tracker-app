const STYLES = {
  belum: {
    label: 'Belum',
    classes: 'border-dashed border-line text-steel',
  },
  diproses: {
    label: 'Diproses',
    classes: 'border-steel text-steel',
  },
  selesai: {
    label: 'Selesai',
    classes: 'border-brass text-brass -rotate-6',
  },
};

export default function StatusStamp({ label, status, catatan }) {
  const style = STYLES[status] ?? STYLES.belum;

  return (
    <div className="flex items-start gap-4 py-4">
      <div
        className={`shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-center leading-tight ${style.classes}`}
      >
        {style.label}
      </div>
      <div>
        <p className="font-medium text-ink text-sm">{label}</p>
        {catatan && <p className="text-xs text-steel mt-1">&ldquo;{catatan}&rdquo;</p>}
      </div>
    </div>
  );
}
