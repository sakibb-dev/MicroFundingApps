import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function Pagination({ meta, onPageChange, tone = 'teal' }) {
  if (!meta || meta.lastPage <= 1) return null;

  const activeClass = tone === 'teal' ? 'bg-teal-800 text-white border-teal-800' : 'bg-green-800 text-white border-green-800';

  const pages = Array.from({ length: meta.lastPage }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-neutral-100">
      <p className="text-[12px] text-neutral-500">
        Menampilkan {meta.from}–{meta.to} dari {meta.total} data
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
          className="w-7 h-7 flex items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <IconChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-7 h-7 px-1.5 flex items-center justify-center rounded border text-[12px] font-semibold transition-colors ${
              p === meta.currentPage ? activeClass : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={meta.currentPage >= meta.lastPage}
          onClick={() => onPageChange(meta.currentPage + 1)}
          className="w-7 h-7 flex items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman berikutnya"
        >
          <IconChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
