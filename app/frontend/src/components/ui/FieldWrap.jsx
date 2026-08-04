import { IconAlertCircle } from '@tabler/icons-react';

export default function FieldWrap({ label, required, error, hint, id, className = '', children }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="flex items-center gap-1 text-[12.5px] font-semibold text-neutral-700 mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <div className="text-[11.5px] text-neutral-500 mt-1.5">{hint}</div>}
      {error && (
        <div className="flex items-center gap-1 text-[11.5px] text-danger mt-1.5">
          <IconAlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}
