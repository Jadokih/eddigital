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
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* 1. CABEÇALHO EDITORIAL ABERTO */}
      <section className="space-y-3 pb-6 border-b border-zinc-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-normal text-zinc-500 uppercase tracking-wider block">
              Educação Digital • Etapa 1
            </span>
            <h2
              className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight font-normal"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              Escolha a missão prática da sua empresa
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed font-normal">
              Cada grupo escolhe uma situação real de mercado para resolver através de planilhas eletrônicas no
              ONLYOFFICE Desktop. Toda a turma aprende os fundamentos comuns em aula, e a sua equipe desenvolve os desafios
              específicos da missão escolhida.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-xs font-medium text-zinc-700 self-start md:self-auto shrink-0">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span>4 Situações-problema</span>
          </div>
        </div>
      </section>

      {/* BLOCO 1: FUNDAMENTOS BÁSICOS COMPARTILHADOS (GRADE ABERTA) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4
                className="text-base font-serif font-normal text-zinc-900"
                style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
              >
                1. Aprendendo o básico (Compartilhado com toda a turma)
              </h4>
              <p className="text-xs text-zinc-500 font-normal">
                Habilidades essenciais ensinadas pelo professor em aula antes dos desafios
              </p>
            </div>
          </div>
          <span className="text-xs font-normal text-zinc-500 hidden sm:inline">
            6 Fundamentos comuns
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COMMON_SPREADSHEET_TOOLS.map((tool, idx) => (
            <div key={idx} className="space-y-1 p-2 rounded-xl text-xs font-normal">
              <span className="text-[11px] font-mono text-zinc-400 block">
                Aula {idx + 1}
              </span>
              <strong className="text-zinc-900 text-xs font-medium block leading-tight">
                {tool.category}
              </strong>
              <p className="text-zinc-500 text-[11px] leading-snug line-clamp-2">
                {tool.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCO 2: AS 4 MISSÕES PRÁTICAS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-normal text-zinc-500 uppercase tracking-wider block mb-0.5">
              Autonomia da equipe
            </span>
            <h3
              className="text-xl sm:text-2xl font-serif font-normal text-zinc-900"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              2. Agora é com você (Escolha da missão)
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-normal hidden sm:inline">
            Selecione uma missão para vincular sua empresa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROBLEMS_DATA.map((problem) => {
            const isSelected = selectedProblemId === problem.id;
            const atmosphere = MISSION_ATMOSPHERES[problem.number];

            return (
              <div
                key={problem.id}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between gap-6 transition-all overflow-hidden ${
                  isSelected
                    ? 'border-zinc-900 ring-1 ring-zinc-900/10 shadow-sm'
                    : 'border-zinc-200/90 hover:border-zinc-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Fotografia Cinematográfica */}
                  <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden group">
                    <img
                      src={atmosphere?.image}
                      alt={atmosphere?.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <span className="text-xs font-normal px-3 py-1 rounded-full bg-zinc-900/80 text-white backdrop-blur-md">
                        Missão {problem.number} • {atmosphere?.category}
                      </span>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white text-zinc-900 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
                          Ativa
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-mono text-zinc-300 block mb-0.5">
                        {problem.tag}
                      </span>
                      <h4
                        className="text-lg font-serif font-normal text-white leading-snug line-clamp-1"
                        style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                      >
                        {problem.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {problem.description}
                  </p>

                  {/* Desafio prático da planilha em tipografia aberta (SEM CAIXA CINZA) */}
                  <div className="space-y-1 pt-1 border-t border-zinc-100">
                    <span className="text-xs font-medium text-zinc-800 block">
                      Desafio prático da planilha:
                    </span>
                    <p className="text-xs text-zinc-600 font-normal leading-relaxed">
                      {problem.objective}
                    </p>
                  </div>

                  {/* 3 Habilidades Específicas em lista limpa (SEM SUB-BOXES) */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                    <span className="text-xs font-medium text-zinc-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Habilidades específicas da missão:</span>
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-600 font-normal">
                      {problem.specificTools.map((tool, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-zinc-400 mt-0.5">•</span>
                          <span>
                            <strong className="text-zinc-800 font-medium">{tool.category}:</strong>{' '}
                            {tool.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleOpenConfirmModal(problem)}
                    className={`w-full py-2.5 px-4 rounded-full font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-zinc-600" />
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
      </section>

      {/* Modal de Confirmação Editorial */}
      {modalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-zinc-800">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-xs font-normal text-zinc-500 block">
                  Confirmar missão {modalProblem.number}
                </span>
                <h3
                  className="text-2xl font-serif font-normal text-zinc-900"
                  style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                >
                  {modalProblem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-800 block">
                  1. Aprendendo o básico em aula:
                </span>
                <p className="text-zinc-600 font-normal">
                  Introdução ao ONLYOFFICE, criação de planilha, tabela, formatação, fórmulas fundamentais (SOMA, SUBTRAÇÃO, MÉDIA) e filtros.
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-100">
                <span className="text-xs font-medium text-zinc-800 block">
                  2. Desafios práticos da sua equipe:
                </span>
                <p className="text-zinc-700 font-normal">
                  {modalProblem.objective}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200/60">
              <button
                type="button"
                onClick={() => setModalProblem(null)}
                className="px-4 py-2 rounded-full text-xs font-normal text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmChoice}
                className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
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
