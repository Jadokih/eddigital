import React, { useEffect, useRef, useState } from 'react';
import { FileSpreadsheet, Loader2, ShieldCheck, Upload, UserCheck, X } from 'lucide-react';
import type { Activity, Group, Submission } from '../../types';
import {
  DeliveryUnavailableError,
  MAX_DELIVERY_BYTES,
  fetchMyMembers,
  formatBytes,
  submitDelivery,
  validateXlsxFile,
} from '../../lib/deliveries';

interface SubmitDeliveryModalProps {
  group: Group;
  activity: Activity;
  isReplacement: boolean;
  onClose: () => void;
  onSubmitted: (submission: Submission) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

type Phase = 'idle' | 'uploading' | 'registering';

export const SubmitDeliveryModal: React.FC<SubmitDeliveryModalProps> = ({
  group,
  activity,
  isReplacement,
  onClose,
  onSubmitted,
  showToast,
}) => {
  const [members, setMembers] = useState<string[] | null>(null);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Um identificador por arquivo escolhido: novas tentativas do MESMO arquivo não duplicam a entrega.
  const requestIdRef = useRef<string>(crypto.randomUUID());
  const inFlightRef = useRef(false);

  const busy = phase !== 'idle';

  useEffect(() => {
    let active = true;
    fetchMyMembers()
      .then((list) => {
        if (!active) return;
        setMembers(list);
        if (list.length === 0) setMembersError('Nenhum integrante cadastrado. Atualize os dados da empresa antes de enviar.');
      })
      .catch((err: Error) => active && setMembersError(err.message));
    return () => {
      active = false;
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setSubmitError(null);
    requestIdRef.current = crypto.randomUUID();
    if (!selected) {
      setFile(null);
      setFileError(null);
      return;
    }
    const result = await validateXlsxFile(selected);
    if (!result.ok) {
      setFile(null);
      setFileError(result.error || 'Arquivo inválido.');
      e.target.value = '';
      return;
    }
    setFile(selected);
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlightRef.current) return; // trava contra cliques duplos
    if (!memberName) {
      setSubmitError('Selecione o integrante responsável por esta entrega.');
      return;
    }
    if (!file) {
      setSubmitError('Selecione o arquivo .xlsx produzido no ONLYOFFICE.');
      return;
    }

    inFlightRef.current = true;
    setSubmitError(null);
    setProgress(0);
    setPhase('uploading');
    try {
      const submission = await submitDelivery({
        group,
        activity,
        memberName,
        file,
        clientRequestId: requestIdRef.current,
        onProgress: (p) => {
          setProgress(p);
          if (p >= 100) setPhase('registering');
        },
      });
      showToast(
        'success',
        `Entrega registrada (versão ${submission.version})`,
        `Arquivo "${submission.original_filename}" recebido. Responsável: ${submission.responsible_member_name}.`
      );
      onSubmitted(submission);
    } catch (err) {
      const message = (err as Error).message || 'Falha ao enviar.';
      setSubmitError(message);
      showToast('error', err instanceof DeliveryUnavailableError ? 'Envio não realizado' : 'Erro no envio', message);
    } finally {
      inFlightRef.current = false;
      setPhase('idle');
    }
  };

  const canSubmit = !busy && !!memberName && !!file && !membersError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-delivery-title"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-2xs">
              <Upload className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 id="submit-delivery-title" className="text-base font-display font-bold text-slate-900">
                {isReplacement ? 'Substituir entrega' : 'Enviar entrega'}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">{activity.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isReplacement && (
            <p className="text-xs text-slate-700 bg-blue-50 border border-blue-200 rounded-xl p-3">
              A nova versão passa a ser a entrega oficial. As versões anteriores ficam guardadas no histórico.
            </p>
          )}

          {/* Responsável */}
          <div>
            <label htmlFor="responsible-member" className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mb-1.5">
              <UserCheck className="w-4 h-4 text-slate-700" />
              Quem é o integrante responsável por esta entrega? *
            </label>
            {members === null && !membersError ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Carregando integrantes da empresa...
              </div>
            ) : membersError ? (
              <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{membersError}</p>
            ) : (
              <select
                id="responsible-member"
                required
                value={memberName}
                disabled={busy}
                onChange={(e) => {
                  setMemberName(e.target.value);
                  setSubmitError(null);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold cursor-pointer shadow-2xs"
              >
                <option value="" disabled>
                  Selecione um integrante...
                </option>
                {members!.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
            <p className="mt-1.5 text-[11px] text-slate-500 flex items-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-px text-slate-400" />
              O login é compartilhado pelo grupo: fica registrado o integrante <strong>declarado</strong> como
              responsável, junto com a data e o horário do envio.
            </p>
          </div>

          {/* Arquivo */}
          <div>
            <label htmlFor="delivery-file" className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mb-1.5">
              <FileSpreadsheet className="w-4 h-4 text-slate-700" />
              Arquivo da planilha (.xlsx) *
            </label>
            <input
              id="delivery-file"
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              disabled={busy}
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-700 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border file:border-slate-300 file:bg-slate-50 file:text-slate-800 file:font-bold file:cursor-pointer hover:file:bg-slate-100 cursor-pointer"
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              No ONLYOFFICE: Arquivo → Baixar como → <strong>XLSX</strong>. Tamanho máximo: {formatBytes(MAX_DELIVERY_BYTES)}.
            </p>
            {file && !fileError && (
              <p className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                {file.name} • {formatBytes(file.size)}
              </p>
            )}
            {fileError && (
              <p className="mt-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Progresso */}
          {busy && (
            <div className="space-y-1.5" aria-live="polite">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{phase === 'uploading' ? 'Enviando arquivo...' : 'Confirmando registro no servidor...'}</span>
                <span>{progress}%</span>
              </div>
              <div
                className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-emerald-500 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {submitError && !busy && (
            <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{busy ? 'Enviando...' : isReplacement ? 'Enviar nova versão' : 'Enviar entrega'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

