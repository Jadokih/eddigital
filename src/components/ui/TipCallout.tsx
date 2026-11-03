import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface TipCalloutProps {
  type: 'tip' | 'warning' | 'success';
  title: string;
  children: React.ReactNode;
}

export const TipCallout: React.FC<TipCalloutProps> = ({ type, title, children }) => {
  const configs = {
    tip: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
      iconBg: 'bg-emerald-100 text-emerald-800',
      icon: <Lightbulb className="w-4 h-4" />,
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-950',
      iconBg: 'bg-amber-100 text-amber-800',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    success: {
      bg: 'bg-blue-50/80 border-blue-200 text-blue-950',
      iconBg: 'bg-blue-100 text-blue-800',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  };

  const cfg = configs[type];

  return (
    <div className={`p-4 rounded-2xl border ${cfg.bg} flex items-start gap-3 text-xs leading-relaxed`}>
      <div className={`p-2 rounded-xl shrink-0 ${cfg.iconBg}`}>
        {cfg.icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-sm tracking-tight">{title}</h4>
        <div className="text-slate-700 space-y-1">{children}</div>
      </div>
    </div>
  );
};

