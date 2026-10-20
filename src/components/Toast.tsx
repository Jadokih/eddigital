import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white/95 shadow-emerald-500/10',
    error: 'border-rose-200 bg-white/95 shadow-rose-500/10',
    info: 'border-blue-200 bg-white/95 shadow-blue-500/10',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${borders[toast.type]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{toast.title}</h4>
          {toast.message && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
