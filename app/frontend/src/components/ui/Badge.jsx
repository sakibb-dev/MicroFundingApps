const VARIANT_TONE_CLASSES = {
  success: {
    green: 'bg-green-100 text-green-600',
    teal: 'bg-teal-50 text-teal-800',
  },
  warning: {
    green: 'bg-amber-100 text-amber-800',
    teal: 'bg-amber-100 text-amber-800',
  },
  danger: {
    green: 'bg-red-100 text-red-800',
    teal: 'bg-red-100 text-red-800',
  },
  neutral: {
    green: 'bg-neutral-100 text-neutral-500',
    teal: 'bg-neutral-100 text-neutral-500',
  },
};

export default function Badge({ variant = 'neutral', tone = 'green', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold whitespace-nowrap ${VARIANT_TONE_CLASSES[variant][tone]} ${className}`}
    >
      {children}
    </span>
  );
}
