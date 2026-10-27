import React from 'react';
import type { Group, Problem } from '../types';
import {
  CheckSquare,
  Square,
  BookOpen,
  ArrowLeftRight,
  FileSpreadsheet,
  BookmarkCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

  const handleToggle = async (objId: string) => {
    try {
      await onToggleObjective(objId);
      const isNowCompleted = !completedList.includes(objId);
      if (isNowCompleted && completedCount + 1 === totalCount) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
        });
        showToast(
          'success',
          'Etapa 1 Concluída!',
          'Todas as metas de aprendizagem da Etapa 1 foram marcadas pela equipe.'
        );
      }
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar objetivo.');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
      {/* Topo do Plano de Aprendizagem */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            Plano de Aprendizagem
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Metas de Aprendizagem da Empresa
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Competências e habilidades de planilhas para resolver o{' '}
            <strong className="text-slate-800 font-semibold">Problema {problem.number}: {problem.shortTitle}</strong>.
          </p>
        </div>

        {/* Botão de Alterar Escolha */}
        <button
          type="button"
          onClick={onChangeProblem}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer self-start md:self-auto"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
          <span>Trocar problema selecionado</span>
        </button>
      </div>

      {/* Cartão Informativo do Problema Selecionado */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
            Problema {problem.number} Selecionado
          </span>
          <h4 className="text-base font-bold text-slate-900">{problem.title}</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {problem.objective}
          </p>
        </div>

        {/* Medidor de Conclusão */}
        <div className="w-full md:w-56 shrink-0 bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Progresso:</span>
            <span className="text-slate-900 font-bold">{percent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                isAllCompleted ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block text-right font-medium">
            {completedCount} de {totalCount} concluídos
          </span>
        </div>
      </div>

      {/* Lista de Objetivos de Aprendizagem Interativa */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Checklist de Habilidades Digitais (Marque conforme desenvolver na planilha):
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {problem.learningObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);

            return (
              <div
                key={obj.id}
                onClick={() => handleToggle(obj.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-4 select-none ${
                  isCompleted
                    ? 'bg-slate-50 border-emerald-300 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {obj.title}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Meta #{index + 1} • Prática com ONLYOFFICE Planilhas
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isCompleted ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ferramentas e Recursos no ONLYOFFICE */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
          Habilidades Práticas Desenvolvidas nesta Solução:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {problem.onlyofficeTools.map((tool, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
            >
              <span className="font-bold text-slate-900 text-xs block">{tool.category}</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">{tool.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem Pedagógica Orientadora */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
        <BookmarkCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Compromisso de Aprendizagem
          </h5>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Esta é a primeira etapa do projeto. Ao longo das aulas, seu grupo aprenderá os conceitos necessários para construir a planilha completa da sua empresa.
          </p>
        </div>
      </div>
    </div>
  );
};
