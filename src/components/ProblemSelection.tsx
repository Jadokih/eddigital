import React, { useState } from 'react';
import type { Problem } from '../types';
import { PROBLEMS_DATA, COMMON_SPREADSHEET_TOOLS } from '../data/problems';
import {
  CheckCircle2,
  ArrowRight,
  X,
  GraduationCap,
  Sparkles,
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
        'Missão Definida!',
        `Seu grupo selecionou: Problema ${modalProblem.number} — ${modalProblem.shortTitle}`
      );
      setModalProblem(null);
    } catch (err: any) {
      showToast('error', 'Falha ao salvar', err.message || 'Não foi possível registrar sua escolha.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderIllustration = (problemNumber: number) => {
    switch (problemNumber) {
      case 1:
        return (
          <svg className="w-full h-28" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="1.5" rx="1" fill="#cbd5e1" />
            <rect x="135" y="65" width="12" height="40" rx="3" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="153" y="45" width="12" height="60" rx="3" stroke="#0f172a" strokeWidth="1.5" fill="#f8fafc" />
            <rect x="171" y="25" width="12" height="80" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="177" cy="18" r="3.5" fill="#10b981" />
            <circle cx="65" cy="40" r="14" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <path d="M60 40 Q65 44 70 40" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="61" cy="36" r="1.5" fill="#0f172a" />
            <circle cx="69" cy="36" r="1.5" fill="#0f172a" />
            <path d="M50 78 C50 60 80 60 80 78" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <path d="M68 76 L92 76 L86 64 L74 64 Z" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <line x1="62" y1="78" x2="98" y2="78" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="35" cy="50" r="10" stroke="#10b981" strokeWidth="1.5" fill="#ecfdf5" />
            <text x="35" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">R$</text>
          </svg>
        );
      case 2:
        return (
          <svg className="w-full h-28" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="1.5" rx="1" fill="#cbd5e1" />
            <rect x="125" y="70" width="35" height="35" rx="4" stroke="#64748b" strokeWidth="1.5" fill="#ffffff" />
            <line x1="125" y1="82" x2="160" y2="82" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
            <rect x="135" y="40" width="30" height="30" rx="4" stroke="#0284c7" strokeWidth="1.5" fill="#f0f9ff" />
            <line x1="135" y1="52" x2="165" y2="52" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="65" cy="35" r="13" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <path d="M61 35 Q65 39 69 35" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="61" cy="32" r="1.5" fill="#0f172a" />
            <circle cx="69" cy="32" r="1.5" fill="#0f172a" />
            <path d="M52 75 C52 55 78 55 78 75" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <line x1="58" y1="75" x2="55" y2="105" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="72" y1="75" x2="75" y2="105" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="74" y="55" width="26" height="26" rx="3" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <path d="M87 55 L87 63" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        );
      case 3:
        return (
          <svg className="w-full h-28" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="1.5" rx="1" fill="#cbd5e1" />
            <path d="M95 105 L95 85 L125 85 L125 65 L155 65 L155 45 L180 45" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="168" cy="35" r="3.5" fill="#d97706" />
            <circle cx="55" cy="35" r="13" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <path d="M51 35 Q55 39 59 35" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="51" cy="32" r="1.5" fill="#0f172a" />
            <circle cx="59" cy="32" r="1.5" fill="#0f172a" />
            <path d="M42 75 C42 55 68 55 68 75" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <rect x="70" y="50" width="30" height="20" rx="3" stroke="#0f172a" strokeWidth="1.5" fill="#fffbeb" />
            <line x1="75" y1="58" x2="95" y2="58" stroke="#d97706" strokeWidth="1.5" />
            <line x1="75" y1="63" x2="88" y2="63" stroke="#d97706" strokeWidth="1.5" />
          </svg>
        );
      default:
        return (
          <svg className="w-full h-28" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="1.5" rx="1" fill="#cbd5e1" />
            <rect x="120" y="45" width="45" height="55" rx="4" stroke="#475569" strokeWidth="1.5" fill="#ffffff" />
            <line x1="128" y1="58" x2="157" y2="58" stroke="#475569" strokeWidth="1.5" />
            <line x1="128" y1="68" x2="157" y2="68" stroke="#475569" strokeWidth="1.5" />
            <line x1="128" y1="78" x2="148" y2="78" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="65" cy="35" r="13" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
            <path d="M61 35 Q65 39 69 35" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="61" cy="32" r="1.5" fill="#0f172a" />
            <circle cx="69" cy="32" r="1.5" fill="#0f172a" />
            <path d="M52 75 C52 55 78 55 78 75" stroke="#0f172a" strokeWidth="1.5" fill="#ffffff" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner Introdutório */}
      <div className="ed-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-display">
              EDUCAÇÃO DIGITAL • ETAPA 1
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Escolha a Missão Prática da sua Empresa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Cada grupo escolhe uma situação real de mercado para resolver através de planilhas eletrônicas no
              ONLYOFFICE. Toda a turma aprende os fundamentos comuns em aula, e a sua equipe desenvolve os desafios
              específicos da missão escolhida.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 self-start md:self-auto shrink-0">
            <Compass className="w-4 h-4 text-slate-700" />
            <span>4 Situações-Problema</span>
          </div>
        </div>
      </div>

      {/* BLOCO 1: FUNDAMENTOS BÁSICOS COMPARTILHADOS */}
      <div className="ed-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-display font-bold text-slate-900">
                1. Aprendendo o básico (Compartilhado com toda a turma)
              </h4>
              <p className="text-xs text-slate-500">
                Habilidades essenciais ensinadas pelo professor em aula antes dos desafios
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hidden sm:inline">
            6 Fundamentos Comuns
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COMMON_SPREADSHEET_TOOLS.map((tool, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Aula #{idx + 1}
              </span>
              <strong className="text-slate-900 text-xs font-semibold block leading-tight">
                {tool.category}
              </strong>
              <p className="text-slate-600 text-[11px] leading-snug line-clamp-2">
                {tool.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCO 2: AS 4 MISSÕES PRÁTICAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-display">
              AUTONOMIA DO GRUPO
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              2. Agora é com você — Escolha sua Missão
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Clique na missão desejada para vincular a empresa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {PROBLEMS_DATA.map((problem) => {
            const isSelected = selectedProblemId === problem.id;

            return (
              <div
                key={problem.id}
                className={`ed-card p-6 flex flex-col justify-between gap-5 transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white'
                    : 'bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
                      Missão 0{problem.number} • {problem.tag}
                    </span>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Ativa
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-snug">
                    {problem.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Ilustração Visual */}
                  <div className="bg-[#FAF9F5] rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                    {renderIllustration(problem.number)}
                  </div>

                  {/* Box de Objetivo na Planilha */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Desafio da sua Planilha:
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {problem.objective}
                    </p>
                  </div>

                  {/* 3 Habilidades Específicas */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Habilidades específicas da missão:</span>
                    </span>
                    <div className="space-y-1">
                      {problem.specificTools.map((tool, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                          <strong className="text-slate-900 block text-[11px]">• {tool.category}</strong>
                          <span className="text-slate-500 text-[10px] block">{tool.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleOpenConfirmModal(problem)}
                    className={`w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Missão Selecionada (Ver Detalhes)</span>
                      </>
                    ) : (
                      <>
                        <span>Escolher esta Missão</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Confirmação Editorial */}
      {modalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                  CONFIRMAR MISSÃO 0{modalProblem.number}
                </span>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  {modalProblem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  1. Aprendendo o básico em aula:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Introdução ao ONLYOFFICE, criação de planilha, tabela, formatação, fórmulas fundamentais (SOMA, SUBTRAÇÃO, MÉDIA) e filtros.
                </p>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                  2. Desafios práticos da sua equipe:
                </span>
                <p className="text-emerald-950 font-semibold leading-relaxed">
                  {modalProblem.objective}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmChoice}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Gravando...' : 'Confirmar e Iniciar Missão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
