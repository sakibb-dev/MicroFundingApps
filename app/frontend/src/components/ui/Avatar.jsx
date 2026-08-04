function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ name = '', tone = 'green', size = 36, className = '' }) {
  const bg = tone === 'teal' ? 'bg-teal-800' : 'bg-green-800';
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${bg} ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
      aria-hidden="true"
    >
      {getInitials(name) || '?'}
    </div>
  );
}
