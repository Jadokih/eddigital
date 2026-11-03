import React, { useEffect, useState } from 'react';
import type { Group, Problem, Activity, Submission } from '../types';
import {
  CheckSquare,
  Square,
  ArrowLeftRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  PlayCircle,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLessonById } from '../data/lessonsData';
import { LessonModal } from './learning/LessonModal';
import {
  getGroupClient,
  fetchGroupActivities,
  fetchMySubmissions,
  formatDateTime,
  formatScore,
} from '../lib/deliveries';

interface LearningPlanProps {
  group: Group;
  problem: Problem;
  onToggleObjective: (objectiveId: string) => Promise<void>;
  onChangeProblem: () => void;
  onNavigateDeliveries?: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const LearningPlan: React.FC<LearningPlanProps> = ({
  group,
  problem,
  onToggleObjective,
  onChangeProblem,
  onNavigateDeliveries,
  showToast,
}) => {
  const completedList = Array.isArray(group.completed_objectives)
    ? group.completed_objectives
    : [];
  const totalCount = problem.learningObjectives.length;
  const completedCount = completedList.filter((id) =>
    problem.learningObjectives.some((obj) => obj.id === id)
  ).length;

  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  // Separação entre Aprendendo o básico (6) e Agora é com você (3)
  const commonObjectives = problem.learningObjectives.filter((o) => o.scope === 'comum');
  const specificObjectives = problem.learningObjectives.filter((o) => o.scope === 'especifico');

  const commonCompletedCount = commonObjectives.filter((o) => completedList.includes(o.id)).length;
  const specificCompletedCount = specificObjectives.filter((o) => completedList.includes(o.id)).length;

  // Filtro de visualização da trilha
  const [filterPhase, setFilterPhase] = useState<'all' | 'common' | 'specific' | 'delivery'>('all');

  // Estado da Aula Ativa aberta no Modal
  const [activeObjectiveId, setActiveObjectiveId] = useState<string | null>(null);

  // Informações de entrega do dia carregadas do servidor
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDeliveryInfo = async () => {
      if (!getGroupClient()) return;
      try {
        const [acts, subs] = await Promise.all([
          fetchGroupActivities(),
          fetchMySubmissions(),
        ]);
        if (!isMounted) return;
        if (acts.length > 0) {
          setActiveActivity(acts[0]);
          const currentSub = subs.find((s) => s.activity_id === acts[0].id && s.is_current);
          setLatestSubmission(currentSub || null);
        }
      } catch {
        // Fallback silencioso para modo offline
      }
    };
    loadDeliveryInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  // Encontra a próxima aula não concluída
  const nextPendingObjective =
    problem.learningObjectives.find((o) => !completedList.includes(o.id)) ||
    problem.learningObjectives[0];

  const handleToggle = async (objId: string) => {
    try {
      await onToggleObjective(objId);
      const isNowCompleted = !completedList.includes(objId);
      if (isNowCompleted && completedCount + 1 === totalCount) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
        });
        showToast(
          'success',
          'Etapa 1 Concluída com Sucesso!',
          'Parabéns! Sua empresa concluiu 100% das metas pedagógicas da Etapa 1.'
        );
      }
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar meta.');
    }
  };

  const activeLessonData = activeObjectiveId ? getLessonById(activeObjectiveId) : null;
  const currentObjectiveIndex = activeObjectiveId
    ? problem.learningObjectives.findIndex((o) => o.id === activeObjectiveId)
    : -1;

  const handleNavigateLesson = (direction: 'prev' | 'next') => {
    if (currentObjectiveIndex === -1) return;
    const newIndex = direction === 'next' ? currentObjectiveIndex + 1 : currentObjectiveIndex - 1;
    if (newIndex >= 0 && newIndex < problem.learningObjectives.length) {
      setActiveObjectiveId(problem.learningObjectives[newIndex].id);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* 1. CABEÇALHO EDITORIAL ABERTO (SEM CAIXA REDUNDANTE) */}
      <section className="space-y-4 pb-6 border-b border-zinc-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-normal text-zinc-500 uppercase tracking-wider block mb-1">
              Trilha de aprendizagem • ONLYOFFICE
            </span>
            <h3
              className="text-3xl sm:text-4xl font-serif font-normal text-zinc-900 tracking-tight"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              Metas de aprendizagem da empresa
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed font-normal">
              Domine os 6 fundamentos essenciais ensinados em aula com o professor e aplique os 3 desafios práticos na
              sua empresa fictícia (<span className="text-zinc-800 font-medium">{problem.shortTitle}</span>).
            </p>
          </div>

          <button
            type="button"
            onClick={onChangeProblem}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium border border-zinc-200 transition-colors cursor-pointer self-start md:self-auto shrink-0"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-400" />
            <span>Trocar missão</span>
          </button>
        </div>

        {/* 2. CARD ÚNICO DE DESTAQUE: PRÓXIMA AÇÃO RECOMENDADA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 sm:p-7 rounded-2xl liquid-glass-dark text-white shadow-sm">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs font-normal text-zinc-400 uppercase tracking-wider">
              Próxima ação recomendada
            </span>
            <h4
              className="text-xl sm:text-2xl font-serif font-normal text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              {isAllCompleted
                ? 'Metas concluídas: envie sua planilha do dia'
                : nextPendingObjective?.title}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-xl">
              {isAllCompleted
                ? 'Sua equipe completou todas as habilidades e desafios. Salve seu arquivo no formato .xlsx e faça a entrega da atividade.'
                : 'Abra o passo a passo objetivo com instruções detalhadas de menus e fórmulas no ONLYOFFICE.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center gap-3">
            {isAllCompleted && onNavigateDeliveries ? (
              <button
                type="button"
                onClick={onNavigateDeliveries}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Entregar planilha (.xlsx)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : nextPendingObjective ? (
              <button
                type="button"
                onClick={() => setActiveObjectiveId(nextPendingObjective.id)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Continuar aula</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}

            <div className="w-full md:w-52 space-y-1">
              <div className="flex justify-between text-xs text-zinc-400 font-normal">
                <span>Progresso total</span>
                <span className="font-serif text-white tabular-nums font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {percent}%
                </span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NAVEGAÇÃO ENTRE FASES (ABAS DIRETAS NO LAYOUT) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-normal">
          <button
            type="button"
            onClick={() => setFilterPhase('all')}
            className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
              filterPhase === 'all'
                ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100/70 hover:bg-zinc-100'
            }`}
          >
            Trilha completa ({totalCount + 1})
          </button>
          <button
            type="button"
            onClick={() => setFilterPhase('common')}
            className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
              filterPhase === 'common'
                ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100/70 hover:bg-zinc-100'
            }`}
          >
            1. Fundamentos em aula ({commonCompletedCount}/{commonObjectives.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPhase('specific')}
            className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
              filterPhase === 'specific'
                ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100/70 hover:bg-zinc-100'
            }`}
          >
            2. Desafios da empresa ({specificCompletedCount}/{specificObjectives.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPhase('delivery')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
              filterPhase === 'delivery'
                ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 bg-zinc-100/70 hover:bg-zinc-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
            <span>3. Entrega do dia</span>
          </button>
        </div>

        <div className="text-xs text-zinc-500 font-normal">
          Turma {group.class_name} • {completedCount} de {totalCount} habilidades concluídas
        </div>
      </div>

      {/* FASE 1: APRENDENDO O BÁSICO (6 FUNDAMENTOS EM AULA) */}
      {(filterPhase === 'all' || filterPhase === 'common') && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200/60 text-zinc-600 flex items-center justify-center text-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className="text-base font-serif font-normal text-zinc-900"
                  style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                >
                  1. Aprendendo o básico
                </h4>
                <p className="text-xs text-zinc-500 font-normal">
                  Fundamentos ensinados pelo professor em aula para toda a turma
                </p>
              </div>
            </div>

            <span className="text-xs font-normal px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/60 text-zinc-700 self-start sm:self-auto tabular-nums">
              {commonCompletedCount} de {commonObjectives.length} aulas dominadas
            </span>
          </div>

          <div className="divide-y divide-zinc-100 bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xs">
            {commonObjectives.map((obj, index) => {
              const isCompleted = completedList.includes(obj.id);
              const isCurrent = !isCompleted && nextPendingObjective?.id === obj.id;
              const lesson = getLessonById(obj.id);

              return (
                <div
                  key={obj.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                    isCompleted
                      ? 'bg-zinc-50/30'
                      : isCurrent
                      ? 'bg-zinc-100/60 border-l-2 border-l-zinc-900'
                      : 'hover:bg-zinc-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-zinc-900 text-white'
                          : isCurrent
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200/80'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-zinc-400 font-normal">
                          Aula {index + 1} • Fundamento
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-normal text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-full">
                            Dominada
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-normal text-white bg-zinc-900 rounded-full">
                            Fazer agora
                          </span>
                        )}
                      </div>

                      <h5 className="font-normal text-zinc-900 text-sm">
                        {lesson?.title || obj.title}
                      </h5>

                      <p className="text-xs text-zinc-500 line-clamp-1 max-w-2xl font-normal">
                        {lesson?.learningGoal || obj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveObjectiveId(obj.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-normal text-zinc-700 hover:text-zinc-950 bg-white/80 hover:bg-white border border-zinc-200/80 transition-colors cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Abrir aula</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(obj.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-800 bg-white'
                      }`}
                      title={isCompleted ? 'Desmarcar aula' : 'Marcar como dominada'}
                    >
                      {isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FASE 2: AGORA É COM VOCÊ (3 DESAFIOS DA EMPRESA) */}
      {(filterPhase === 'all' || filterPhase === 'specific') && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200/60 text-zinc-600 flex items-center justify-center text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className="text-base font-serif font-normal text-zinc-900"
                  style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                >
                  2. Agora é com você (Desafios da empresa)
                </h4>
                <p className="text-xs text-zinc-500 font-normal">
                  Aplicação autônoma das fórmulas e planilhas na missão {problem.number} ({problem.shortTitle})
                </p>
              </div>
            </div>

            <span className="text-xs font-normal px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/60 text-zinc-700 self-start sm:self-auto tabular-nums">
              {specificCompletedCount} de {specificObjectives.length} desafios concluídos
            </span>
          </div>

          <div className="divide-y divide-zinc-100 bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xs">
            {specificObjectives.map((obj, index) => {
              const isCompleted = completedList.includes(obj.id);
              const isCurrent = !isCompleted && nextPendingObjective?.id === obj.id;
              const lesson = getLessonById(obj.id);

              return (
                <div
                  key={obj.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                    isCompleted
                      ? 'bg-zinc-50/30'
                      : isCurrent
                      ? 'bg-zinc-100/60 border-l-2 border-l-zinc-900'
                      : 'hover:bg-zinc-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-zinc-900 text-white'
                          : isCurrent
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `D${index + 1}`}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-zinc-500 font-normal">
                          Desafio {index + 1} • {problem.shortTitle}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-normal text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-full">
                            Resolvido
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-normal text-white bg-zinc-900 rounded-full">
                            Fazer agora
                          </span>
                        )}
                      </div>

                      <h5 className="font-normal text-zinc-900 text-sm">
                        {lesson?.title || obj.title}
                      </h5>

                      <p className="text-xs text-zinc-500 line-clamp-1 max-w-2xl font-normal">
                        {lesson?.learningGoal || obj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveObjectiveId(obj.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-normal text-zinc-700 hover:text-zinc-950 bg-white/80 hover:bg-white border border-zinc-200/80 transition-colors cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Abrir desafio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(obj.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-800 bg-white'
                      }`}
                      title={isCompleted ? 'Desmarcar desafio' : 'Marcar como resolvido'}
                    >
                      {isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FASE 3: ETAPA DE ENTREGA DA ATIVIDADE DO DIA (MARCO FINAL) */}
      {(filterPhase === 'all' || filterPhase === 'delivery') && (
        <div className="pt-2">
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                      Etapa final da trilha
                    </span>
                    {latestSubmission ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-normal text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" /> Entregue (v{latestSubmission.version})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-normal text-zinc-600 bg-zinc-100 border border-zinc-200/80 rounded-full">
                        <Clock className="w-3 h-3 text-zinc-400" /> Aguardando envio
                      </span>
                    )}
                  </div>

                  <h4
                    className="text-lg sm:text-xl font-serif font-normal text-zinc-900"
                    style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                  >
                    Etapa de entrega da atividade do dia
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl font-normal">
                    Após concluir os fundamentos e resolver os desafios da empresa, salve a planilha no ONLYOFFICE
                    em formato <strong className="text-zinc-900 font-medium">.xlsx</strong> e envie o arquivo para correção do professor.
                  </p>
                </div>
              </div>

              {onNavigateDeliveries && (
                <button
                  type="button"
                  onClick={onNavigateDeliveries}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{latestSubmission ? 'Ver minhas entregas' : 'Fazer entrega da planilha'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Checklist / Instruções Rápidas de Entrega */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-200/60 text-xs">
              <div className="flex items-start gap-2 text-zinc-600 font-normal">
                <FileSpreadsheet className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Formato: <strong className="text-zinc-800 font-medium">.xlsx</strong> (ONLYOFFICE)</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-600 font-normal">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  {activeActivity?.due_at
                    ? `Prazo: ${formatDateTime(activeActivity.due_at)}`
                    : 'Prazo: até o final da aula'}
                </span>
              </div>
              <div className="flex items-start gap-2 text-zinc-600 font-normal">
                <Award className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  {activeActivity?.max_score
                    ? `Pontuação: até ${formatScore(activeActivity.max_score)} pts`
                    : 'Avaliação com nota e feedback'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Interativo de Aula Guiada */}
      {activeLessonData && (
        <LessonModal
          lesson={activeLessonData}
          isCompleted={completedList.includes(activeLessonData.id)}
          onToggleComplete={() => handleToggle(activeLessonData.id)}
          onClose={() => setActiveObjectiveId(null)}
          onNavigateLesson={handleNavigateLesson}
          hasPrev={currentObjectiveIndex > 0}
          hasNext={currentObjectiveIndex < problem.learningObjectives.length - 1}
        />
      )}
    </div>
  );
};
