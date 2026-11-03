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
      <div className="ed-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-900">
              Central de correções
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Gerencie, baixe os arquivos enviados e lance notas e feedbacks pedagógicos.
            </p>
          </div>

          <button
            type="button"
            onClick={onReload}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-slate-700 font-medium text-xs border border-slate-200 hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar dados</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Filtro Turma */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Turma
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-slate-900"
            >
              <option value="todas">Todas as turmas (2º2 e 2º3)</option>
              <option value="2º2">Turma 2º2</option>
              <option value="2º3">Turma 2º3</option>
            </select>
          </div>

          {/* Filtro Atividade */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Atividade
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-slate-900"
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
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Situação da entrega
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer text-slate-900"
            >
              <option value="todos">Todos os status</option>
              <option value="pendentes">Pendentes (não enviou)</option>
              <option value="entregues">Aguardando correção</option>
              <option value="corrigidas">Já corrigidas</option>
            </select>
          </div>

          {/* Busca por Nome/Membro */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Buscar empresa ou aluno
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: Coffee, Gustavo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Entregas */}
      <div className="ed-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium text-xs">
                <th className="py-3 px-4">Empresa / turma</th>
                <th className="py-3 px-4">Integrantes da equipe</th>
                <th className="py-3 px-4">Atividade</th>
                <th className="py-3 px-4">Responsável declarado</th>
                <th className="py-3 px-4">Status & data</th>
                <th className="py-3 px-4 text-center">Nota</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Nenhuma entrega encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                rows.map(({ group, activity, submission, status }, idx) => (
                  <tr key={`${group.id}_${activity?.id || idx}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{group.company_name}</span>
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        Turma {group.class_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-slate-600 line-clamp-2" title={group.members}>
                        {group.members}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      {activity ? (
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{activity.title}</p>
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

                    <td className="py-3.5 px-4 text-center font-display font-medium">
                      {submission?.score !== null && submission?.score !== undefined ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-medium">
                          {formatScore(submission.score)} pts
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-xs">—</span>
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
                              className="p-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 bg-white text-zinc-700 transition-colors cursor-pointer"
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
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors cursor-pointer"
                            >
                              <Award className="w-3 h-3 text-zinc-200" />
                              <span>{submission.status === 'corrigida' ? 'Reavaliar' : 'Avaliar'}</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
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
