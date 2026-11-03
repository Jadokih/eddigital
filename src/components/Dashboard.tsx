import React from 'react';
import type { Group, Problem } from '../types';
import {
  PlayCircle,
  Edit3,
  ArrowRight,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';

interface DashboardProps {
  group: Group;
  selectedProblem: Problem | null;
  onContinueActivity: () => void;
  onEditCompany: () => void;
  onNavigateDeliveries?: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  group,
  selectedProblem,
  onContinueActivity,
  onEditCompany,
  onNavigateDeliveries,
}) => {
  const membersList = group.members
    ? group.members
        .split(/[,;\n]+|\s[eE]\s/)
        .map((m) => m.trim().replace(/^[\s.]+|[\s.]+$/g, ''))
        .filter(Boolean)
    : [];

  const completedCount = group.completed_objectives?.length || 0;
  const totalCount = selectedProblem?.learningObjectives.length || 9;
  const progressPercent = selectedProblem
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  // Próxima aula não concluída
  const nextObjective = selectedProblem?.learningObjectives.find(
    (obj) => !(group.completed_objectives || []).includes(obj.id)
  ) || selectedProblem?.learningObjectives[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* 1. HERO DA EMPRESA: IDENTIFICAÇÃO EDITORIAL LIMPA */}
      <div className="cinematic-panel p-6 sm:p-8 relative overflow-hidden">
        {/* Luz de fundo sutil */}
        <div className="cinematic-glow w-72 h-72 bg-emerald-500/10 -top-20 -right-20" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Logo da Empresa */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#060B14] flex items-center justify-center text-white shadow-md">
              {group.logo_url ? (
                <img
                  src={group.logo_url}
                  alt={group.company_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-serif font-medium text-2xl tracking-wider text-emerald-400"
                  style={{ fontFamily: "'Newsreader', serif" }}
                >
                  {group.company_name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                  Turma {group.class_name}
                </span>
                {selectedProblem && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {selectedProblem.shortTitle}
                  </span>
                )}
                <span className="text-xs text-slate-400 hidden sm:inline">
                  • {group.business_sector}
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-100 tracking-tight font-medium"
                style={{ fontFamily: "'Newsreader', serif" }}
              >
                {group.company_name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {group.description || 'Laboratório de Empreendedorismo Digital • Ensino Médio'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditCompany}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Editar perfil</span>
          </button>
        </div>

        {/* Sócios Fundadores em linha limpa */}
        {membersList.length > 0 && (
          <div className="pt-5 mt-5 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs text-slate-400 relative z-10">
            <span className="text-slate-500">Fundadores:</span>
            {membersList.map((member, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
              >
                {member}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. CARD DE FOCO DO DIA: DIRECIONAMENTO IMEDIATO */}
      <div className="ed-card-dark p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="space-y-2.5 relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Atividade do dia • ONLYOFFICE</span>
          </div>

          <h3
            className="text-xl sm:text-2xl lg:text-3xl font-serif text-white tracking-tight font-medium leading-snug"
            style={{ fontFamily: "'Newsreader', serif" }}
          >
            {selectedProblem
              ? progressPercent === 100
                ? 'Todas as metas dominadas: faça a entrega do dia'
                : nextObjective?.title || 'Continuar trilha de planilhas'
              : 'Selecione a situação-problema da sua empresa'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
            {selectedProblem
              ? progressPercent === 100
                ? 'Sua equipe completou todas as habilidades. Salve a planilha em formato .xlsx e faça o envio na Central de Entregas.'
                : nextObjective?.description ||
                  `Sua equipe dominou ${completedCount} de ${totalCount} habilidades. Acesse a aula para aplicar na sua empresa.`
              : 'Cada equipe desenvolve soluções para uma situação-problema real (Finanças, Estoque, Projetos ou Cadastros).'}
          </p>
        </div>

        {/* Botões de Ação Direta */}
        <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
          {selectedProblem && progressPercent === 100 && onNavigateDeliveries ? (
            <button
              type="button"
              onClick={onNavigateDeliveries}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Entregar planilha (.xlsx)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinueActivity}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{selectedProblem ? 'Entrar na atividade de hoje' : 'Escolher missão'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {onNavigateDeliveries && selectedProblem && (
            <button
              type="button"
              onClick={onNavigateDeliveries}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Ver minhas entregas</span>
            </button>
          )}
        </div>

        {/* Barra Linear de Progresso Discreta */}
        {selectedProblem && (
          <div className="pt-4 border-t border-white/10 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Progresso: {completedCount} de {totalCount} habilidades concluídas
              </span>
              <span className="text-emerald-400 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
