'use client';

import { useState } from 'react';

export default function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin link', err);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs font-medium px-3 py-1.5 rounded-full border border-line hover:bg-paper transition text-ink"
    >
      {copied ? 'Tersalin!' : 'Copy Link'}
    </button>
  );
}
