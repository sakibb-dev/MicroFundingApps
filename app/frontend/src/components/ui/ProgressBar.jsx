export default function ProgressBar({ percent = 0, tone = 'green', size = 'md', labels, className = '' }) {
  const fillColor = tone === 'teal' ? 'bg-teal-500' : 'bg-green-400';
  const bgColor = tone === 'teal' ? 'bg-teal-50' : 'bg-green-100';
  const height = size === 'lg' ? 'h-3' : size === 'sm' ? 'h-1.5' : 'h-2';
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={className}>
      <div
        className={`${height} ${bgColor} rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full ${fillColor} rounded-full`} style={{ width: `${clamped}%` }} />
      </div>
      {labels && (
        <div className="flex justify-between text-[11px] text-neutral-500 mt-1.5">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}
