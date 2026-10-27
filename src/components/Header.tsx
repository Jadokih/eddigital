import React from 'react';
import type { Group } from '../types';
import { LogOut, Building2 } from 'lucide-react';

interface HeaderProps {
  currentGroup: Group | null;
  onLogout: () => void;
  activeSection?: 'dashboard' | 'problems' | 'plan';
  onNavigate?: (section: 'dashboard' | 'problems' | 'plan') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGroup,
  onLogout,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-full px-4 sm:px-6 py-2.5 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-between gap-4 transition-all">
        {/* Marca / Logo no estilo LOOO */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-slate-900 text-base sm:text-lg tracking-tight">
              Founders<span className="text-emerald-600">Grid</span>
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-600">
              Ed. Digital
            </span>
          </div>
        </div>

        {/* Links Centrais de Navegação (estilo Image 1 e 2) */}
        {currentGroup && onNavigate && (
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Painel
            </button>
            <button
              type="button"
              onClick={() => onNavigate('problems')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeSection === 'problems'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Missões
            </button>
            {currentGroup.selected_problem_id && (
              <button
                type="button"
                onClick={() => onNavigate('plan')}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeSection === 'plan'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Plano de Metas
              </button>
            )}
          </nav>
        )}

        {/* Ação à Direita (Pill Button estilo Image 1 e 2) */}
        <div className="flex items-center gap-2">
          {currentGroup ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-slate-700" />
                <span className="max-w-[120px] truncate">{currentGroup.company_name}</span>
                <span className="text-[10px] text-slate-500">({currentGroup.class_name})</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sair da sessão"
              >
                <LogOut className="w-3 h-3 text-slate-700" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block mr-1">
                Turmas 2º2 e 2º3
              </span>
              <a
                href="#auth-section"
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-[2px_2px_0px_0px_#22c55e]"
              >
                Começar Agora
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
