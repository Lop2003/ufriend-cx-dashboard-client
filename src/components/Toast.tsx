import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;
let externalAddToast: ((type: ToastType, message: string) => void) | null = null;

/** Call this from anywhere to show a toast */
export function showToast(type: ToastType, message: string) {
  externalAddToast?.(type, message);
}

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-400 text-emerald-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Register external accessor
  useEffect(() => {
    externalAddToast = addToast;
    return () => { externalAddToast = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm font-body text-xs font-bold animate-fade-in-up ${STYLES[t.type]}`}
        >
          <span className="text-base shrink-0">{ICONS[t.type]}</span>
          <span className="flex-1 leading-relaxed">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-current opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-sm font-black"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
