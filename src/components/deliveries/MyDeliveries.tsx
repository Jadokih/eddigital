import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  ChevronDown,
  Download,
  History,
  Inbox,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Upload,
  WifiOff,
} from 'lucide-react';
import type { Activity, Group, Submission } from '../../types';
import {
  deliveryStatusOf,
  fetchGroupActivities,
  fetchMySubmissions,
  formatBytes,
  formatDateTime,
  formatScore,
  getGroupClient,
  getSignedDownloadUrl,
  isPastDue,
  triggerDownload,
} from '../../lib/deliveries';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';
import { SubmitDeliveryModal } from './SubmitDeliveryModal';

interface MyDeliveriesProps {
  group: Group;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const MyDeliveries: React.FC<MyDeliveriesProps> = ({ group, showToast }) => {
  const isConnected = !!getGroupClient();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(isConnected);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalActivity, setModalActivity] = useState<Activity | null>(null);
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isConnected) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [acts, subs] = await Promise.all([fetchGroupActivities(), fetchMySubmissions()]);
      setActivities(acts);
      setSubmissions(subs);
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    load();
  }, [load]);

  const byActivity = useMemo(() => {
    const map = new Map<string, Submission[]>();
    for (const s of submissions) {
      if (s.group_id !== group.id) continue;
      const list = map.get(s.activity_id) || [];
      list.push(s);
      map.set(s.activity_id, list);
    }
    for (const list of map.values()) list.sort((a, b) => b.version - a.version);
    return map;
  }, [submissions, group.id]);

  const handleDownload = async (s: Submission) => {
    setDownloadingId(s.id);
    try {
      triggerDownload(await getSignedDownloadUrl(getGroupClient(), s));
    } catch (err) {
      showToast('error', 'Download indisponível', (err as Error).message);
    } finally {
      setDownloadingId(null);
    }
  };

  // ---------- Estados sem conexão ----------
  if (!isConnected) {
    return (
      <div className="neo-card p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="flex items-start gap-3">
          <WifiOff className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">Minhas Entregas indisponível</h2>
            <p className="text-sm text-slate-600 mt-1">
              Esta sessão está em modo demonstração, sem conexão com o servidor. O envio de arquivos{' '}
              <strong>não pode ser realizado</strong> e nenhum arquivo é guardado neste navegador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="neo-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-display">
              Central de Entregas
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">Minhas Entregas</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Envie aqui as planilhas produzidas no ONLYOFFICE e acompanhe notas e comentários do professor.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 font-semibold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 py-10">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando atividades...
        </div>
      )}

      {!loading && loadError && (
        <div className="neo-card-sm p-5 bg-rose-50 flex items-start gap-3" role="alert">
          <WifiOff className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-900">Não foi possível carregar suas entregas</p>
            <p className="text-xs text-rose-800 mt-0.5">{loadError}</p>
            <p className="text-xs text-rose-800 mt-1">Enquanto isso, o envio de arquivos não pode ser realizado.</p>
          </div>
          <button
            type="button"
            onClick={load}
            className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-rose-900 text-rose-900 bg-white cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !loadError && activities.length === 0 && (
        <div className="neo-card-sm p-8 text-center">
          <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800 mt-2">Nenhuma atividade disponível ainda</p>
          <p className="text-xs text-slate-500 mt-1">Quando o professor publicar uma atividade para a turma {group.class_name}, ela aparecerá aqui.</p>
        </div>
      )}

      {!loading &&
        !loadError &&
        activities.map((activity) => {
          const versions = byActivity.get(activity.id) || [];
          const current = versions.find((v) => v.is_current) || versions[0];
          const status = deliveryStatusOf(current);
          const overdue = isPastDue(activity);
          const historyOpen = !!openHistory[activity.id];

          return (
            <article key={activity.id} className="neo-card-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-display font-bold text-slate-900">{activity.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-semibold ${
                        overdue ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-100 border-slate-300'
                      }`}
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      {activity.due_at ? `Prazo: ${formatDateTime(activity.due_at)}` : 'Sem prazo definido'}
                      {overdue && ' (encerrado)'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-slate-300 bg-white font-semibold">
                      Vale {formatScore(activity.max_score)} pts
                    </span>
                  </div>
                </div>
                <DeliveryStatusBadge status={status} late={current?.is_late} />
              </div>

              {activity.instructions && (
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F5] p-4 rounded-2xl border border-slate-300 whitespace-pre-line">
                  {activity.instructions}
                </div>
              )}

              {current && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-300 bg-white space-y-0.5">
                    <p className="font-bold text-slate-900">Entrega atual — versão {current.version}</p>
                    <p className="text-slate-600 break-all">
                      {current.original_filename} • {formatBytes(current.file_size)}
                    </p>
                    <p className="text-slate-600">
                      Enviado por <strong>{current.responsible_member_name}</strong> em {formatDateTime(current.submitted_at)}
                    </p>
                  </div>
                  {current.status === 'corrigida' ? (
                    <div className="p-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 space-y-1">
                      <p className="font-bold text-emerald-900">
                        Nota: {formatScore(current.score)} / {formatScore(activity.max_score)}
                      </p>
                      {current.feedback ? (
                        <p className="text-emerald-900 whitespace-pre-line flex gap-1.5">
                          <MessageSquareText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          {current.feedback}
                        </p>
                      ) : (
                        <p className="text-emerald-800">Sem comentários do professor.</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 flex items-center">
                      Aguardando correção do professor.
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activity.accepts_submissions ? (
                  <button
                    type="button"
                    onClick={() => setModalActivity(activity)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-[2px_2px_0px_#22c55e] cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {current ? 'Substituir entrega' : 'Enviar arquivo'}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 px-3 py-2 rounded-full bg-slate-100 border border-slate-300">
                    Entregas encerradas pelo professor
                  </span>
                )}
                {current && (
                  <button
                    type="button"
                    onClick={() => handleDownload(current)}
                    disabled={downloadingId === current.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-800 font-semibold text-xs border-2 border-slate-900 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar meu arquivo
                  </button>
                )}
                {versions.length > 0 && (
                  <button
                    type="button"
                    aria-expanded={historyOpen}
                    onClick={() => setOpenHistory((h) => ({ ...h, [activity.id]: !h[activity.id] }))}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" /> Histórico ({versions.length})
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {historyOpen && (
                <ol className="border-t-2 border-slate-900 pt-3 space-y-2">
                  {versions.map((v) => (
                    <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 text-xs p-2.5 rounded-xl bg-[#FAF9F5] border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900">v{v.version}</span>
                        {v.is_current && <span className="ml-1.5 text-emerald-700 font-bold">(atual)</span>} •{' '}
                        {formatDateTime(v.submitted_at)} • {v.responsible_member_name} •{' '}
                        <span className="break-all">{v.original_filename}</span>
                        {v.status === 'corrigida' && <> • nota {formatScore(v.score)}</>}
                        {v.is_late && <span className="text-rose-700 font-semibold"> • fora do prazo</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(v)}
                        disabled={downloadingId === v.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-900 bg-white font-semibold cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-3 h-3" /> Baixar
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          );
        })}

      {modalActivity && (
        <SubmitDeliveryModal
          group={group}
          activity={modalActivity}
          isReplacement={(byActivity.get(modalActivity.id) || []).length > 0}
          onClose={() => setModalActivity(null)}
          onSubmitted={() => {
            setModalActivity(null);
            load();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};

