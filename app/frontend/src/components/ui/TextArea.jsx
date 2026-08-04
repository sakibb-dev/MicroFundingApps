import { forwardRef } from 'react';
import FieldWrap from './FieldWrap';

const TextArea = forwardRef(function TextArea(
  { label, required, error, hint, id, className = '', wrapClassName = '', rows = 3, ...props },
  ref
) {
  return (
    <FieldWrap label={label} required={required} error={error} hint={hint} id={id} className={wrapClassName}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`w-full px-3 py-2.5 border rounded text-[13.5px] font-sans outline-none transition-colors resize-y bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 ${
          error ? 'border-danger' : 'border-neutral-300 focus:border-green-400'
        } ${className}`}
        {...props}
      />
    </FieldWrap>
  );
});

export default TextArea;
