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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto py-2">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <h2
              className="text-xl font-serif font-semibold text-slate-900"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              Central de Entregas indisponível
            </h2>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              Esta sessão está operando em modo demonstração local. O envio de arquivos requer conexão ativa com o servidor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Central de entregas • ONLYOFFICE
            </span>
            <h2
              className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              Minhas entregas
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
              Envie aqui as planilhas da sua empresa no formato <strong className="text-slate-900">.xlsx</strong> e acompanhe em tempo real a nota e os comentários pedagógicos do professor.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-700 py-10 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-700" /> Carregando atividades...
        </div>
      )}

      {!loading && loadError && (
        <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5 bg-rose-50/50 flex items-start gap-3" role="alert">
          <WifiOff className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-900">Não foi possível carregar suas entregas</p>
            <p className="text-xs text-rose-800 mt-0.5">{loadError}</p>
          </div>
          <button
            type="button"
            onClick={load}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-rose-300 text-rose-900 bg-white hover:bg-rose-50 cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !loadError && activities.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center space-y-2">
          <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
          <p
            className="text-base font-serif font-semibold text-slate-900"
            style={{ fontFamily: "'Newsreader', serif" }}
          >
            Nenhuma atividade disponível no momento
          </p>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Assim que o professor publicar uma atividade para a turma {group.class_name}, o prazo e o botão de envio aparecerão aqui.
          </p>
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
            <article key={activity.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <h3
                    className="text-lg sm:text-xl font-serif font-semibold text-slate-900"
                    style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
                  >
                    {activity.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border ${
                        overdue ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <CalendarClock className="w-3.5 h-3.5 text-emerald-700" />
                      {activity.due_at ? `Prazo: ${formatDateTime(activity.due_at)}` : 'Sem prazo definido'}
                      {overdue && ' (encerrado)'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-slate-800 font-semibold">
                      Vale {formatScore(activity.max_score)} pts
                    </span>
                  </div>
                </div>
                <DeliveryStatusBadge status={status} late={current?.is_late} />
              </div>

              {activity.instructions && (
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line font-normal">
                  {activity.instructions}
                </div>
              )}

              {current && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                    <p className="font-bold text-slate-900">Entrega Atual — Versão {current.version}</p>
                    <p className="text-slate-700 break-all font-normal">
                      Arquivo: <strong className="text-slate-900 font-semibold">{current.original_filename}</strong> ({formatBytes(current.file_size)})
                    </p>
                    <p className="text-slate-700 font-normal">
                      Enviado por: <strong className="text-slate-900 font-semibold">{current.responsible_member_name}</strong> em {formatDateTime(current.submitted_at)}
                    </p>
                  </div>
                  {current.status === 'corrigida' ? (
                    <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 space-y-1.5">
                      <p className="font-bold text-emerald-950 text-sm">
                        Nota: {formatScore(current.score)} / {formatScore(activity.max_score)} pts
                      </p>
                      {current.feedback ? (
                        <p className="text-emerald-900 whitespace-pre-line flex gap-1.5 text-xs font-normal">
                          <MessageSquareText className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                          <span>{current.feedback}</span>
                        </p>
                      ) : (
                        <p className="text-emerald-800 text-xs font-medium">Sem comentários do professor.</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center font-medium">
                      Aguardando avaliação do professor.
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activity.accepts_submissions ? (
                  <button
                    type="button"
                    onClick={() => setModalActivity(activity)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {current ? 'Substituir entrega' : 'Enviar arquivo da planilha'}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200">
                    Entregas encerradas pelo professor
                  </span>
                )}
                {current && (
                  <button
                    type="button"
                    onClick={() => handleDownload(current)}
                    disabled={downloadingId === current.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" /> Baixar meu arquivo
                  </button>
                )}
                {versions.length > 0 && (
                  <button
                    type="button"
                    aria-expanded={historyOpen}
                    onClick={() => setOpenHistory((h) => ({ ...h, [activity.id]: !h[activity.id] }))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-emerald-700" /> Histórico ({versions.length})
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {historyOpen && (
                <ol className="border-t border-slate-200 pt-3 space-y-2">
                  {versions.map((v) => (
                    <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-slate-700 font-normal">
                        <span className="font-bold text-slate-900">v{v.version}</span>
                        {v.is_current && <span className="ml-1.5 text-emerald-800 font-bold">(atual)</span>} •{' '}
                        {formatDateTime(v.submitted_at)} • {v.responsible_member_name} •{' '}
                        <span className="break-all">{v.original_filename}</span>
                        {v.status === 'corrigida' && <> • nota {formatScore(v.score)}</>}
                        {v.is_late && <span className="text-rose-700 font-semibold"> • fora do prazo</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(v)}
                        disabled={downloadingId === v.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer disabled:opacity-50"
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
