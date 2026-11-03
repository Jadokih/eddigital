import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  ListOrdered,
  PlayCircle,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { LessonData } from '../../data/lessonsData';
import { MenuPath } from '../ui/MenuPath';
import { TipCallout } from '../ui/TipCallout';
import { SelfChecklist } from '../ui/SelfChecklist';

interface LessonModalProps {
  lesson: LessonData;
  isCompleted: boolean;
  onToggleComplete: () => Promise<void>;
  onClose: () => void;
  onNavigateLesson?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  isCompleted,
  onToggleComplete,
  onClose,
  onNavigateLesson,
  hasPrev,
  hasNext,
}) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(lesson.selfChecklist.length).fill(isCompleted)
  );
  const [saving, setSaving] = useState(false);

  const handleToggleCheckItem = (idx: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleCompleteAndNext = async () => {
    setSaving(true);
    try {
      if (!isCompleted) {
        await onToggleComplete();
      }
      if (hasNext && onNavigateLesson) {
        onNavigateLesson('next');
      } else {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho da Aula */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                  {lesson.category}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Concluída
                  </span>
                )}
              </div>
              <h2
                className="text-lg sm:text-xl font-serif font-semibold text-slate-900 mt-0.5"
                style={{ fontFamily: "'Newsreader', serif" }}
              >
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo da Aula Didática */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm">
          {/* Seção A: O que você vai aprender? */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 sm:p-5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>O que você vai aprender</span>
            </div>
            <p className="text-sm font-medium text-emerald-950 leading-relaxed">
              {lesson.learningGoal}
            </p>
          </div>

          {/* Seção B: O que você precisa fazer? */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
              <Target className="w-4 h-4 text-slate-600" />
              <span>O que precisa fazer na sua planilha</span>
            </div>
            <p className="text-sm font-medium text-slate-900 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {lesson.practicalTask}
            </p>
          </div>

          {/* Seção C: Como fazer? Passo a Passo Visual */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
              <ListOrdered className="w-4 h-4 text-slate-600" />
              <span>Como fazer (passo a passo no ONLYOFFICE)</span>
            </div>

            <div className="space-y-3">
              {lesson.steps.map((step) => (
                <div
                  key={step.number}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.number}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{step.instruction}</p>
                      {step.menuPath && (
                        <div className="pt-0.5">
                          <MenuPath steps={step.menuPath} />
                        </div>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção D: Dica Anti-Erro / Macete de Sala de Aula */}
          <TipCallout type={lesson.tip.type} title={lesson.tip.title}>
            <p>{lesson.tip.content}</p>
          </TipCallout>

          {/* Seção E: Hora de praticar */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs">
              <PlayCircle className="w-4 h-4 text-blue-600" />
              <span>Hora de praticar com a sua equipe</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-950 font-normal leading-relaxed">
              {lesson.practiceExercise}
            </p>
          </div>

          {/* Seção F: Confira seu resultado (Autoavaliação) */}
          <div className="pt-2">
            <SelfChecklist
              items={lesson.selfChecklist}
              checkedItems={checkedItems}
              onToggleItem={handleToggleCheckItem}
            />
          </div>
        </div>

        {/* Rodapé e Navegação entre Aulas */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {hasPrev && onNavigateLesson && (
              <button
                type="button"
                onClick={() => onNavigateLesson('prev')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-800 bg-white text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Aula anterior</span>
              </button>
            )}
            {hasNext && onNavigateLesson && (
              <button
                type="button"
                onClick={() => onNavigateLesson('next')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-800 bg-white text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span>Próxima aula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await onToggleComplete();
                } finally {
                  setSaving(false);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                isCompleted
                  ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  : 'bg-white text-emerald-800 border-emerald-400 hover:bg-emerald-50'
              }`}
            >
              {isCompleted ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>{isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluída'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleCompleteAndNext}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{isCompleted ? (hasNext ? 'Avançar aula' : 'Concluir e fechar') : 'Concluir e continuar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
