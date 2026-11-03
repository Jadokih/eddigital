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
    <div className="space-y-3 pt-2">
      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        Confira seu resultado (autoavaliação da equipe)
      </h4>
      <div className="space-y-1 divide-y divide-zinc-100">
        {items.map((item, idx) => {
          const checked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              onClick={() => onToggleItem(idx)}
              className={`flex items-start gap-3 py-2.5 px-2 rounded-lg text-xs cursor-pointer transition-colors ${
                checked
                  ? 'text-zinc-900 font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/70'
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
              <span className={`leading-relaxed ${checked ? 'line-through text-zinc-400' : ''}`}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

