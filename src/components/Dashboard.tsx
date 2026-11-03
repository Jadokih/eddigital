import React from 'react';
import type { Group, Problem } from '../types';
import {
  PlayCircle,
  Edit3,
  ArrowRight,
  UploadCloud,
  FileSpreadsheet,
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
    <div className="space-y-12 max-w-5xl mx-auto py-6">
      {/* 1. IDENTIFICAÇÃO EDITORIAL DA EMPRESA (ESTRUTURA ABERTA) */}
      <section className="space-y-4 pb-8 border-b border-zinc-200/70">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Logo da Empresa */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-zinc-200/80 shrink-0 bg-zinc-900 flex items-center justify-center text-white shadow-2xs">
              {group.logo_url ? (
                <img
                  src={group.logo_url}
                  alt={group.company_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-serif font-normal text-2xl tracking-wider text-zinc-300"
                  style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                >
                  {group.company_name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-normal">
                <span>Turma {group.class_name}</span>
                <span>•</span>
                <span>{group.business_sector}</span>
                {selectedProblem && (
                  <>
                    <span>•</span>
                    <span className="text-zinc-800 font-medium">{selectedProblem.shortTitle}</span>
                  </>
                )}
              </div>

              <h2
                className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight font-normal"
                style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
              >
                {group.company_name}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 max-w-xl font-normal leading-relaxed">
                {group.description || 'Laboratório de Empreendedorismo Digital • Ensino Médio'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditCompany}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium border border-zinc-200/80 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Editar perfil</span>
          </button>
        </div>

        {/* Sócios Fundadores em linha de texto pura */}
        {membersList.length > 0 && (
          <div className="text-xs text-zinc-500 flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-1">
            <span className="font-medium text-zinc-700">Equipe fundadora:</span>
            <span>{membersList.join(' • ')}</span>
          </div>
        )}
      </section>

      {/* 2. ATIVIDADE DO DIA (DESTAQUE MÁXIMO EM LAYOUT ABERTO, SEM CARD) */}
      <section className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span>Atividade do Dia</span>
          </div>

          <h3
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-zinc-950 tracking-tight font-normal leading-[1.15]"
            style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
          >
            {selectedProblem
              ? progressPercent === 100
                ? 'Todas as metas dominadas: faça a entrega da planilha'
                : nextObjective?.title || 'Continuar atividade de planilhas'
              : 'Selecione a situação-problema da sua empresa'}
          </h3>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal max-w-2xl">
            {selectedProblem
              ? progressPercent === 100
                ? 'Sua equipe completou todas as habilidades e desafios da Etapa 1. Salve o arquivo em formato .xlsx e faça a submissão na Central de Entregas.'
                : nextObjective?.description ||
                  `Sua equipe já completou ${completedCount} de ${totalCount} habilidades de planilha. Acesse a trilha com passos ilustrados no ONLYOFFICE.`
              : 'Defina qual situação-problema sua empresa vai resolver com planilhas para liberar a trilha de aulas e desafios práticos.'}
          </p>
        </div>

        {/* Ações Diretas Posicionadas Logo Abaixo */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {selectedProblem && progressPercent === 100 && onNavigateDeliveries ? (
            <button
              type="button"
              onClick={onNavigateDeliveries}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Entregar planilha (.xlsx)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinueActivity}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm transition-all cursor-pointer shadow-sm hover:shadow"
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-transparent hover:bg-zinc-100/80 text-zinc-700 hover:text-zinc-950 text-sm font-normal transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-zinc-400" />
              <span>Ver Minhas Entregas</span>
            </button>
          )}
        </div>
      </section>

      {/* 3. FAIXA DE PROGRESSO E META PEDAGÓGICA (INTEGRADA, SEM FUNDO DE CARD) */}
      <section className="pt-8 border-t border-zinc-200/70">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Progresso com destaque em Verde */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
                Progresso da Empresa
              </span>
              <span
                className="text-3xl font-serif text-zinc-950 tabular-nums font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {progressPercent}%
              </span>
            </div>

            {/* Barra de progresso com verde esmeralda de conquista */}
            <div className="w-full bg-zinc-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-zinc-500 font-normal">
              <span className="text-zinc-900 font-medium">{completedCount}</span> de{' '}
              <span className="text-zinc-900 font-medium">{totalCount}</span> aulas e desafios concluídos
            </p>
          </div>

          {/* Meta Pedagógica Contextual */}
          <div className="md:col-span-7 md:border-l md:border-zinc-200/60 md:pl-8 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-zinc-400 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Meta Pedagógica da Empresa</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              {selectedProblem
                ? selectedProblem.objective
                : 'Selecione um desafio de planilhas para liberar a trilha de aulas e metas da sua empresa.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400 font-normal">
              <span className="flex items-center gap-1.5 text-zinc-600">
                <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-400" />
                Suíte ONLYOFFICE
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] uppercase">Etapa 1 de 3</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
