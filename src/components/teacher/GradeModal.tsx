import React, { useState } from 'react';
import { X, Award, MessageSquareText, Save, Loader2, AlertCircle } from 'lucide-react';
import type { Activity, Submission } from '../../types';
import { gradeSubmission, formatScore } from '../../lib/deliveries';

interface GradeModalProps {
  submission: Submission;
  activity: Activity;
  companyName: string;
  onClose: () => void;
  onSuccess: (updated: Submission) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  submission,
  activity,
  companyName,
  onClose,
  onSuccess,
  showToast,
}) => {
  const [scoreStr, setScoreStr] = useState<string>(
    submission.score !== null && submission.score !== undefined ? String(submission.score) : ''
  );
  const [feedback, setFeedback] = useState<string>(submission.feedback || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedScore = parseFloat(scoreStr.replace(',', '.'));
    if (isNaN(parsedScore)) {
      setError('Informe uma nota numérica válida.');
      return;
    }

    if (parsedScore < 0 || parsedScore > activity.max_score) {
      setError(`A nota deve estar entre 0 e ${activity.max_score}.`);
      return;
    }

    setSaving(true);
    try {
      const updated = await gradeSubmission(submission.id, parsedScore, feedback);
      showToast('success', 'Avaliação registrada!', `Nota atribuída à empresa ${companyName}.`);
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar correção.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900 text-white">
              <Award className="w-4 h-4 text-zinc-200" />
            </div>
            <div>
              <h3 className="text-base font-display font-semibold text-slate-900">Corrigir entrega</h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {companyName} • Versão {submission.version}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Atividade:</span>
              <span className="font-medium text-slate-900">{activity.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Responsável pelo envio:</span>
              <span className="font-medium text-slate-900">{submission.responsible_member_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Arquivo:</span>
              <span className="font-medium text-slate-700">{submission.original_filename}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nota atribuída (Máx: {formatScore(activity.max_score)} pts) *
            </label>
            <input
              type="text"
              required
              inputMode="decimal"
              placeholder={`0 a ${activity.max_score}`}
              value={scoreStr}
              onChange={(e) => setScoreStr(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1">
              <MessageSquareText className="w-3.5 h-3.5 text-slate-500" />
              Comentários e orientações pedagógicas
            </label>
            <textarea
              rows={4}
              maxLength={5000}
              placeholder="Escreva aqui os pontos positivos da planilha e o que precisa ser ajustado..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Gravando...' : 'Salvar avaliação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

