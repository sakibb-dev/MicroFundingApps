import { forwardRef, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import FieldWrap from './FieldWrap';

const Input = forwardRef(function Input(
  { label, required, error, hint, id, className = '', wrapClassName = '', type = 'text', ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <FieldWrap label={label} required={required} error={error} hint={hint} id={id} className={wrapClassName}>
      <div className={isPassword ? 'relative' : ''}>
        <input
          ref={ref}
          id={id}
          type={resolvedType}
          className={`w-full px-3 py-2.5 border rounded text-[13.5px] font-sans outline-none transition-colors bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 ${
            error ? 'border-danger' : 'border-neutral-300 focus:border-green-400'
          } ${isPassword ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
          >
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        )}
      </div>
    </FieldWrap>
  );
});

export default Input;
