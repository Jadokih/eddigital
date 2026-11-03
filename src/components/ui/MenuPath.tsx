import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuPathProps {
  steps: string[];
}

export const MenuPath: React.FC<MenuPathProps> = ({ steps }) => {
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 p-1 px-2.5 rounded-lg bg-slate-900 text-white text-xs font-normal">
      <span className="text-xs text-slate-400 mr-0.5">Onde clicar:</span>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 font-medium border border-slate-700/80">
            {step}
          </span>
          {idx < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
        </React.Fragment>
      ))}
    </div>
  );
};

