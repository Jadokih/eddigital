import React from 'react';
import type { Group } from '../types';
import { LogOut, Building2, LayoutDashboard, CheckCircle2, UploadCloud, Compass } from 'lucide-react';
import { BrandLogo } from './ui/BrandLogo';

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
  const hasSelectedProblem = !!currentGroup?.selected_problem_id;

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl px-4 sm:px-6 py-2.5 shadow-2xs flex items-center justify-between gap-4 transition-colors">
        {/* Marca / Nova Logo Autoral Prisma Grid */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="cursor-pointer select-none group"
        >
          <BrandLogo size="md" variant="full" theme="light" />
        </div>

        {/* Links Centrais de Navegação (Desktop) */}
        {currentGroup && onNavigate && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-slate-900 text-white font-medium shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel</span>
            </button>

            {/* Aba Missões: SÓ aparece se o grupo AINDA NÃO tiver escolhido uma missão */}
            {!hasSelectedProblem && (
              <button
                type="button"
                onClick={() => onNavigate('problems')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeSection === 'problems'
                    ? 'bg-slate-900 text-white font-medium shadow-2xs'
                    : 'hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Escolher Missão</span>
              </button>
            )}

            {hasSelectedProblem && (
              <button
                type="button"
                onClick={() => onNavigate('plan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeSection === 'plan'
                    ? 'bg-slate-900 text-white font-medium shadow-2xs'
                    : 'hover:text-slate-900 hover:bg-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trilha de Aulas</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('deliveries')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'deliveries'
                  ? 'bg-slate-900 text-white font-medium shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Entregas</span>
            </button>
          </nav>
        )}

        {/* Ação à Direita: Empresa & Sair */}
        <div className="flex items-center gap-2">
          {currentGroup ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[130px] truncate">{currentGroup.company_name}</span>
                <span className="text-xs font-mono text-slate-500">({currentGroup.class_name})</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Sair da sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 hidden sm:inline-block mr-1">
                Turmas 2º2 e 2º3
              </span>
              <a
                href="#auth-section"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
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
