import React from 'react';
import { Check } from 'lucide-react';

interface SelfChecklistProps {
  items: string[];
  checkedItems: boolean[];
  onToggleItem: (index: number) => void;
}

export const SelfChecklist: React.FC<SelfChecklistProps> = ({
  items,
  checkedItems,
  onToggleItem,
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
        <span>Confira seu resultado (autoavaliação da equipe)</span>
      </h4>
      <div className="space-y-1.5">
        {items.map((item, idx) => {
          const checked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              onClick={() => onToggleItem(idx)}
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                checked
                  ? 'bg-zinc-100/90 border-zinc-300 text-zinc-900 font-medium'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  checked
                    ? 'bg-zinc-900 border-zinc-900 text-white'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                {checked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="leading-relaxed">{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

