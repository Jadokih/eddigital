import React from 'react';
import type { Group, Problem } from '../types';
import {
  CheckSquare,
  Square,
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
          'Todas as metas da planilha foram concluídas pela equipe!'
        );
      }
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar objetivo.');
    }
  };

  return (
    <div className="neo-card p-6 sm:p-8 space-y-7 max-w-5xl mx-auto">
      {/* Topo do Plano de Aprendizagem */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display block mb-1">
            PLANO DE APRENDIZAGEM • ONLYOFFICE
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Metas de Planilha da Empresa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Desenvolva as habilidades necessárias para resolver a{' '}
            <strong className="text-slate-900 font-semibold">Missão {problem.number}: {problem.shortTitle}</strong>.
          </p>
        </div>

        {/* Botão de Alterar Escolha */}
        <button
          type="button"
          onClick={onChangeProblem}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all cursor-pointer self-start md:self-auto"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Trocar Missão</span>
        </button>
      </div>

      {/* Cartão Informativo da Missão Selecionada */}
      <div className="p-5 rounded-2xl bg-[#FAF9F5] border-2 border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            MISSÃO ATIVA
          </span>
          <h4 className="text-lg font-display font-bold text-slate-900">{problem.title}</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {problem.objective}
          </p>
        </div>

        {/* Medidor de Conclusão */}
        <div className="w-full md:w-56 shrink-0 bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Progresso Geral:</span>
            <span className="text-slate-900 font-display text-sm">{percent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-900">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                isAllCompleted ? 'bg-emerald-500' : 'bg-slate-900'
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
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display">
          Checklist de Habilidades Digitais (Marque conforme for desenvolvendo):
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {problem.learningObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);

            return (
              <div
                key={obj.id}
                onClick={() => handleToggle(obj.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-400 text-slate-900 shadow-[2px_2px_0px_#22c55e]'
                    : 'bg-white hover:bg-slate-50 border-slate-900 text-slate-800 shadow-[2px_2px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center border border-slate-900">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-white border-2 border-slate-900 flex items-center justify-center">
                        <Square className="w-3.5 h-3.5 text-transparent" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {obj.title}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Meta #{index + 1} • Prática orientada no ONLYOFFICE
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {isCompleted ? 'Dominado ✓' : 'A Praticar'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ferramentas e Recursos no ONLYOFFICE */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          Habilidades Práticas do ONLYOFFICE:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {problem.onlyofficeTools.map((tool, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs space-y-1"
            >
              <span className="font-display font-bold text-slate-900 text-xs block">{tool.category}</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">{tool.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem Pedagógica Orientadora */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] border-2 border-slate-900 flex items-start gap-3">
        <BookmarkCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest font-display">
            Compromisso de Aprendizagem
          </h5>
          <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
            Esta é a primeira etapa do projeto. Durante o ano letivo, o grupo aplicará os conceitos aprendidos em aula para montar a planilha final da empresa.
          </p>
        </div>
      </div>
    </div>
  );
};
