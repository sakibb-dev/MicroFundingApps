import { useEffect, useState } from 'react';
import { IconFileText, IconAlertTriangle, IconExternalLink } from '@tabler/icons-react';
import api from '../../api/client';

// Documents live behind an authenticated endpoint (private disk, admin-only
// route) -- a plain <img src="..."> can't send the Authorization header, so
// this fetches the bytes via the same axios client the rest of the app uses
// and turns them into an object URL.
export default function DocumentViewer({ label, url, height = 'h-36' }) {
  const [state, setState] = useState(url ? 'loading' : 'unavailable');
  const [objectUrl, setObjectUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  useEffect(() => {
    if (!url) {
      setState('unavailable');
      return;
    }

    let currentUrl;
    let cancelled = false;
    setState('loading');

    api
      .get(url, { responseType: 'blob' })
      .then((res) => {
        if (cancelled) return;
        currentUrl = URL.createObjectURL(res.data);
        setObjectUrl(currentUrl);
        setMimeType(res.data.type);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [url]);

  if (state === 'unavailable') {
    return (
      <div className={`bg-neutral-100 rounded-lg ${height} flex flex-col items-center justify-center gap-1.5 text-[12px] text-neutral-500`}>
        <IconFileText size={22} aria-hidden="true" />
        {label}
        <span className="text-[10.5px] text-neutral-400">Belum diunggah</span>
      </div>
    );
  }

  if (state === 'loading') {
    return <div className={`bg-neutral-100 rounded-lg ${height} animate-pulse`} />;
  }

  if (state === 'error') {
    return (
      <div className={`bg-red-50 rounded-lg ${height} flex flex-col items-center justify-center gap-1.5 text-[12px] text-danger`}>
        <IconAlertTriangle size={22} aria-hidden="true" />
        {label}
        <span className="text-[10.5px]">Gagal memuat dokumen</span>
      </div>
    );
  }

  const isImage = mimeType?.startsWith('image/');

  return (
    <a
      href={objectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block rounded-lg overflow-hidden border border-neutral-200 ${height} bg-neutral-50`}
    >
      {isImage ? (
        <img src={objectUrl} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[12px] text-neutral-600">
          <IconFileText size={26} aria-hidden="true" />
          {label}
          <span className="text-[10.5px] text-neutral-400">Dokumen PDF</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/60 px-2.5 py-1 rounded-full">
          <IconExternalLink size={12} aria-hidden="true" /> Buka penuh
        </span>
      </div>
      {isImage && (
        <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded">{label}</span>
      )}
    </a>
  );
}
