import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export interface SpreadsheetCellData {
  value: string;
  isHeader?: boolean;
  isFormula?: boolean;
  align?: 'left' | 'center' | 'right';
  highlight?: 'emerald' | 'rose' | 'amber' | 'blue' | 'selected';
}

interface SpreadsheetMockupProps {
  title?: string;
  formulaBar?: string;
  columns: string[];
  rows: SpreadsheetCellData[][];
  caption?: string;
}

export const SpreadsheetMockup: React.FC<SpreadsheetMockupProps> = ({
  title,
  formulaBar,
  columns,
  rows,
  caption,
}) => {
  const getHighlightClass = (highlight?: SpreadsheetCellData['highlight']) => {
    switch (highlight) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-900 font-semibold border-emerald-300';
      case 'rose':
        return 'bg-rose-50 text-rose-900 font-semibold border-rose-300';
      case 'amber':
        return 'bg-amber-50 text-amber-900 font-semibold border-amber-300';
      case 'blue':
        return 'bg-blue-50 text-blue-900 font-semibold border-blue-300';
      case 'selected':
        return 'spreadsheet-cell-selected font-semibold text-slate-900';
      default:
        return 'bg-white text-slate-800';
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs bg-white text-xs">
      {/* Topo do Arquivo ONLYOFFICE */}
      <div className="bg-slate-900 text-white px-3.5 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-xs tracking-tight text-slate-200">
            {title || 'ONLYOFFICE Planilha — Exemplo Prático'}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
          ONLYOFFICE
        </span>
      </div>

      {/* Barra de Fórmula */}
      {formulaBar && (
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-500 font-bold italic select-none">fx</span>
          <div className="w-px h-3.5 bg-slate-300" />
          <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            {formulaBar}
          </span>
        </div>
      )}

      {/* Grade de Células */}
      <div className="overflow-x-auto">
        <table className="w-full spreadsheet-grid">
          <thead>
            <tr>
              <th className="spreadsheet-header-row">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="spreadsheet-header-col py-1.5 px-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="spreadsheet-header-row text-[11px] font-bold text-slate-500">
                  {rowIdx + 1}
                </td>
                {row.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className={`spreadsheet-cell border ${getHighlightClass(cell.highlight)} ${
                      cell.isHeader ? 'font-bold bg-slate-100 text-slate-900 border-b-2 border-b-slate-400' : ''
                    } ${
                      cell.align === 'center'
                        ? 'text-center'
                        : cell.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda explicativa */}
      {caption && (
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 italic">
          💡 {caption}
        </div>
      )}
    </div>
  );
};

