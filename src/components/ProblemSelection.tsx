import React, { useState } from 'react';
import type { Problem } from '../types';
import { PROBLEMS_DATA } from '../data/problems';
import {
  BadgeDollarSign,
  Boxes,
  CalendarCheck2,
  Megaphone,
  Database,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  X,
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
        return <BadgeDollarSign className="w-6 h-6" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6" />;
      case 'CalendarCheck2':
        return <CalendarCheck2 className="w-6 h-6" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6" />;
      case 'Database':
        return <Database className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast(
        'success',
        'Problema Definido com Sucesso!',
        `Seu grupo selecionou: Problema ${modalProblem.number} — ${modalProblem.title}`
      );
      setModalProblem(null);
    } catch (err: any) {
      showToast('error', 'Falha ao salvar', err.message || 'Não foi possível registrar sua escolha.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" id="etapa-1-section">
      {/* Cabeçalho da Etapa 1 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Educação Digital — Etapa 1
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Qual problema sua empresa vai resolver?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Toda empresa nasce para atender a uma necessidade. Nesta primeira etapa, seu grupo deverá escolher um problema real que gostaria de resolver com sua empresa. Ao longo do ano letivo, vocês aprenderão a utilizar ferramentas digitais para desenvolver uma solução.
          </p>
        </div>
      </div>

      {/* Grade com os 5 Problemas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PROBLEMS_DATA.map((problem) => {
          const isSelected = selectedProblemId === problem.id;

          return (
            <div
              key={problem.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                isSelected
                  ? 'border-indigo-600 ring-4 ring-indigo-500/10'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Header do Card */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${problem.accentColor.bg} ${problem.accentColor.text}`}
                    >
                      {getProblemIcon(problem.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Problema {problem.number}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${problem.accentColor.badge}`}
                        >
                          {problem.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {problem.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selecionado
                    </span>
                  )}
                </div>

                {/* Descrição */}
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Situação-Problema:
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {problem.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Objetivo da Solução Digital:
                    </span>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/70">
                      {problem.objective}
                    </p>
                  </div>
                </div>

                {/* Ferramentas ONLYOFFICE */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                    O que poderão aprender no ONLYOFFICE:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {problem.onlyofficeTools.slice(0, 4).map((tool, idx) => (
                      <li
                        key={idx}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700 flex flex-col gap-0.5"
                      >
                        <strong className="text-slate-900 font-semibold">{tool.category}</strong>
                        <span className="text-slate-500 text-[11px] leading-tight line-clamp-2">
                          {tool.details}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botão de Escolha */}
              <div className="pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => handleOpenConfirmModal(problem)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 text-indigo-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Problema Escolhido (Clique para revisar ou alterar)</span>
                    </>
                  ) : (
                    <>
                      <span>Escolher este problema</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Confirmação da Escolha */}
      {modalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${modalProblem.accentColor.bg} ${modalProblem.accentColor.text}`}
                >
                  {getProblemIcon(modalProblem.icon)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Confirmar Seleção da Etapa 1
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Problema {modalProblem.number}: {modalProblem.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Resumo do Desafio:
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {modalProblem.description}
                </p>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  Objetivo que o grupo vai desenvolver:
                </h4>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {modalProblem.objective}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Ferramentas ONLYOFFICE que serão estudadas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modalProblem.onlyofficeTools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs"
                    >
                      <span className="font-bold text-slate-800 block">{tool.category}</span>
                      <span className="text-slate-500 text-[11px]">{tool.details}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-500 italic bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200">
                Nota: O grupo poderá alterar sua escolha enquanto a atividade estiver em andamento.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmChoice}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Salvando...' : 'Confirmar Escolha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
