import { IconLoader2 } from '@tabler/icons-react';

const VARIANT_TONE_CLASSES = {
  primary: {
    green: 'bg-green-800 text-white hover:bg-green-600',
    teal: 'bg-teal-800 text-white hover:bg-teal-700',
  },
  outline: {
    green: 'border border-green-800 text-green-800 bg-transparent hover:bg-green-50',
    teal: 'border border-teal-800 text-teal-800 bg-transparent hover:bg-teal-50',
  },
  ghost: {
    green: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-300/50',
    teal: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-300/50',
  },
  danger: {
    green: 'bg-danger text-white hover:bg-red-600',
    teal: 'bg-danger text-white hover:bg-red-600',
  },
  'danger-outline': {
    green: 'border border-danger text-danger bg-transparent hover:bg-red-50',
    teal: 'border border-danger text-danger bg-transparent hover:bg-red-50',
  },
};

const SIZE_CLASSES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-[13.5px]',
  lg: 'px-7 py-3.5 text-[15px]',
};

export default function Button({
  variant = 'primary',
  tone = 'green',
  size = 'md',
  full = false,
  loading = false,
  disabled = false,
  children,
  className = '',
  as: Comp = 'button',
  ...props
}) {
  return (
    <Comp
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${SIZE_CLASSES[size]} ${VARIANT_TONE_CLASSES[variant][tone]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <IconLoader2 size={16} className="animate-spin" />}
      {children}
    </Comp>
  );
}
