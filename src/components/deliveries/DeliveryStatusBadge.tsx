import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Upload } from 'lucide-react';
import type { DeliveryStatus } from '../../types';

const CONFIG: Record<DeliveryStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pendente: {
    label: 'Pendente',
    className: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
  },
  entregue: {
    label: 'Entregue',
    className: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: <Upload className="w-3.5 h-3.5 text-blue-600" />,
  },
  corrigida: {
    label: 'Corrigida',
    className: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  },
};

export const DeliveryStatusBadge: React.FC<{ status: DeliveryStatus; late?: boolean }> = ({ status, late }) => {
  const cfg = CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.className}`}
      >
        {cfg.icon}
        {cfg.label}
      </span>
      {late && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold bg-rose-50 text-rose-800 border-rose-300">
          <Clock className="w-3 h-3" />
          Fora do prazo
        </span>
      )}
    </span>
  );
};
