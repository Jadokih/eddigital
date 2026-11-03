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
      })
      .catch(() => {
        // Fallback silencioso: a digitação do nome permanece 100% funcional
      });
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
    if (!memberName.trim()) {
      setSubmitError('Digite o nome do integrante responsável por esta entrega.');
      return;
    }
    if (!file) {
      setSubmitError('Selecione o arquivo .xlsx gerado no ONLYOFFICE Desktop.');
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

  const canSubmit = !busy && !!memberName.trim() && !!file;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-delivery-title"
    >
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-zinc-200/80 bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900 text-white shadow-2xs">
              <Upload className="w-4 h-4 text-zinc-200" />
            </div>
            <div>
              <h3 id="submit-delivery-title" className="text-base font-serif font-normal text-zinc-900">
                {isReplacement ? 'Substituir entrega' : 'Enviar entrega'}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-1">{activity.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isReplacement && (
            <p className="text-xs text-slate-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
              A nova versão passa a ser a entrega oficial. As versões anteriores ficam guardadas no histórico.
            </p>
          )}

          {/* Responsável (Digitação do Nome) */}
          <div>
            <label htmlFor="responsible-member" className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 mb-1.5">
              <UserCheck className="w-4 h-4 text-zinc-500" />
              Nome do integrante responsável pelo envio *
            </label>
            <input
              id="responsible-member"
              type="text"
              required
              value={memberName}
              disabled={busy}
              placeholder="Digite seu nome completo..."
              list="team-members-list"
              autoComplete="name"
              onChange={(e) => {
                setMemberName(e.target.value);
                setSubmitError(null);
              }}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-normal"
            />
            {members && members.length > 0 && (
              <datalist id="team-members-list">
                {members.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            )}
            <p className="mt-1.5 text-[11px] text-zinc-500 flex items-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-px text-zinc-400" />
              O login é compartilhado pelo grupo: o nome digitado fica registrado como responsável pelo envio desta versão da planilha.
            </p>
          </div>

          {/* Arquivo */}
          <div>
            <label htmlFor="delivery-file" className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 mb-1.5">
              <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
              Arquivo da planilha (.xlsx) *
            </label>
            <input
              id="delivery-file"
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              disabled={busy}
              onChange={handleFileChange}
              className="block w-full text-xs text-zinc-700 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-zinc-300 file:bg-zinc-50 file:text-zinc-800 file:font-medium file:cursor-pointer hover:file:bg-zinc-100 cursor-pointer"
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              No ONLYOFFICE Desktop: salve a planilha no seu computador como <strong>.xlsx</strong> (menu Arquivo → Salvar como). Tamanho máximo: {formatBytes(MAX_DELIVERY_BYTES)}.
            </p>
            {file && !fileError && (
              <p className="mt-2 text-xs font-medium text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2">
                {file.name} • {formatBytes(file.size)}
              </p>
            )}
            {fileError && (
              <p className="mt-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Progresso */}
          {busy && (
            <div className="space-y-1.5" aria-live="polite">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
                <span>{phase === 'uploading' ? 'Enviando arquivo...' : 'Confirmando registro no servidor...'}</span>
                <span>{progress}%</span>
              </div>
              <div
                className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-zinc-900 h-full transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {submitError && !busy && (
            <p className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow"
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

