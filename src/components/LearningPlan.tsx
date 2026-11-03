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
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Topo do Plano de Aprendizagem */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Trilha de aprendizagem • ONLYOFFICE
            </span>
            <h3
              className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              Metas de aprendizagem da empresa
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed font-normal">
              Domine os 6 fundamentos essenciais ensinados em aula com o professor e aplique os 3 desafios práticos na
              sua empresa fictícia (<strong className="text-slate-900">{problem.shortTitle}</strong>).
            </p>
          </div>

          <button
            type="button"
            onClick={onChangeProblem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
            <span>Trocar missão</span>
          </button>
        </div>

        {/* Barra de Ação Rápida: Próxima Aula & Progresso Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-5 sm:p-6 rounded-xl bg-slate-900 text-white shadow-sm">
          <div className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Próxima ação recomendada
            </span>
            <h4
              className="text-base sm:text-lg font-serif font-medium text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              {isAllCompleted
                ? 'Metas concluídas: envie sua planilha do dia'
                : nextPendingObjective?.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {isAllCompleted
                ? 'Sua equipe completou todas as habilidades e desafios. Salve seu arquivo no formato .xlsx e faça a entrega da atividade.'
                : 'Abra o passo a passo objetivo com instruções detalhadas de menus e fórmulas no ONLYOFFICE.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center gap-2">
            {isAllCompleted && onNavigateDeliveries ? (
              <button
                type="button"
                onClick={onNavigateDeliveries}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Entregar planilha (.xlsx)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : nextPendingObjective ? (
              <button
                type="button"
                onClick={() => setActiveObjectiveId(nextPendingObjective.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Continuar aula</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}

            <div className="w-full md:w-48 space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Progresso total</span>
                <span className="font-bold text-emerald-400 tabular-nums">{percent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Rápida entre Fases da Trilha */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs text-xs">
          <button
            type="button"
            onClick={() => setFilterPhase('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterPhase === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Trilha completa ({totalCount + 1})
          </button>
          <button
            type="button"
            onClick={() => setFilterPhase('common')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterPhase === 'common'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Fundamentos em aula ({commonCompletedCount}/{commonObjectives.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPhase('specific')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterPhase === 'specific'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. Desafios da empresa ({specificCompletedCount}/{specificObjectives.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPhase('delivery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterPhase === 'delivery'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Entrega do dia</span>
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-700">
          Turma {group.class_name} • {completedCount} de {totalCount} habilidades concluídas
        </div>
      </div>

      {/* FASE 1: APRENDENDO O BÁSICO (6 FUNDAMENTOS EM AULA) */}
      {(filterPhase === 'all' || filterPhase === 'common') && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className="text-base font-serif font-semibold text-slate-900"
                  style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                >
                  1. Aprendendo o básico
                </h4>
                <p className="text-xs text-slate-600">
                  Fundamentos ensinados pelo professor em aula para toda a turma
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 self-start sm:self-auto tabular-nums">
              {commonCompletedCount} de {commonObjectives.length} aulas dominadas
            </span>
          </div>

          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {commonObjectives.map((obj, index) => {
              const isCompleted = completedList.includes(obj.id);
              const isCurrent = !isCompleted && nextPendingObjective?.id === obj.id;
              const lesson = getLessonById(obj.id);

              return (
                <div
                  key={obj.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                    isCompleted
                      ? 'bg-slate-50/50'
                      : isCurrent
                      ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">
                          Aula {index + 1} • Fundamento
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md">
                            Dominada
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-white bg-emerald-700 rounded-md">
                            Fazer agora
                          </span>
                        )}
                      </div>

                      <h5 className="font-semibold text-slate-900 text-sm">
                        {lesson?.title || obj.title}
                      </h5>

                      <p className="text-xs text-slate-700 line-clamp-1 max-w-2xl font-normal">
                        {lesson?.learningGoal || obj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveObjectiveId(obj.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Abrir aula</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(obj.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-800 bg-white'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className="text-base font-serif font-semibold text-slate-900"
                  style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                >
                  2. Agora é com você (Desafios da empresa)
                </h4>
                <p className="text-xs text-slate-600">
                  Aplicação autônoma das fórmulas e planilhas na missão {problem.number} ({problem.shortTitle})
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 self-start sm:self-auto tabular-nums">
              {specificCompletedCount} de {specificObjectives.length} desafios concluídos
            </span>
          </div>

          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {specificObjectives.map((obj, index) => {
              const isCompleted = completedList.includes(obj.id);
              const isCurrent = !isCompleted && nextPendingObjective?.id === obj.id;
              const lesson = getLessonById(obj.id);

              return (
                <div
                  key={obj.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                    isCompleted
                      ? 'bg-slate-50/50'
                      : isCurrent
                      ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `D${index + 1}`}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-800">
                          Desafio {index + 1} • {problem.shortTitle}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md">
                            Resolvido
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-white bg-emerald-700 rounded-md">
                            Fazer agora
                          </span>
                        )}
                      </div>

                      <h5 className="font-semibold text-slate-900 text-sm">
                        {lesson?.title || obj.title}
                      </h5>

                      <p className="text-xs text-slate-700 line-clamp-1 max-w-2xl font-normal">
                        {lesson?.learningGoal || obj.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveObjectiveId(obj.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Abrir desafio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(obj.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-800 bg-white'
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
          <div className="bg-white rounded-2xl border border-emerald-300 shadow-sm p-6 sm:p-7 space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      Etapa final da trilha
                    </span>
                    {latestSubmission ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Entregue (v{latestSubmission.version})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded-md">
                        <Clock className="w-3 h-3 text-amber-700" /> Aguardando envio
                      </span>
                    )}
                  </div>

                  <h4
                    className="text-lg sm:text-xl font-serif font-semibold text-slate-900"
                    style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                  >
                    Etapa de entrega da atividade do dia
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl font-normal">
                    Após concluir os fundamentos e resolver os desafios da empresa, salve a planilha no ONLYOFFICE
                    em formato <strong className="text-slate-900">.xlsx</strong> e envie o arquivo para correção do professor.
                  </p>
                </div>
              </div>

              {onNavigateDeliveries && (
                <button
                  type="button"
                  onClick={onNavigateDeliveries}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{latestSubmission ? 'Ver minhas entregas' : 'Fazer entrega da planilha'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Checklist / Instruções Rápidas de Entrega */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Formato obrigatório: <strong className="text-slate-900">.xlsx</strong> (do ONLYOFFICE)</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {activeActivity?.due_at
                    ? `Prazo: ${formatDateTime(activeActivity.due_at)}`
                    : 'Prazo: até o final da aula'}
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
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
