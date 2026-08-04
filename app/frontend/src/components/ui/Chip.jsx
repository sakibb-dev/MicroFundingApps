export default function Chip({ active, tone = 'green', children, className = '', ...props }) {
  const activeClasses = tone === 'teal' ? 'bg-teal-800 border-teal-800 text-white' : 'bg-green-800 border-green-800 text-white';
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors whitespace-nowrap ${
        active ? activeClasses : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
