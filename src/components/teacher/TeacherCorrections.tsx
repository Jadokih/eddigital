import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  Award,
  RefreshCw,
  Building2,
} from 'lucide-react';
import type { Activity, Group, Submission, ClassName } from '../../types';
import {
  formatDateTime,
  formatBytes,
  formatScore,
  getTeacherClient,
  getSignedDownloadUrl,
  triggerDownload,
} from '../../lib/deliveries';
import { DeliveryStatusBadge } from '../deliveries/DeliveryStatusBadge';
import { GradeModal } from './GradeModal';

interface TeacherCorrectionsProps {
  groups: Group[];
  activities: Activity[];
  submissions: Submission[];
  loading: boolean;
  onReload: () => void;
  onGraded: (updated: Submission) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const TeacherCorrections: React.FC<TeacherCorrectionsProps> = ({
  groups,
  activities,
  submissions,
  loading,
  onReload,
  onGraded,
  showToast,
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassName | 'todas'>('todas');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendentes' | 'entregues' | 'corrigidas'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradingSubmission, setGradingSubmission] = useState<{
    submission: Submission;
    activity: Activity;
    companyName: string;
  } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Mapeamento de entregas mais recentes (is_current) por [group_id_activity_id]
  const currentSubmissionsMap = useMemo(() => {
    const map = new Map<string, Submission>();
    submissions.forEach((s) => {
      if (s.is_current) {
        map.set(`${s.group_id}_${s.activity_id}`, s);
      }
    });
    return map;
  }, [submissions]);

  // Montar lista de linhas para a tabela (Empresa x Atividade selecionada)
  const rows = useMemo(() => {
    const list: Array<{
      group: Group;
      activity?: Activity;
      submission?: Submission;
      status: 'pendente' | 'entregue' | 'corrigida';
    }> = [];

    // Se uma atividade específica estiver selecionada
    if (selectedActivityId !== 'todas') {
      const act = activities.find((a) => a.id === selectedActivityId);
      if (!act) return list;

      groups.forEach((g) => {
        // Filtrar se a atividade pertence à turma do grupo
        if (!act.class_names.includes(g.class_name)) return;
        if (selectedClass !== 'todas' && g.class_name !== selectedClass) return;

        const sub = currentSubmissionsMap.get(`${g.id}_${act.id}`);
        const status = !sub ? 'pendente' : sub.status;

        if (statusFilter === 'pendentes' && status !== 'pendente') return;
        if (statusFilter === 'entregues' && status !== 'entregue') return;
        if (statusFilter === 'corrigidas' && status !== 'corrigida') return;

        if (
          searchTerm &&
          !g.company_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !g.members.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return;
        }

        list.push({ group: g, activity: act, submission: sub, status });
      });
    } else {
      // Quando todas as atividades estão selecionadas, lista por entregas realizadas
      submissions.forEach((s) => {
        if (!s.is_current) return;
        const g = groups.find((grp) => grp.id === s.group_id);
        const a = activities.find((act) => act.id === s.activity_id);
        if (!g || !a) return;

        if (selectedClass !== 'todas' && g.class_name !== selectedClass) return;
        if (statusFilter === 'entregues' && s.status !== 'entregue') return;
        if (statusFilter === 'corrigidas' && s.status !== 'corrigida') return;
        if (statusFilter === 'pendentes') return; // no modo "todas", pendente exige filtrar por atividade

        if (
          searchTerm &&
          !g.company_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !g.members.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !s.responsible_member_name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return;
        }

        list.push({ group: g, activity: a, submission: s, status: s.status });
      });
    }

    return list;
  }, [groups, activities, submissions, selectedClass, selectedActivityId, statusFilter, searchTerm, currentSubmissionsMap]);

  const handleDownload = async (sub: Submission) => {
    setDownloadingId(sub.id);
    try {
      const url = await getSignedDownloadUrl(getTeacherClient(), sub);
      triggerDownload(url);
    } catch (err: any) {
      showToast('error', 'Download falhou', err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros e Busca */}
      <div className="neo-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              Central de Correções
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Gerencie, baixe os arquivos enviados e lance notas e feedbacks pedagógicos.
            </p>
          </div>

          <button
            type="button"
            onClick={onReload}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 font-semibold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar dados
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Filtro Turma */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Turma
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="todas">Todas as Turmas (2º2 e 2º3)</option>
              <option value="2º2">Turma 2º2</option>
              <option value="2º3">Turma 2º3</option>
            </select>
          </div>

          {/* Filtro Atividade */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Atividade
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="todas">Todas as entregas realizadas</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.class_names.join(', ')})
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Situação */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Situação da Entrega
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="todos">Todos os status</option>
              <option value="pendentes">Pendentes (Não enviou)</option>
              <option value="entregues">Aguardando Correção</option>
              <option value="corrigidas">Já Corrigidas</option>
            </select>
          </div>

          {/* Busca por Nome/Membro */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Buscar Empresa ou Aluno
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: Coffee, Gustavo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Entregas */}
      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white font-display text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Empresa / Turma</th>
                <th className="py-3 px-4">Integrantes da Equipe</th>
                <th className="py-3 px-4">Atividade</th>
                <th className="py-3 px-4">Responsável Declarado</th>
                <th className="py-3 px-4">Status & Data</th>
                <th className="py-3 px-4 text-center">Nota</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Nenhuma entrega encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                rows.map(({ group, activity, submission, status }, idx) => (
                  <tr key={`${group.id}_${activity?.id || idx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span>{group.company_name}</span>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                        Turma {group.class_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-slate-700 line-clamp-2" title={group.members}>
                        {group.members}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      {activity ? (
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{activity.title}</p>
                          <span className="text-[10px] text-slate-500">Max: {formatScore(activity.max_score)} pts</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {submission ? (
                        <div className="font-semibold text-slate-900 text-xs">
                          {submission.responsible_member_name}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Pendente</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <DeliveryStatusBadge status={status} late={submission?.is_late} />
                        {submission && (
                          <p className="text-[10px] text-slate-500">
                            {formatDateTime(submission.submitted_at)} • v{submission.version}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-display font-bold">
                      {submission?.score !== null && submission?.score !== undefined ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 text-xs">
                          {formatScore(submission.score)} pts
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {submission ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDownload(submission)}
                              disabled={downloadingId === submission.id}
                              title={`Baixar ${submission.original_filename} (${formatBytes(submission.file_size)})`}
                              className="p-2 rounded-full border border-slate-300 hover:border-slate-900 bg-white text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                activity &&
                                setGradingSubmission({
                                  submission,
                                  activity,
                                  companyName: group.company_name,
                                })
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                            >
                              <Award className="w-3 h-3 text-emerald-400" />
                              <span>{submission.status === 'corrigida' ? 'Reavaliar' : 'Avaliar'}</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            Aguardando envio
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Avaliação / Nota */}
      {gradingSubmission && (
        <GradeModal
          submission={gradingSubmission.submission}
          activity={gradingSubmission.activity}
          companyName={gradingSubmission.companyName}
          onClose={() => setGradingSubmission(null)}
          onSuccess={(updated) => {
            onGraded(updated);
            onReload();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
