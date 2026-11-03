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

// Fotografias com atmosfera visual própria para cada missão
const MISSION_ATMOSPHERES: Record<number, { image: string; alt: string; category: string }> = {
  1: {
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    alt: 'Análise financeira e planejamento com iluminação lateral de estúdio',
    category: 'Finanças & Custos',
  },
  2: {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    alt: 'Centro logístico moderno com iluminação arquitetônica',
    category: 'Logística & Estoque',
  },
  3: {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    alt: 'Ambiente de projetos e cronogramas estratégicos',
    category: 'Projetos & Prazos',
  },
  4: {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    alt: 'Rede geométrica de conexões e registros de dados',
    category: 'Dados & Cadastros',
  },
};

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Banner Introdutório */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Educação Digital • Etapa 1
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-900 tracking-tight font-semibold"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Escolha a missão prática da sua empresa
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed">
              Cada grupo escolhe uma situação real de mercado para resolver através de planilhas eletrônicas no
              ONLYOFFICE. Toda a turma aprende os fundamentos comuns em aula, e a sua equipe desenvolve os desafios
              específicos da missão escolhida.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 self-start md:self-auto shrink-0">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>4 Situações-problema</span>
          </div>
        </div>
      </div>

      {/* BLOCO 1: FUNDAMENTOS BÁSICOS COMPARTILHADOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4
                className="text-base font-serif font-semibold text-slate-900"
                style={{ fontFamily: "'Newsreader', serif" }}
              >
                1. Aprendendo o básico (Compartilhado com toda a turma)
              </h4>
              <p className="text-xs text-slate-600">
                Habilidades essenciais ensinadas pelo professor em aula antes dos desafios
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 hidden sm:inline">
            6 Fundamentos comuns
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COMMON_SPREADSHEET_TOOLS.map((tool, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-600 block">
                Aula {idx + 1}
              </span>
              <strong className="text-slate-900 text-xs font-semibold block leading-tight">
                {tool.category}
              </strong>
              <p className="text-slate-700 text-[11px] leading-snug line-clamp-2">
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
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
              Autonomia da equipe
            </span>
            <h3
              className="text-xl sm:text-2xl font-serif font-semibold text-slate-900"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              2. Agora é com você (Escolha da missão)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-600 hidden sm:inline">
            Selecione uma missão para vincular sua empresa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {PROBLEMS_DATA.map((problem) => {
            const isSelected = selectedProblemId === problem.id;
            const atmosphere = MISSION_ATMOSPHERES[problem.number];

            return (
              <div
                key={problem.id}
                className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between gap-5 transition-all overflow-hidden ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Fotografia Cinematográfica */}
                  <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={atmosphere?.image}
                      alt={atmosphere?.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-900/90 text-white backdrop-blur-md">
                        Missão {problem.number} • {atmosphere?.category}
                      </span>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 text-slate-950 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ativa
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-semibold text-emerald-400 block mb-0.5">
                        {problem.tag}
                      </span>
                      <h4
                        className="text-lg font-serif font-semibold text-white leading-snug line-clamp-1"
                        style={{ fontFamily: "'Newsreader', serif" }}
                      >
                        {problem.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {problem.description}
                  </p>

                  {/* Box de Objetivo na Planilha */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">
                      Desafio prático da planilha:
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {problem.objective}
                    </p>
                  </div>

                  {/* 3 Habilidades Específicas */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Habilidades específicas da missão:</span>
                    </span>
                    <div className="space-y-1">
                      {problem.specificTools.map((tool, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <strong className="text-slate-900 block text-xs">• {tool.category}</strong>
                          <span className="text-slate-700 text-[11px] block">{tool.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleOpenConfirmModal(problem)}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Missão selecionada (ver detalhes)</span>
                      </>
                    ) : (
                      <>
                        <span>Escolher esta missão</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  Confirmar missão {modalProblem.number}
                </span>
                <h3
                  className="text-xl font-serif font-semibold text-slate-900"
                  style={{ fontFamily: "'Newsreader', serif" }}
                >
                  {modalProblem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  1. Aprendendo o básico em aula:
                </span>
                <p className="text-slate-700 leading-relaxed font-normal">
                  Introdução ao ONLYOFFICE, criação de planilha, tabela, formatação, fórmulas fundamentais (SOMA, SUBTRAÇÃO, MÉDIA) e filtros.
                </p>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">
                  2. Desafios práticos da sua equipe:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {modalProblem.objective}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmChoice}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {submitting ? 'Gravando...' : 'Confirmar e iniciar missão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
