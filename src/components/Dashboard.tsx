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
  Sparkles,
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
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
      case 'em_andamento':
        return {
          label: 'Em andamento',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          icon: <Clock className="w-4 h-4 text-blue-600" />,
        };
      case 'nao_iniciada':
      default:
        return {
          label: 'Não iniciada',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
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
    <div className="space-y-6">
      {/* Card Principal da Empresa */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/60 via-purple-100/30 to-transparent rounded-bl-full pointer-events-none -z-0" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            {/* Logo e Identificação */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-slate-200 shrink-0 bg-slate-100 flex items-center justify-center">
                {group.logo_url ? (
                  <img
                    src={group.logo_url}
                    alt={group.company_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl">
                    {group.company_name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Turma {group.class_name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <Briefcase className="w-3.5 h-3.5" />
                    {group.business_sector}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {group.company_name}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  Empresa fictícia cadastrada na disciplina de Educação Digital
                </p>
              </div>
            </div>

            {/* Badges de Etapa e Situação */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 w-full lg:w-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50/80 text-indigo-900 border border-indigo-200 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Etapa Atual: Educação Digital — Etapa 1</span>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${statusInfo.color}`}
              >
                {statusInfo.icon}
                <span>Situação: {statusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Descrição e Integrantes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 border-b border-slate-100">
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sobre a Empresa
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {group.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Integrantes da Equipe ({membersList.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {membersList.length > 0 ? (
                  membersList.map((member, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
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
                <span className="text-xs font-semibold text-slate-500">Problema Selecionado:</span>
                <p className="text-sm font-bold text-slate-800">
                  Problema {selectedProblem.number} — {selectedProblem.title}
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Progresso da Etapa 1</span>
                  <span className="font-bold text-indigo-600">
                    {completedCount} de {totalCount} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-6 flex items-center justify-between bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Seu grupo ainda não selecionou um problema real para resolver com ferramentas digitais.
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer group"
              >
                <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{selectedProblem ? 'Continuar Atividade' : 'Iniciar Escolha do Problema'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onEditCompany}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-200 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Editar dados da empresa</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
