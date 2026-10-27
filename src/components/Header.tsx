import React from 'react';
import type { Group } from '../types';
import { LogOut, Building2, Users, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentGroup: Group | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentGroup, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Marca & Identidade Institucional */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                Founders<span className="text-indigo-600 font-extrabold">Grid</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Educação Digital
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Atividade Curricular • Turmas 2º2 e 2º3
            </p>
          </div>
        </div>

        {/* Informações do Grupo Ativo & Ações */}
        <div className="flex items-center gap-3">
          {currentGroup && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  {currentGroup.company_name}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  Turma {currentGroup.class_name}
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                title="Sair da sessão do grupo"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
