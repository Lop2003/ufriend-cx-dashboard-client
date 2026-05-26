import { useState, useEffect, useCallback, ReactNode } from 'react';

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

const ICONS: Record<ToastType, ReactNode> = {
  success: (
    <svg className="w-5 h-5 text-emerald-500 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const STYLES: Record<ToastType, { wrapper: string; text: string }> = {
  success: {
    wrapper: 'bg-white/95 border border-slate-100 border-l-4 border-l-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.06),0_4px_12px_rgba(0,0,0,0.04)]',
    text: 'text-slate-800'
  },
  error: {
    wrapper: 'bg-white/95 border border-slate-100 border-l-4 border-l-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.06),0_4px_12px_rgba(0,0,0,0.04)]',
    text: 'text-slate-800'
  },
  info: {
    wrapper: 'bg-white/95 border border-slate-100 border-l-4 border-l-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.06),0_4px_12px_rgba(0,0,0,0.04)]',
    text: 'text-slate-800'
  },
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
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-80 sm:w-96 max-w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3.5 pl-6 pr-5 py-4 rounded-2xl transition-all duration-300 transform translate-y-0 ease-out shadow-lg backdrop-blur-md font-body text-xs font-bold animate-fade-in-up ${STYLES[t.type].wrapper}`}
        >
          <div className="shrink-0">{ICONS[t.type]}</div>
          <span className={`flex-1 leading-none ${STYLES[t.type].text}`}>{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-0.5 rounded-lg transition-all cursor-pointer shrink-0"
            title="ปิดการแจ้งเตือน"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
