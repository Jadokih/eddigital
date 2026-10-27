import React from 'react';
import type { Group, Problem } from '../types';
import {
  Users,
  GraduationCap,
  Briefcase,
  PlayCircle,
  Edit3,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface DashboardProps {
  group: Group;
  selectedProblem: Problem | null;
  onContinueActivity: () => void;
  onEditCompany: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  group,
  selectedProblem,
  onContinueActivity,
  onEditCompany,
  onLogout,
}) => {
  const membersList = group.members
    ? group.members.split(/[,;\n]+/).map((m) => m.trim()).filter(Boolean)
    : [];

  const getStatusConfig = (status: Group['status']) => {
    switch (status) {
      case 'concluida':
        return {
          label: 'Concluída',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-400',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'em_andamento':
        return {
          label: 'Em andamento',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-500',
          icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'nao_iniciada':
      default:
        return {
          label: 'Não iniciada',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
        };
    }
  };

  const statusInfo = getStatusConfig(group.status);
  const completedCount = group.completed_objectives?.length || 0;
  const totalCount = selectedProblem?.learningObjectives.length || 6;
  const progressPercent = selectedProblem
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Card Principal da Empresa (Estilo Neo-Editorial Image 1) */}
      <div className="neo-card p-6 sm:p-8">
        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
            {/* Logo e Identificação */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-900 shrink-0 bg-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-white">
                {group.logo_url ? (
                  <img
                    src={group.logo_url}
                    alt={group.company_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display font-bold text-xl sm:text-2xl tracking-wider text-white">
                    {group.company_name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-white border border-slate-900 text-slate-800 shadow-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
                    Turma {group.class_name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    {group.business_sector}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                  {group.company_name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Empresa fictícia • Educação Digital 2º Ano
                </p>
              </div>
            </div>

            {/* Badges de Etapa e Situação */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Etapa 1: Situação-Problema</span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-xs ${statusInfo.color}`}
              >
                {statusInfo.icon}
                <span>Situação: {statusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Descrição e Integrantes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 border-b-2 border-slate-900">
            <div className="lg:col-span-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display mb-2">
                Sobre a Empresa
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F5] p-4 rounded-2xl border border-slate-300">
                {group.description}
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                Integrantes da Equipe ({membersList.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {membersList.length > 0 ? (
                  membersList.map((member, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-medium border border-slate-300 shadow-xs"
                    >
                      {member}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Nenhum integrante cadastrado.</span>
                )}
              </div>
            </div>
          </div>

          {/* Status do Problema e Barra de Progresso */}
          {selectedProblem ? (
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Missão Selecionada:</span>
                <p className="text-base font-display font-bold text-slate-900">
                  Problema {selectedProblem.number} — {selectedProblem.title}
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>Habilidades Dominadas</span>
                  <span className="font-bold text-slate-900">
                    {completedCount} de {totalCount} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border-2 border-slate-900">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-6 flex items-center justify-between bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Seu grupo ainda não selecionou a missão prática de planilhas. Clique no botão abaixo para escolher.
                </span>
              </div>
            </div>
          )}

          {/* Botões de Ação do Painel */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onContinueActivity}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-[3px_3px_0px_#22c55e] cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{selectedProblem ? 'Continuar Atividade' : 'Iniciar Escolha da Missão'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onEditCompany}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Editar dados da empresa</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
