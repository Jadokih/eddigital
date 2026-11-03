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
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white/75 backdrop-blur-xl border border-zinc-900/8 rounded-full px-5 sm:px-6 py-2.5 shadow-[0_4px_24px_-4px_rgba(24,24,27,0.04)] flex items-center justify-between gap-4 transition-colors">
        {/* Marca / Nova Logo Autoral Prisma Grid */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="cursor-pointer select-none group"
        >
          <BrandLogo size="md" variant="full" theme="light" />
        </div>

        {/* Links Centrais de Navegação em Liquid Glass Suave (Desktop) */}
        {currentGroup && onNavigate && (
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/70 p-1 rounded-full border border-zinc-200/60 text-xs text-zinc-600 font-normal">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-zinc-900 text-white font-medium shadow-xs'
                  : 'hover:text-zinc-900 hover:bg-white/90'
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeSection === 'problems'
                    ? 'bg-zinc-900 text-white font-medium shadow-xs'
                    : 'hover:text-zinc-900 hover:bg-white/90'
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeSection === 'plan'
                    ? 'bg-zinc-900 text-white font-medium shadow-xs'
                    : 'hover:text-zinc-900 hover:bg-white/90'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Trilha de Aulas</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('deliveries')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeSection === 'deliveries'
                  ? 'bg-zinc-900 text-white font-medium shadow-xs'
                  : 'hover:text-zinc-900 hover:bg-white/90'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
              <span>Entregas</span>
            </button>
          </nav>
        )}

        {/* Ação à Direita: Empresa & Sair */}
        <div className="flex items-center gap-2">
          {currentGroup ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100/70 border border-zinc-200/80 text-xs font-normal text-zinc-800">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                <span className="max-w-[130px] truncate">{currentGroup.company_name}</span>
                <span className="text-[11px] font-mono text-zinc-400">({currentGroup.class_name})</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Sair da sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 hidden sm:inline-block mr-1">
                Turmas 2º2 e 2º3
              </span>
              <a
                href="#auth-section"
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
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
