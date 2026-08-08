'use client';

import { useState, useTransition } from 'react';
import { deleteCaseAction } from '@/app/actions';

export default function DeleteCaseButton({ caseId, caseName }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-steel">Yakin hapus?</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => deleteCaseAction(caseId))}
          className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-full disabled:opacity-50"
        >
          {isPending ? '...' : 'Ya, hapus'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-steel hover:text-ink px-2 py-1"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-xs text-steel hover:text-red-600 transition"
      title={`Hapus kasus ${caseName}`}
    >
      Hapus
    </button>
  );
}
