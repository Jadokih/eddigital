import React, { useState } from 'react';
import type { Group, Problem } from '../types';
import {
  CheckSquare,
  Square,
  ArrowLeftRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLessonById } from '../data/lessonsData';
import { LessonModal } from './learning/LessonModal';

interface LearningPlanProps {
  group: Group;
  problem: Problem;
  onToggleObjective: (objectiveId: string) => Promise<void>;
  onChangeProblem: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const LearningPlan: React.FC<LearningPlanProps> = ({
  group,
  problem,
  onToggleObjective,
  onChangeProblem,
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

  // Separação explícita entre Aprendendo o básico e Agora é com você
  const commonObjectives = problem.learningObjectives.filter((o) => o.scope === 'comum');
  const specificObjectives = problem.learningObjectives.filter((o) => o.scope === 'especifico');

  const commonCompletedCount = commonObjectives.filter((o) => completedList.includes(o.id)).length;
  const specificCompletedCount = specificObjectives.filter((o) => completedList.includes(o.id)).length;

  // Estado da Aula Ativa aberta no Modal
  const [activeObjectiveId, setActiveObjectiveId] = useState<string | null>(null);

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Topo do Plano de Aprendizagem */}
      <div className="ed-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display block mb-1">
              TRILHA DE APRENDIZAGEM & PLANILHAS DIGITAIS
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Metas de Aprendizagem da Empresa
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Domine os 6 fundamentos essenciais ensinados em aula com o professor e aplique os 3 desafios práticos na
              sua empresa fictícia (<strong className="text-slate-900">{problem.shortTitle}</strong>).
            </p>
          </div>

          <button
            type="button"
            onClick={onChangeProblem}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer self-start md:self-auto"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
            <span>Trocar Missão</span>
          </button>
        </div>

        {/* Barra de Ação Rápida: Próxima Aula & Progresso Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm">
          <div className="md:col-span-2 space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Próxima Aula Recomendada
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {nextPendingObjective ? nextPendingObjective.title : 'Todas as aulas concluídas!'}
            </h4>
            <p className="text-xs text-slate-300">
              {isAllCompleted
                ? 'Sua equipe completou todas as habilidades. Agora é só gerar o arquivo .xlsx e enviar!'
                : 'Abra o guia passo a passo com exemplos visuais no ONLYOFFICE para executar sem travar.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center gap-2">
            {!isAllCompleted && nextPendingObjective && (
              <button
                type="button"
                onClick={() => setActiveObjectiveId(nextPendingObjective.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Continuar Aula</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="w-full md:w-48 space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-300">
                <span>Progresso Total</span>
                <span className="font-bold text-emerald-400">{percent}%</span>
              </div>
              <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: APRENDENDO O BÁSICO (6 FUNDAMENTOS EM AULA) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs shadow-2xs">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-slate-900">
                1. Aprendendo o básico
              </h4>
              <p className="text-xs text-slate-500">
                Conteúdos fundamentais ensinados pelo professor em aula para toda a turma
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 self-start sm:self-auto">
            {commonCompletedCount} de {commonObjectives.length} aulas dominadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {commonObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);
            const lesson = getLessonById(obj.id);

            return (
              <div
                key={obj.id}
                className={`ed-card-sm p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Aula #{index + 1} • Básico
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Dominado ✓
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm leading-snug">
                    {lesson?.title || obj.title}
                  </h5>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lesson?.learningGoal || obj.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveObjectiveId(obj.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ver Aula Passo a Passo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(obj.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 text-slate-400 hover:border-slate-900 hover:text-slate-900'
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

      {/* SEÇÃO 2: AGORA É COM VOCÊ (3 METAS DA EMPRESA) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shadow-2xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-slate-900">
                2. Agora é com você (Desafios da Empresa)
              </h4>
              <p className="text-xs text-slate-500">
                Aplicação autônoma das fórmulas e planilhas para resolver a Missão {problem.number}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 self-start sm:self-auto">
            {specificCompletedCount} de {specificObjectives.length} desafios concluídos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {specificObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);
            const lesson = getLessonById(obj.id);

            return (
              <div
                key={obj.id}
                className={`ed-card-sm p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Desafio #{index + 1}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Resolvido ✓
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm leading-snug">
                    {lesson?.title || obj.title}
                  </h5>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {lesson?.learningGoal || obj.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveObjectiveId(obj.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ver Desafio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(obj.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 text-slate-400 hover:border-slate-900 hover:text-slate-900'
                    }`}
                    title={isCompleted ? 'Desmarcar desafio' : 'Marcar como concluído'}
                  >
                    {isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
