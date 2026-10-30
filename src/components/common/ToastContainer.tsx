import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl shadow-xl border border-neutral-800 dark:border-neutral-200 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span className="truncate font-medium">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction?.();
                    dismissToast(toast.id);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Undo
                </button>
              )}
              <button
                onClick={() => dismissToast(toast.id)}
                className="p-1 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
