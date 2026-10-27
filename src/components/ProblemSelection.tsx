import React, { useState } from 'react';
import type { Problem } from '../types';
import { PROBLEMS_DATA } from '../data/problems';
import {
  BadgeDollarSign,
  Boxes,
  CalendarCheck2,
  Database,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  X,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProblemSelectionProps {
  selectedProblemId: number | null;
  onSelectProblem: (problemId: number) => Promise<void>;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ProblemSelection: React.FC<ProblemSelectionProps> = ({
  selectedProblemId,
  onSelectProblem,
  showToast,
}) => {
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getProblemIcon = (iconName: string) => {
    switch (iconName) {
      case 'BadgeDollarSign':
        return <BadgeDollarSign className="w-5 h-5" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5" />;
      case 'CalendarCheck2':
        return <CalendarCheck2 className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      default:
        return <FileSpreadsheet className="w-5 h-5" />;
    }
  };

  const handleOpenConfirmModal = (problem: Problem) => {
    setModalProblem(problem);
  };

  const handleConfirmChoice = async () => {
    if (!modalProblem) return;
    setSubmitting(true);
    try {
      await onSelectProblem(modalProblem.id);
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
      });
      showToast(
        'success',
        'Situação-Problema Definida',
        `Seu grupo selecionou: Problema ${modalProblem.number} — ${modalProblem.shortTitle}`
      );
      setModalProblem(null);
    } catch (err: any) {
      showToast('error', 'Falha ao salvar', err.message || 'Não foi possível registrar sua escolha.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" id="etapa-1-section">
      {/* Cabeçalho Institucional da Etapa 1 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-3">
            <Compass className="w-3.5 h-3.5 text-slate-600" />
            Educação Digital • Etapa 1
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Definição da Situação-Problema
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
            Toda organização atua para solucionar uma necessidade real. Selecione abaixo qual desafio prático seu grupo irá resolver utilizando recursos avançados de <strong className="text-slate-800 font-semibold">Planilhas no ONLYOFFICE</strong> ao longo do projeto.
          </p>
        </div>
      </div>

      {/* Grade com os 4 Problemas de Planilha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {PROBLEMS_DATA.map((problem) => {
          const isSelected = selectedProblemId === problem.id;

          return (
            <div
              key={problem.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${problem.accentColor.bg} ${problem.accentColor.text} ${problem.accentColor.border}`}
                    >
                      {getProblemIcon(problem.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Problema {problem.number}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${problem.accentColor.badge}`}
                        >
                          {problem.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {problem.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ativo
                    </span>
                  )}
                </div>

                {/* Descrição e Objetivo */}
                <div className="space-y-3 mb-5">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Cenário Real:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {problem.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Solução com Planilha:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                      {problem.objective}
                    </p>
                  </div>
                </div>

                {/* Ferramentas ONLYOFFICE */}
                <div className="mb-5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                    Habilidades no ONLYOFFICE Planilhas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {problem.onlyofficeTools.slice(0, 4).map((tool, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 flex flex-col gap-0.5"
                      >
                        <strong className="text-slate-900 font-semibold">{tool.category}</strong>
                        <span className="text-slate-600 text-[11px] leading-snug line-clamp-2">
                          {tool.details}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ação */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenConfirmModal(problem)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Problema Selecionado (Clique para rever)</span>
                    </>
                  ) : (
                    <>
                      <span>Selecionar Este Problema</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Confirmação */}
      {modalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border ${modalProblem.accentColor.bg} ${modalProblem.accentColor.text} ${modalProblem.accentColor.border}`}
                >
                  {getProblemIcon(modalProblem.icon)}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Confirmar Seleção
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Problema {modalProblem.number}: {modalProblem.shortTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Desafio da Empresa:
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {modalProblem.description}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Solução a Desenvolver na Planilha:
                </h4>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {modalProblem.objective}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tópicos ONLYOFFICE Planilhas que serão trabalhados:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {modalProblem.onlyofficeTools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-xs"
                    >
                      <span className="font-bold text-slate-800 block text-[11px]">{tool.category}</span>
                      <span className="text-slate-500 text-[11px]">{tool.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmChoice}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Gravando...' : 'Confirmar Escolha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
