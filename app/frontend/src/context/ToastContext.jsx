import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconCircleCheck, IconAlertCircle, IconAlertTriangle, IconInfoCircle, IconX } from '@tabler/icons-react';

const ToastContext = createContext(null);

const VARIANTS = {
  success: { icon: IconCircleCheck, border: 'border-l-success', iconColor: 'text-success' },
  error: { icon: IconAlertCircle, border: 'border-l-danger', iconColor: 'text-danger' },
  warning: { icon: IconAlertTriangle, border: 'border-l-warning', iconColor: 'text-warning' },
  info: { icon: IconInfoCircle, border: 'border-l-neutral-500', iconColor: 'text-neutral-500' },
};

const MAX_VISIBLE = 3;
const AUTO_DISMISS_MS = 4000;

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const queueRef = useRef([]);

  const promote = useCallback(() => {
    setToasts((prev) => {
      if (prev.length >= MAX_VISIBLE || queueRef.current.length === 0) return prev;
      const next = queueRef.current.shift();
      return [...prev, next];
    });
  }, []);

  const remove = useCallback(
    (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      promote();
    },
    [promote]
  );

  const push = useCallback(
    (variant, message) => {
      const id = ++idCounter;
      const toast = { id, variant, message };
      setToasts((prev) => {
        if (prev.length >= MAX_VISIBLE) {
          queueRef.current.push(toast);
          return prev;
        }
        return [...prev, toast];
      });
      if (variant !== 'error') {
        setTimeout(() => remove(id), AUTO_DISMISS_MS);
      }
      return id;
    },
    [remove]
  );

  const api = {
    success: (msg) => push('success', msg),
    error: (msg) => push('error', msg),
    warning: (msg) => push('warning', msg),
    info: (msg) => push('info', msg),
    dismiss: remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          className="fixed z-[100] top-4 right-4 flex flex-col gap-2 max-sm:top-auto max-sm:bottom-4 max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:w-[92vw]"
          aria-live="polite"
        >
          {toasts.map((t) => {
            const v = VARIANTS[t.variant];
            const Icon = v.icon;
            return (
              <div
                key={t.id}
                role="status"
                className={`flex items-start gap-2.5 bg-white border-l-4 ${v.border} border border-neutral-100 rounded shadow-lg px-4 py-3 w-80 max-w-full`}
              >
                <Icon size={18} className={`${v.iconColor} shrink-0 mt-0.5`} aria-hidden="true" />
                <p className="text-[13px] text-neutral-700 flex-1 leading-snug">{t.message}</p>
                <button
                  onClick={() => remove(t.id)}
                  aria-label="Tutup notifikasi"
                  className="text-neutral-400 hover:text-neutral-700 shrink-0"
                >
                  <IconX size={15} />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
