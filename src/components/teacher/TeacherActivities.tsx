import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  AlertCircle,
  Edit2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import type { Activity, ActivityInput, ClassName, Submission } from '../../types';
import { saveActivity, formatDateTime, formatScore } from '../../lib/deliveries';

interface TeacherActivitiesProps {
  activities: Activity[];
  submissions: Submission[];
  loading: boolean;
  onSaved: (activity: Activity) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const TeacherActivities: React.FC<TeacherActivitiesProps> = ({
  activities,
  submissions,
  onSaved,
  showToast,
}) => {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNew = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="neo-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Gerenciamento de Atividades
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Cadastre atividades e prazos para as turmas 2º2 e 2º3 enviarem suas planilhas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova atividade</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.length === 0 ? (
          <div className="col-span-2 neo-card-sm p-8 text-center text-slate-500">
            Nenhuma atividade cadastrada até o momento. Clique no botão acima para criar a primeira.
          </div>
        ) : (
          activities.map((activity) => {
            const countSubmissions = submissions.filter((s) => s.activity_id === activity.id && s.is_current).length;

            return (
              <div key={activity.id} className="neo-card-sm p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-base text-slate-900 line-clamp-2">
                      {activity.title}
                    </h3>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {activity.is_published ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Eye className="w-3 h-3" /> Publicada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                          <EyeOff className="w-3 h-3" /> Oculta
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {activity.instructions || 'Sem instruções detalhadas.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-medium text-slate-700">
                      Turmas: {activity.class_names.join(', ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-medium text-emerald-800">
                      Pontuação: {formatScore(activity.max_score)} pts
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-medium text-slate-700">
                      {countSubmissions} entregas recebidas
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prazo: {activity.due_at ? formatDateTime(activity.due_at) : 'Sem prazo'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {activity.accepts_submissions ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Recebendo envios
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Envios bloqueados
                      </span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleEdit(activity)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação / Edição de Atividade */}
      {isModalOpen && (
        <ActivityFormModal
          activity={editingActivity}
          onClose={() => setIsModalOpen(false)}
          onSaved={(act) => {
            onSaved(act);
            setIsModalOpen(false);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};

interface ActivityFormModalProps {
  activity: Activity | null;
  onClose: () => void;
  onSaved: (activity: Activity) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  activity,
  onClose,
  onSaved,
  showToast,
}) => {
  const [title, setTitle] = useState(activity?.title || '');
  const [instructions, setInstructions] = useState(activity?.instructions || '');
  const [dueAt, setDueAt] = useState(
    activity?.due_at ? new Date(activity.due_at).toISOString().slice(0, 16) : ''
  );
  const [maxScoreStr, setMaxScoreStr] = useState(
    activity ? String(activity.max_score) : '10'
  );
  const [classNames, setClassNames] = useState<ClassName[]>(
    activity?.class_names || ['2º2', '2º3']
  );
  const [isPublished, setIsPublished] = useState(activity?.is_published ?? true);
  const [acceptsSubmissions, setAcceptsSubmissions] = useState(activity?.accepts_submissions ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleClass = (c: ClassName) => {
    setClassNames((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Informe o título da atividade.');
      return;
    }
    if (classNames.length === 0) {
      setError('Selecione pelo menos uma turma.');
      return;
    }
    const parsedScore = parseFloat(maxScoreStr.replace(',', '.'));
    if (isNaN(parsedScore) || parsedScore <= 0) {
      setError('A pontuação máxima deve ser um número positivo.');
      return;
    }

    setSaving(true);
    try {
      const input: ActivityInput = {
        title: title.trim(),
        instructions: instructions.trim(),
        due_at: dueAt ? new Date(dueAt).toISOString() : null,
        max_score: parsedScore,
        class_names: classNames,
        is_published: isPublished,
        accepts_submissions: acceptsSubmissions,
      };

      const result = await saveActivity(input, activity?.id);
      showToast('success', activity ? 'Atividade atualizada!' : 'Atividade criada com sucesso!');
      onSaved(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar atividade.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-display font-semibold text-slate-900">
              {activity ? 'Editar atividade' : 'Cadastrar nova atividade'}
            </h3>
            <p className="text-xs text-slate-500">Configuração de prazos e pontuação</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Título da atividade *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Entrega 1 — Planilha de Custos Iniciais no ONLYOFFICE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Instruções e requisitos
            </label>
            <textarea
              rows={3}
              placeholder="Detalhe o que deve conter no arquivo (.xlsx)..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Data e horário de encerramento (prazo)
              </label>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pontuação máxima *
              </label>
              <input
                type="text"
                required
                value={maxScoreStr}
                onChange={(e) => setMaxScoreStr(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Turmas alvo *
            </label>
            <div className="flex gap-2">
              {(['2º2', '2º3'] as ClassName[]).map((c) => {
                const checked = classNames.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleClass(c)}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      checked
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Turma {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
              />
              <span>Publicar para os alunos visualizarem</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={acceptsSubmissions}
                onChange={(e) => setAcceptsSubmissions(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
              />
              <span>Permitir envio de arquivos</span>
            </label>
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
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Gravando...' : 'Salvar atividade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
