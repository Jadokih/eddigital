import React, { useState } from 'react';
import type { Problem } from '../types';
import { PROBLEMS_DATA } from '../data/problems';
import {
  CheckCircle2,
  ArrowRight,
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

  const handleOpenConfirmModal = (problem: Problem) => {
    setModalProblem(problem);
  };

  const handleConfirmChoice = async () => {
    if (!modalProblem) return;
    setSubmitting(true);
    try {
      await onSelectProblem(modalProblem.id);
      confetti({
        particleCount: 70,
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

  // Ilustrações autorais estilo traço preto minimalista (match com Image 1)
  const renderIllustration = (problemNumber: number) => {
    switch (problemNumber) {
      case 1:
        // Finanças: personagem sentado com laptop e gráficos de barras
        return (
          <svg className="w-full h-36" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="2" rx="1" fill="#0f172a" />
            {/* Gráficos de barra ao fundo */}
            <rect x="135" y="65" width="12" height="40" rx="3" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 3" />
            <rect x="153" y="45" width="12" height="60" rx="3" stroke="#0f172a" strokeWidth="2" />
            <rect x="171" y="25" width="12" height="80" rx="3" fill="#dcfce7" stroke="#0f172a" strokeWidth="2" />
            <circle cx="177" cy="18" r="4" fill="#22c55e" />
            {/* Personagem estilizado em traço preto */}
            <circle cx="65" cy="40" r="14" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <path d="M60 40 Q65 44 70 40" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="61" cy="36" r="1.5" fill="#0f172a" />
            <circle cx="69" cy="36" r="1.5" fill="#0f172a" />
            {/* Corpo e mesa */}
            <path d="M50 78 C50 60 80 60 80 78" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            {/* Laptop */}
            <path d="M68 76 L92 76 L86 64 L74 64 Z" stroke="#0f172a" strokeWidth="2" fill="#ffffff" />
            <line x1="62" y1="78" x2="98" y2="78" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            {/* Símbolo de moeda/cálculo flutuando */}
            <circle cx="35" cy="50" r="10" stroke="#0f172a" strokeWidth="2" fill="#dcfce7" />
            <text x="35" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">$</text>
          </svg>
        );
      case 2:
        // Estoque: personagem empilhando caixas organizadas
        return (
          <svg className="w-full h-36" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="2" rx="1" fill="#0f172a" />
            {/* Caixas de estoque empilhadas */}
            <rect x="125" y="70" width="35" height="35" rx="4" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <line x1="125" y1="82" x2="160" y2="82" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="3 2" />
            <rect x="135" y="40" width="30" height="30" rx="4" stroke="#0f172a" strokeWidth="2.5" fill="#dcfce7" />
            <line x1="135" y1="52" x2="165" y2="52" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Personagem carregando caixa */}
            <circle cx="65" cy="35" r="13" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <path d="M61 35 Q65 39 69 35" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="61" cy="32" r="1.5" fill="#0f172a" />
            <circle cx="69" cy="32" r="1.5" fill="#0f172a" />
            <path d="M52 75 C52 55 78 55 78 75" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <line x1="58" y1="75" x2="55" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="72" y1="75" x2="75" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Caixa nas mãos */}
            <rect x="74" y="55" width="26" height="26" rx="3" stroke="#0f172a" strokeWidth="2" fill="#ffffff" />
            <path d="M87 55 L87 63" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        );
      case 3:
        // Tarefas: personagem subindo degraus com lápis (como no card central da Image 1)
        return (
          <svg className="w-full h-36" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="2" rx="1" fill="#0f172a" />
            {/* Degraus/escada de progresso */}
            <path d="M95 105 L95 85 L125 85 L125 65 L155 65 L155 45 L180 45" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="168" cy="35" r="4" fill="#22c55e" />
            {/* Personagem com lápis nos degraus */}
            <circle cx="70" cy="40" r="13" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <path d="M66 41 Q70 45 74 41" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="66" cy="37" r="1.5" fill="#0f172a" />
            <circle cx="74" cy="37" r="1.5" fill="#0f172a" />
            <path d="M60 80 C60 60 82 60 82 80" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            {/* Lápis gigante nas costas/mãos */}
            <g transform="rotate(-30 75 65)">
              <rect x="60" y="60" width="45" height="10" rx="2" stroke="#0f172a" strokeWidth="2" fill="#dcfce7" />
              <path d="M105 60 L115 65 L105 70 Z" stroke="#0f172a" strokeWidth="2" fill="#ffffff" />
              <circle cx="113" cy="65" r="1.5" fill="#0f172a" />
            </g>
            {/* Pernas subindo */}
            <line x1="68" y1="80" x2="72" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="78" y1="80" x2="95" y2="85" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 4:
      default:
        // Cadastros: dois personagens comemorando dados e registros organizados (como no card direito da Image 1)
        return (
          <svg className="w-full h-36" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="105" width="170" height="2" rx="1" fill="#0f172a" />
            {/* Linhas de dados / tabela ao fundo */}
            <rect x="30" y="25" width="40" height="50" rx="4" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="3 3" fill="#ffffff" />
            <line x1="36" y1="35" x2="64" y2="35" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="36" y1="45" x2="60" y2="45" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="36" y1="55" x2="55" y2="55" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="64" cy="55" r="2" fill="#22c55e" />
            {/* Personagem 1 (esquerda dando high-five) */}
            <circle cx="95" cy="42" r="12" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <circle cx="92" cy="40" r="1.5" fill="#0f172a" />
            <circle cx="98" cy="40" r="1.5" fill="#0f172a" />
            <path d="M85 80 C85 62 105 62 105 80" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <line x1="90" y1="80" x2="88" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="100" y1="80" x2="102" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Personagem 2 (direita dando high-five) */}
            <circle cx="140" cy="42" r="12" stroke="#0f172a" strokeWidth="2.5" fill="#ffffff" />
            <circle cx="137" cy="40" r="1.5" fill="#0f172a" />
            <circle cx="143" cy="40" r="1.5" fill="#0f172a" />
            <path d="M130 80 C130 62 150 62 150 80" stroke="#0f172a" strokeWidth="2.5" fill="#dcfce7" />
            <line x1="135" y1="80" x2="133" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="145" y1="80" x2="147" y2="105" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Braços cruzando no high-five */}
            <path d="M102 65 L118 48 L133 65" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="118" cy="46" r="3" fill="#22c55e" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-10" id="etapa-1-section">
      {/* Hero Section Editorial (Inspirado diretamente na Image 1 e Image 2) */}
      <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-8 pb-4">
        {/* Badge flutuante tipo Image 2 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-900/10 shadow-xs mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-800">Educação Digital • 2º Ano do Ensino Médio</span>
        </div>

        {/* Título com a icônica caixa de seleção verde da Image 1 */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.15]">
          Resolva desafios reais com{' '}
          <span className="highlight-anchor">
            planilhas
          </span>{' '}
          digitais.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Toda empresa nasce para atender a uma necessidade. Escolha abaixo a situação-problema do seu grupo e desenvolva uma solução estruturada na suíte <strong className="text-slate-900 font-semibold">ONLYOFFICE</strong>.
        </p>

        {/* Barra de controle segmentada / pílulas (match direto com Image 1) */}
        <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
          <span className="px-3 py-1 text-xs font-semibold text-slate-700 rounded-full bg-slate-100">
            1. Escolha a Missão
          </span>
          <span className="px-3 py-1 text-xs font-semibold text-slate-700 rounded-full bg-slate-100">
            2. Estruture Dados
          </span>
          <span className="px-3 py-1 text-xs font-semibold text-slate-700 rounded-full bg-slate-100">
            3. Domine Fórmulas
          </span>
          <span className="px-3.5 py-1 text-xs font-bold text-white rounded-full bg-emerald-600 shadow-xs">
            Etapa 1 Ativa
          </span>
        </div>
      </div>

      {/* Grade de Cards das 4 Missões (match com os cards da Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {PROBLEMS_DATA.map((problem) => {
          const isSelected = selectedProblemId === problem.id;

          return (
            <div
              key={problem.id}
              className={`neo-card p-6 sm:p-8 flex flex-col justify-between relative ${
                isSelected
                  ? 'ring-4 ring-emerald-400/40 border-slate-900 bg-white'
                  : 'bg-white'
              }`}
            >
              {/* Header do Card com Eyebrow em caixa alta */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 font-display">
                    MISSÃO 0{problem.number} • {problem.tag}
                  </span>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Escolhida
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-snug mb-2">
                  {problem.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
                  {problem.description}
                </p>

                {/* Ilustração Artística Traço Preto Minimalista (Idêntica à Image 1) */}
                <div className="bg-[#FAF9F5] rounded-2xl border border-slate-200/80 p-2 mb-5 flex items-center justify-center">
                  {renderIllustration(problem.number)}
                </div>

                {/* Box de Solução na Planilha */}
                <div className="space-y-3 mb-5">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Objetivo Prático na Planilha:
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {problem.objective}
                    </p>
                  </div>

                  {/* Tags das Ferramentas ONLYOFFICE */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <FileSpreadsheet className="w-3 h-3 text-slate-700" />
                      Recursos ONLYOFFICE que serão praticados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.onlyofficeTools.slice(0, 3).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-semibold text-slate-700"
                        >
                          {tool.category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Ação Estilo Pill / Neo-button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleOpenConfirmModal(problem)}
                  className={`w-full py-3 px-5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-[3px_3px_0px_#22c55e]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Missão Selecionada (Clique para rever)</span>
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

      {/* Modal de Confirmação no Estilo Neo-Editorial */}
      {modalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] max-w-lg w-full p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">
                  CONFIRMAR MISSÃO 0{modalProblem.number}
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900">
                  {modalProblem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Desafio da Empresa:
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {modalProblem.description}
                </p>
              </div>

              <div className="bg-[#FAF9F5] p-4 rounded-2xl border-2 border-slate-900">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                  O que o grupo criará na Planilha:
                </h4>
                <p className="text-slate-900 font-semibold leading-relaxed">
                  {modalProblem.objective}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tópicos trabalhados no ONLYOFFICE Planilhas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modalProblem.onlyofficeTools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <strong className="text-slate-900 block text-[11px]">{tool.category}</strong>
                      <span className="text-slate-600 text-[11px]">{tool.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmChoice}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-[2px_2px_0px_#22c55e] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Salvando...' : 'Confirmar e Iniciar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
