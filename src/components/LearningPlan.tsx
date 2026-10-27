import React from 'react';
import type { Group, Problem } from '../types';
import {
  CheckSquare,
  Square,
  ArrowLeftRight,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
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

  // Separação explícita entre Comum (Professor) e Específico (Grupo)
  const commonObjectives = problem.learningObjectives.filter((o) => o.scope === 'comum');
  const specificObjectives = problem.learningObjectives.filter((o) => o.scope === 'especifico');

  const commonCompletedCount = commonObjectives.filter((o) => completedList.includes(o.id)).length;
  const specificCompletedCount = specificObjectives.filter((o) => completedList.includes(o.id)).length;

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
          'Todas as metas (fundamentos e específicos da empresa) foram concluídas!'
        );
      }
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar meta.');
    }
  };

  return (
    <div className="neo-card p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Topo do Plano de Aprendizagem */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display block mb-1">
            PLANO DE APRENDIZAGEM • DIVISÃO PEDAGÓGICA
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Metas de Planilha da Empresa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Aulas gerais compartilhadas com o professor + desenvolvimento específico do grupo para a{' '}
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
            MISSÃO ATIVA DO GRUPO
          </span>
          <h4 className="text-lg font-display font-bold text-slate-900">{problem.title}</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {problem.objective}
          </p>
        </div>

        {/* Medidor de Conclusão Global */}
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
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-medium">
            <span>Básico: {commonCompletedCount}/4</span>
            <span>Específico: {specificCompletedCount}/3</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: O BÁSICO COM O PROFESSOR (COMUM A TODOS) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-display font-bold text-slate-900">
                1. O Básico com o Professor (Comum a Todos)
              </h4>
              <p className="text-[11px] text-slate-500">
                Conteúdos fundamentais ensinados pelo professor em aula para toda a turma
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">
            {commonCompletedCount} de {commonObjectives.length} concluídos
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {commonObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);

            return (
              <div
                key={obj.id}
                onClick={() => handleToggle(obj.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-400 text-slate-900 shadow-[2px_2px_0px_#22c55e]'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-[2px_2px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center border border-slate-900">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md bg-white border-2 border-slate-900 flex items-center justify-center">
                        <Square className="w-3 h-3 text-transparent" />
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
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Pilar Geral #{index + 1} • Praticado na aula geral com o professor
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {isCompleted ? 'Dominado ✓' : 'Em Aula'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: OS ESPECÍFICOS COM O GRUPO (AUTONOMIA DA EMPRESA) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-display font-bold text-slate-900">
                2. Os Específicos com o seu Grupo (Autonomia da Empresa)
              </h4>
              <p className="text-[11px] text-slate-500">
                Desafios e fórmulas exclusivas para a situação-problema escolhida pela sua equipe
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900">
            {specificCompletedCount} de {specificObjectives.length} concluídos
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {specificObjectives.map((obj, index) => {
            const isCompleted = completedList.includes(obj.id);

            return (
              <div
                key={obj.id}
                onClick={() => handleToggle(obj.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-400 text-slate-900 shadow-[2px_2px_0px_#22c55e]'
                    : 'bg-white hover:bg-slate-50 border-slate-900 text-slate-800 shadow-[2px_2px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center border border-slate-900">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md bg-white border-2 border-slate-900 flex items-center justify-center">
                        <Square className="w-3 h-3 text-transparent" />
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
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Meta Específica #{index + 1} • Fórmulas exclusivas da sua empresa
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {isCompleted ? 'Concluído ✓' : 'Do Grupo'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUADRO DE FERRAMENTAS DIVIDIDO */}
      <div className="space-y-4 pt-2">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          Mapa de Recursos ONLYOFFICE Utilizados:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coluna 1: Comum (Professor) */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border-2 border-slate-900 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              👨‍🏫 Ensinado pelo Professor em Aula:
            </span>
            <ul className="space-y-1.5 text-xs">
              {problem.commonTools.map((tool, idx) => (
                <li key={idx} className="flex flex-col">
                  <strong className="text-slate-900">• {tool.category}</strong>
                  <span className="text-[11px] text-slate-600 pl-2">{tool.details}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 2: Específico (Grupo) */}
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#22c55e] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              🚀 Aprofundado pelo seu Grupo:
            </span>
            <ul className="space-y-1.5 text-xs">
              {problem.specificTools.map((tool, idx) => (
                <li key={idx} className="flex flex-col">
                  <strong className="text-slate-900">• {tool.category}</strong>
                  <span className="text-[11px] text-slate-600 pl-2">{tool.details}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
