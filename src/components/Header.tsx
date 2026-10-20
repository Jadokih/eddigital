import React from 'react';
import type { Group } from '../types';
import { LogOut, Database, Building2, Users } from 'lucide-react';

interface HeaderProps {
  currentGroup: Group | null;
  onLogout: () => void;
  onOpenConfig: () => void;
  isSupabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentGroup,
  onLogout,
  onOpenConfig,
  isSupabaseConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Marca & Identidade */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" fill="currentColor"/>
              <path d="M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z" fill="currentColor"/>
              <path d="M4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4z" fill="currentColor"/>
              <path d="M14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z" fill="currentColor" fillOpacity="0.5"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                Founders<span className="text-indigo-600">Grid</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Educação Digital
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">
              Projeto de Empresa • Turmas 2º2 e 2º3
            </p>
          </div>
        </div>

        {/* Ações da Direita */}
        <div className="flex items-center gap-3">
          {/* Status do Supabase */}
          <button
            onClick={onOpenConfig}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSupabaseConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80 animate-pulse'
            }`}
            title="Clique para configurar o banco de dados Supabase e ver scripts SQL"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSupabaseConnected ? 'Supabase Conectado' : 'Supabase Demo'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Dados do Grupo Ativo & Logout */}
          {currentGroup && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                  <Building2 className="w-3 h-3 text-indigo-600" />
                  {currentGroup.company_name}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                  <Users className="w-3 h-3" />
                  Turma {currentGroup.class_name}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
                title="Sair da conta do grupo"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
