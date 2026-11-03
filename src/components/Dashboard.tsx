import React from 'react';
import type { Group, Problem } from '../types';
import {
  Users,
  GraduationCap,
  Briefcase,
  PlayCircle,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  UploadCloud,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';

interface DashboardProps {
  group: Group;
  selectedProblem: Problem | null;
  onContinueActivity: () => void;
  onEditCompany: () => void;
  onNavigateDeliveries?: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  group,
  selectedProblem,
  onContinueActivity,
  onEditCompany,
  onNavigateDeliveries,
}) => {
  const membersList = group.members
    ? group.members.split(/[,;\n]+|\s[eE]\s/).map((m) => m.trim().replace(/^[\s.]+|[\s.]+$/g, '')).filter(Boolean)
    : [];

  const getStatusConfig = (status: Group['status']) => {
    switch (status) {
      case 'concluida':
        return {
          label: 'Etapa 1 Concluída',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'em_andamento':
        return {
          label: 'Em Andamento',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'nao_iniciada':
      default:
        return {
          label: 'Não Iniciada',
          color: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
        };
    }
  };

  const statusInfo = getStatusConfig(group.status);
  const completedCount = group.completed_objectives?.length || 0;
  const totalCount = selectedProblem?.learningObjectives.length || 9;
  const progressPercent = selectedProblem
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. PERGUNTA: QUAL É A MINHA EMPRESA? (Perfil e Identidade) */}
      <div className="ed-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Logo da Empresa */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900 shadow-xs flex items-center justify-center text-white">
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
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                  Turma {group.class_name}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {group.business_sector}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                {group.company_name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Laboratório de Empreendedorismo Digital • 2º Ano Ensino Médio
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusInfo.color}`}
            >
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </span>

            <button
              type="button"
              onClick={onEditCompany}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Editar Perfil</span>
            </button>
          </div>
        </div>

        {/* Informações da Equipe e Proposta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
              Proposta de Valor da Empresa
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F5] p-4 rounded-xl border border-slate-200">
              {group.description || 'Nenhuma descrição informada pela equipe.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Sócios Fundadores ({membersList.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {membersList.length > 0 ? (
                membersList.map((member, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-800 text-xs font-medium border border-slate-200 shadow-2xs"
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
      </div>

      {/* 2 & 3. PERGUNTAS: EM QUE ETAPA ESTAMOS? E O QUE FAZER AGORA? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Card de Ação Principal em Destaque (Call to Action Primário) */}
        <div className="md:col-span-2 ed-card p-6 sm:p-7 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>O que sua empresa precisa fazer agora?</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              {selectedProblem
                ? progressPercent === 100
                  ? 'Metas 100% Concluídas! Envie sua Planilha'
                  : `Continuar a Missão: ${selectedProblem.shortTitle}`
                : 'Definir a Situação-Problema da Empresa'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {selectedProblem
                ? progressPercent === 100
                  ? 'Sua equipe dominou todos os fundamentos e desafios. Salve seu arquivo no formato .xlsx e faça o envio na Central de Entregas.'
                  : `Sua equipe já completou ${completedCount} de ${totalCount} habilidades de planilha. Acesse a trilha com passos ilustrados no ONLYOFFICE.`
                : 'Cada empresa deve escolher um desafio real de mercado (Finanças, Estoque, Prazos ou Cadastros) para resolver ao longo do ano letivo.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {selectedProblem && progressPercent === 100 && onNavigateDeliveries ? (
              <button
                type="button"
                onClick={onNavigateDeliveries}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Ir para a Central de Entregas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onContinueActivity}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{selectedProblem ? 'Abrir Plano de Aulas' : 'Escolher Missão da Empresa'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onNavigateDeliveries && selectedProblem && progressPercent < 100 && (
              <button
                type="button"
                onClick={onNavigateDeliveries}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                <span>Ver Minhas Entregas</span>
              </button>
            )}
          </div>
        </div>

        {/* Painel Lateral: Métricas de Aprendizagem */}
        <div className="ed-card p-6 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display block">
              Status da Aprendizagem
            </span>

            {selectedProblem ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Habilidades Dominadas</span>
                  <span className="font-bold text-slate-900">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  {completedCount} de {totalCount} aulas e desafios concluídos pela turma.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">Missão Pendente</p>
                <p className="text-[11px] text-amber-800">
                  Escolha um dos 4 desafios de planilhas para liberar a trilha de aulas do grupo.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              Suíte ONLYOFFICE
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Etapa 1 de 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
