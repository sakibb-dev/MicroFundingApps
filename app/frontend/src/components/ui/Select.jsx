import { forwardRef } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import FieldWrap from './FieldWrap';

const Select = forwardRef(function Select(
  { label, required, error, hint, id, className = '', wrapClassName = '', children, ...props },
  ref
) {
  return (
    <FieldWrap label={label} required={required} error={error} hint={hint} id={id} className={wrapClassName}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={`w-full appearance-none px-3 py-2.5 pr-9 border rounded text-[13.5px] font-sans outline-none transition-colors bg-white text-neutral-900 cursor-pointer disabled:bg-neutral-50 disabled:text-neutral-500 ${
            error ? 'border-danger' : 'border-neutral-300 focus:border-green-400'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
      </div>
    </FieldWrap>
  );
});

export default Select;
