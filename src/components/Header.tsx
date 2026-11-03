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
      <div className="max-w-6xl mx-auto bg-[#0A1224]/85 backdrop-blur-xl border border-white/10 rounded-xl px-4 sm:px-6 py-2.5 shadow-lg flex items-center justify-between gap-4 transition-colors">
        {/* Marca / Nova Logo Autoral Prisma Grid */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="cursor-pointer select-none group"
        >
          <BrandLogo size="md" variant="full" theme="dark" />
        </div>

        {/* Links Centrais de Navegação (Desktop) */}
        {currentGroup && onNavigate && (
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs font-medium text-slate-300">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-white/15 text-white font-semibold border border-white/15 shadow-2xs'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Painel</span>
            </button>

            {/* Aba Missões: SÓ aparece se o grupo AINDA NÃO tiver escolhido uma missão */}
            {!hasSelectedProblem && (
              <button
                type="button"
                onClick={() => onNavigate('problems')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeSection === 'problems'
                    ? 'bg-white/15 text-white font-semibold border border-white/15 shadow-2xs'
                    : 'hover:text-white hover:bg-white/10'
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
                    ? 'bg-white/15 text-white font-semibold border border-white/15 shadow-2xs'
                    : 'hover:text-white hover:bg-white/10'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trilha de Aulas</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('deliveries')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSection === 'deliveries'
                  ? 'bg-white/15 text-white font-semibold border border-white/15 shadow-2xs'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entregas</span>
            </button>
          </nav>
        )}

        {/* Ação à Direita: Empresa & Sair */}
        <div className="flex items-center gap-2">
          {currentGroup ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[130px] truncate">{currentGroup.company_name}</span>
                <span className="text-xs font-mono text-slate-400">({currentGroup.class_name})</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                title="Sair da sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 hidden sm:inline-block mr-1">
                Turmas 2º2 e 2º3
              </span>
              <a
                href="#auth-section"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
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
