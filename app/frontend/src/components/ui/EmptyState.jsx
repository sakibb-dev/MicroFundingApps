import Button from './Button';

export default function EmptyState({ icon: Icon, title, body, ctaLabel, onCta, tone = 'green', className = '' }) {
  return (
    <div className={`text-center py-14 px-6 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <Icon size={26} className="text-neutral-400" aria-hidden="true" />
        </div>
      )}
      <div className="text-[15px] font-bold text-neutral-900 mb-1.5">{title}</div>
      {body && <p className="text-[13px] text-neutral-500 max-w-xs mx-auto mb-5 leading-relaxed">{body}</p>}
      {ctaLabel && (
        <Button variant="outline" tone={tone} size="sm" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
