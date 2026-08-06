import { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';

export default function CopyButton({ value, className = '' }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e) {
    e.stopPropagation();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API can be unavailable (older browser, insecure context) --
      // fail silently rather than throw, copying is a convenience, not critical.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Salin nomor rekening"
      className={`inline-flex items-center justify-center w-6 h-6 rounded text-neutral-400 hover:text-teal-700 hover:bg-teal-50 transition-colors ${className}`}
    >
      {copied ? <IconCheck size={14} className="text-success" /> : <IconCopy size={14} />}
    </button>
  );
}
