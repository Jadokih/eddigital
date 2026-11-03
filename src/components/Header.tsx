import React from 'react';
import type { Group } from '../types';
import { LogOut, Building2, LayoutDashboard, FileSpreadsheet, CheckCircle2, UploadCloud } from 'lucide-react';

interface HeaderProps {
  currentGroup: Group | null;
  onLogout: () => void;
  activeSection?: 'dashboard' | 'problems' | 'plan' | 'deliveries';
  onNavigate?: (section: 'dashboard' | 'problems' | 'plan' | 'deliveries') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGroup,
  onLogout,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-4 sm:px-6 py-2 shadow-xs flex items-center justify-between gap-4 transition-colors">
        {/* Marca / Logo */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 text-base sm:text-lg tracking-tight">
              Founders<span className="text-emerald-600">Grid</span>
            </span>
            <span className="hidden md:inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              Educação Digital
            </span>
          </div>
        </div>

        {/* Links Centrais de Navegação (Desktop) */}
        {currentGroup && onNavigate && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('problems')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'problems'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Missões</span>
            </button>

            {currentGroup.selected_problem_id && (
              <button
                type="button"
                onClick={() => onNavigate('plan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeSection === 'plan'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Plano de Aulas</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('deliveries')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'deliveries'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Entregas</span>
            </button>
          </nav>
        )}

        {/* Ação à Direita: Empresa & Sair */}
        <div className="flex items-center gap-2">
          {currentGroup ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[130px] truncate">{currentGroup.company_name}</span>
                <span className="text-xs font-bold text-slate-600">({currentGroup.class_name})</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Sair da sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
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
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Acessar Plataforma
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
