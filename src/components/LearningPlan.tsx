import React from 'react';
import type { Group, Problem } from '../types';
import {
  CheckSquare,
  Square,
  Sparkles,
  BookOpen,
  ArrowLeftRight,
  FileSpreadsheet,
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
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
        });
        showToast(
          'success',
          'Etapa 1 Concluída com Sucesso!',
          'Parabéns! Todas as metas de aprendizagem da Etapa 1 foram marcadas pela equipe!'
        );
      }
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar objetivo.');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8">
      {/* Topo do Plano de Aprendizagem */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Plano de Aprendizagem da Empresa
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            O que precisamos aprender?
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Habilidades digitais e ferramentas que seu grupo desenvolverá para resolver o{' '}
            <strong className="text-slate-800 font-semibold">Problema {problem.number}</strong>.
          </p>
        </div>

        {/* Botão de Alterar Escolha */}
        <button
          type="button"
          onClick={onChangeProblem}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer self-start md:self-auto"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
          <span>Alterar escolha do problema</span>
        </button>
      </div>

      {/* Cartão Informativo do Problema Selecionado */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Problema {problem.number} Selecionado
          </span>
          <h4 className="text-lg font-bold text-slate-900">{problem.title}</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {problem.objective}
          </p>
        </div>

        {/* Medidor de Conclusão */}
        <div className="w-full md:w-56 shrink-0 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600">Progresso de Habilidades:</span>
            <span className="text-indigo-600">{percent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isAllCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block text-right">
            {completedCount} de {totalCount} objetivos marcados
          </span>
        </div>
      </div>

      {/* Lista de Objetivos de Aprendizagem Interativa */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Objetivos de Aprendizagem (Marque conforme for desenvolvendo):
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {problem.learningObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);

            return (
              <div
                key={obj.id}
                onClick={() => handleToggle(obj.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                  isCompleted
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-indigo-600 group-hover:scale-110 transition-transform">
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-semibold transition-all ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      {obj.title}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Meta #{index + 1} para o projeto com ONLYOFFICE
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                  }`}
                >
                  {isCompleted ? 'Dominado ✓' : 'Pendente'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ferramentas e Recursos no ONLYOFFICE */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          Ferramentas do ONLYOFFICE que serão exploradas:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {problem.onlyofficeTools.map((tool, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-1"
            >
              <span className="font-bold text-slate-900 text-sm block">{tool.category}</span>
              <p className="text-slate-600 leading-relaxed">{tool.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem Motivacional Obrigatória */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/80 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            Compromisso de Aprendizagem
          </h5>
          <p className="text-sm text-indigo-950 font-medium mt-1 leading-relaxed">
            "Esta é apenas a primeira etapa. Durante o ano letivo, seu grupo desenvolverá conhecimentos e habilidades para construir uma solução digital para o problema escolhido."
          </p>
        </div>
      </div>
    </div>
  );
};
