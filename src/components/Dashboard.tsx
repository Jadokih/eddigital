import React from 'react';
import type { Group, Problem } from '../types';
import {
  PlayCircle,
  Edit3,
  ArrowRight,
  UploadCloud,
  FileSpreadsheet,
  Target,
  Sparkles,
  Compass,
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
    ? group.members
        .split(/[,;\n]+|\s[eE]\s/)
        .map((m) => m.trim().replace(/^[\s.]+|[\s.]+$/g, ''))
        .filter(Boolean)
    : [];

  const completedCount = group.completed_objectives?.length || 0;
  const totalCount = selectedProblem?.learningObjectives.length || 9;
  const progressPercent = selectedProblem
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  // Próxima aula não concluída
  const nextObjective = selectedProblem?.learningObjectives.find(
    (obj) => !(group.completed_objectives || []).includes(obj.id)
  ) || selectedProblem?.learningObjectives[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* 1. HERO DA EMPRESA: IDENTIFICAÇÃO EDITORIAL CLARA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-5 border-b border-slate-200/80">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Logo da Empresa */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900 flex items-center justify-center text-white shadow-sm">
              {group.logo_url ? (
                <img
                  src={group.logo_url}
                  alt={group.company_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-serif font-medium text-2xl tracking-wider text-emerald-400"
                  style={{ fontFamily: "'Newsreader', serif" }}
                >
                  {group.company_name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  Turma {group.class_name}
                </span>
                {selectedProblem && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300">
                    {selectedProblem.shortTitle}
                  </span>
                )}
                <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                  • {group.business_sector}
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-900 tracking-tight font-semibold"
                style={{ fontFamily: "'Newsreader', serif" }}
              >
                {group.company_name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-normal leading-relaxed">
                {group.description || 'Laboratório de Empreendedorismo Digital • Ensino Médio'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditCompany}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Editar perfil</span>
          </button>
        </div>

        {/* Sócios Fundadores em linha limpa */}
        {membersList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-800">Fundadores:</span>
            {membersList.map((member, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-800 font-medium border border-slate-200"
              >
                {member}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. GRID PRINCIPAL: ATIVIDADE DO DIA (ESQUERDA) + METAS DE APRENDIZAGEM (DIREITA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Ação: Atividade do Dia */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between gap-6 border-l-4 border-l-emerald-600">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>O que sua empresa precisa fazer agora?</span>
            </div>

            <h3
              className="text-xl sm:text-2xl font-serif text-slate-900 tracking-tight font-semibold leading-snug"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              {selectedProblem
                ? progressPercent === 100
                  ? 'Todas as metas dominadas: faça a entrega da planilha'
                  : nextObjective?.title || 'Continuar atividade de planilhas'
                : 'Selecione a situação-problema da sua empresa'}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {selectedProblem
                ? progressPercent === 100
                  ? 'Sua equipe completou todas as habilidades e desafios da Etapa 1. Salve o arquivo em formato .xlsx e faça a submissão na Central de Entregas.'
                  : nextObjective?.description ||
                    `Sua equipe já completou ${completedCount} de ${totalCount} habilidades de planilha. Acesse a trilha com passos ilustrados no ONLYOFFICE.`
                : 'Defina qual situação-problema sua empresa vai resolver com planilhas para liberar a trilha de aulas e desafios práticos.'}
            </p>
          </div>

          {/* Botões de Ação com Alto Contraste */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {selectedProblem && progressPercent === 100 && onNavigateDeliveries ? (
              <button
                type="button"
                onClick={onNavigateDeliveries}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Entregar planilha (.xlsx)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onContinueActivity}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{selectedProblem ? 'Abrir Plano de Aulas' : 'Escolher Missão da Empresa'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onNavigateDeliveries && selectedProblem && (
              <button
                type="button"
                onClick={onNavigateDeliveries}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Ver Minhas Entregas</span>
              </button>
            )}
          </div>
        </div>

        {/* Painel Lateral: Metas de Aprendizagem da Empresa */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Status da Aprendizagem
              </span>
              <Target className="w-4 h-4 text-emerald-700" />
            </div>

            {selectedProblem ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Habilidades Dominadas</span>
                  <span className="text-base text-emerald-800 tabular-nums">{progressPercent}%</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  <strong className="text-slate-900 font-bold">{completedCount}</strong> de{' '}
                  <strong className="text-slate-900 font-bold">{totalCount}</strong> aulas e desafios concluídos pela turma.
                </p>

                {/* Meta prática da empresa */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    Meta da Empresa:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {selectedProblem.objective}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <p className="font-bold">Missão Pendente</p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Escolha um dos 4 desafios de planilhas para liberar a trilha de aulas do grupo.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Suíte ONLYOFFICE
            </span>
            <span className="text-[11px] uppercase font-bold text-slate-700">Etapa 1 de 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
