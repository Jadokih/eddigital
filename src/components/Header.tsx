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
      <div className="max-w-5xl mx-auto bg-white border border-zinc-200/60 rounded-xl px-5 sm:px-6 py-3 shadow-[0_2px_10px_-3px_rgba(24,24,27,0.03)] flex items-center justify-between gap-6 transition-all">
        {/* 1. Marca / Logo Autoral Founders Grid */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="cursor-pointer select-none"
        >
          <BrandLogo size="md" variant="full" theme="light" />
        </div>

        {/* 2. Navegação Central Editorial (Sem cápsula cinza, sem fundos individuais) */}
        {currentGroup && onNavigate && (
          <nav className="hidden md:flex items-center gap-7 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`relative flex items-center gap-1.5 py-1.5 transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 font-normal'
              }`}
            >
              <LayoutDashboard className={`w-3.5 h-3.5 transition-colors ${
                activeSection === 'dashboard' ? 'text-zinc-950' : 'text-zinc-400'
              }`} />
              <span>Painel</span>
              {activeSection === 'dashboard' && (
                <span className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-zinc-900 rounded-full animate-in fade-in duration-150" />
              )}
            </button>

            {/* Aba Missões: SÓ aparece se o grupo AINDA NÃO tiver escolhido uma missão */}
            {!hasSelectedProblem && (
              <button
                type="button"
                onClick={() => onNavigate('problems')}
                className={`relative flex items-center gap-1.5 py-1.5 transition-colors cursor-pointer ${
                  activeSection === 'problems'
                    ? 'text-zinc-950 font-medium'
                    : 'text-zinc-500 hover:text-zinc-800 font-normal'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 transition-colors ${
                  activeSection === 'problems' ? 'text-zinc-950' : 'text-zinc-400'
                }`} />
                <span>Escolher Missão</span>
                {activeSection === 'problems' && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-zinc-900 rounded-full animate-in fade-in duration-150" />
                )}
              </button>
            )}

            {hasSelectedProblem && (
              <button
                type="button"
                onClick={() => onNavigate('plan')}
                className={`relative flex items-center gap-1.5 py-1.5 transition-colors cursor-pointer ${
                  activeSection === 'plan'
                    ? 'text-zinc-950 font-medium'
                    : 'text-zinc-500 hover:text-zinc-800 font-normal'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${
                  activeSection === 'plan' ? 'text-zinc-950' : 'text-zinc-400'
                }`} />
                <span>Trilha de Aulas</span>
                {activeSection === 'plan' && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-zinc-900 rounded-full animate-in fade-in duration-150" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('deliveries')}
              className={`relative flex items-center gap-1.5 py-1.5 transition-colors cursor-pointer ${
                activeSection === 'deliveries'
                  ? 'text-zinc-950 font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 font-normal'
              }`}
            >
              <UploadCloud className={`w-3.5 h-3.5 transition-colors ${
                activeSection === 'deliveries' ? 'text-zinc-950' : 'text-zinc-400'
              }`} />
              <span>Entregas</span>
              {activeSection === 'deliveries' && (
                <span className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-zinc-900 rounded-full animate-in fade-in duration-150" />
              )}
            </button>
          </nav>
        )}

        {/* 3. Identificação da Empresa & Ação de Saída */}
        <div className="flex items-center gap-4">
          {currentGroup ? (
            <div className="flex items-center gap-4">
              {/* Identificação textual simples, sem cápsula */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 font-normal">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                <span className="max-w-[140px] truncate text-zinc-800 font-medium">
                  {currentGroup.company_name}
                </span>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-500">Turma {currentGroup.class_name}</span>
              </div>

              {/* Link de Sair discreto com ícone, sem borda ou fundo */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                title="Sair da sessão"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline font-normal">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 hidden sm:inline-block">
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
