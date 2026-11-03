import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ListOrdered,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { LessonData } from '../../data/lessonsData';
import { MenuPath } from '../ui/MenuPath';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/40 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho da Aula */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-200/80 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-2xs">
              <BookOpen className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-zinc-500">
                  {lesson.category}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-zinc-900" /> Concluída
                  </span>
                )}
              </div>
              <h2
                className="text-xl sm:text-2xl font-serif font-normal text-zinc-900 mt-0.5"
                style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
              >
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-200 hover:border-zinc-400 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo da Aula Didática (Layout Aberto, Sem Cards Aninhados) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm">
          {/* Seção A: O que você vai aprender? (Texto Aberto com Respiro) */}
          <div className="space-y-1.5 pb-4 border-b border-zinc-100">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Objetivo pedagógico
            </span>
            <p className="text-base text-zinc-900 leading-relaxed font-normal">
              {lesson.learningGoal}
            </p>
          </div>

          {/* Seção B: O que você precisa fazer? */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              O que fazer na sua planilha
            </span>
            <p className="text-sm font-normal text-zinc-800 leading-relaxed">
              {lesson.practicalTask}
            </p>
          </div>

          {/* Seção C: Como fazer? Passo a Passo em Lista Aberta (SEM BORDAS INDIVIDUAIS) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Passo a passo no ONLYOFFICE Desktop</span>
            </div>

            <ol className="space-y-4 pt-1">
              {lesson.steps.map((step) => (
                <li key={step.number} className="flex items-start gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-medium text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.number}
                  </span>
                  <div className="space-y-1 flex-1">
                    <p className="font-medium text-zinc-900 text-sm">{step.instruction}</p>
                    {step.menuPath && (
                      <div className="pt-0.5">
                        <MenuPath steps={step.menuPath} />
                      </div>
                    )}
                    <p className="text-xs text-zinc-500 leading-relaxed pt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Seção D: Dica Anti-Erro / Macete de Sala de Aula */}
          <div className="border-l-2 border-zinc-900 pl-4 py-1 space-y-1 text-xs">
            <h4 className="font-medium text-zinc-900 text-xs">{lesson.tip.title}</h4>
            <div className="text-zinc-600 leading-relaxed">{lesson.tip.content}</div>
          </div>

          {/* Seção E: Hora de praticar (Aberto) */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-100">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Hora de praticar com a sua equipe
            </span>
            <p className="text-xs sm:text-sm text-zinc-700 font-normal leading-relaxed">
              {lesson.practiceExercise}
            </p>
          </div>

          {/* Seção F: Confira seu resultado (Autoavaliação) */}
          <div className="pt-2 border-t border-zinc-100">
            <SelfChecklist
              items={lesson.selfChecklist}
              checkedItems={checkedItems}
              onToggleItem={handleToggleCheckItem}
            />
          </div>
        </div>

        {/* Rodapé e Navegação entre Aulas */}
        <div className="p-4 sm:p-5 border-t border-zinc-200/80 bg-zinc-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {hasPrev && onNavigateLesson && (
              <button
                type="button"
                onClick={() => onNavigateLesson('prev')}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-zinc-200 hover:border-zinc-800 bg-white text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Aula anterior</span>
              </button>
            )}
            {hasNext && onNavigateLesson && (
              <button
                type="button"
                onClick={() => onNavigateLesson('next')}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-zinc-200 hover:border-zinc-800 bg-white text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
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
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors border cursor-pointer ${
                isCompleted
                  ? 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
                  : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {isCompleted ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>{isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluída'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleCompleteAndNext}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-sm hover:shadow"
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
