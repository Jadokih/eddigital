import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardCheck, GraduationCap, ListChecks, Loader2, Lock, LogOut, Mail, WifiOff } from 'lucide-react';
import { ToastContainer } from '../Toast';
import type { ToastMessage, ToastType } from '../Toast';
import type { Activity, Group, Submission } from '../../types';
import {
  fetchAllActivities,
  fetchAllGroups,
  fetchAllSubmissions,
  getTeacherClient,
  getTeacherSessionEmail,
  teacherSignIn,
  teacherSignOut,
} from '../../lib/deliveries';
import { TeacherCorrections } from './TeacherCorrections';
import { TeacherActivities } from './TeacherActivities';

export type ShowToast = (type: ToastType, title: string, message?: string) => void;

export const TeacherApp: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [checking, setChecking] = useState(true);
  const [teacherEmail, setTeacherEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<'corrections' | 'activities'>('corrections');

  const [groups, setGroups] = useState<Group[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const showToast: ShowToast = useCallback((type, title, message) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, title, message }]);
  }, []);
  const removeToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const isConnected = !!getTeacherClient();

  useEffect(() => {
    getTeacherSessionEmail()
      .then(setTeacherEmail)
      .finally(() => setChecking(false));
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [g, a, s] = await Promise.all([fetchAllGroups(), fetchAllActivities(), fetchAllSubmissions()]);
      setGroups(g);
      setActivities(a);
      setSubmissions(s);
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (teacherEmail) loadAll();
  }, [teacherEmail, loadAll]);

  const handleLogout = async () => {
    await teacherSignOut();
    setTeacherEmail(null);
    setGroups([]);
    setActivities([]);
    setSubmissions([]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <header className="sticky top-3 z-40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl px-4 sm:px-6 py-2.5 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="font-display font-semibold text-slate-900 text-base sm:text-lg tracking-tight">
              Founders<span className="text-emerald-600">Grid</span>
            </span>
            <span className="hidden md:inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
              Área do professor
            </span>
          </div>
          {teacherEmail && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-slate-500 max-w-[200px] truncate">{teacherEmail}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!isConnected ? (
          <div className="ed-card p-8 max-w-xl mx-auto flex gap-3">
            <WifiOff className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h1 className="text-xl font-display font-semibold text-slate-900">Servidor não configurado</h1>
              <p className="text-sm text-slate-600 mt-1">
                A Central de Correções exige conexão com o Supabase. Ela não funciona em modo demonstração.
              </p>
            </div>
          </div>
        ) : checking ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Verificando sessão...
          </div>
        ) : !teacherEmail ? (
          <TeacherLogin
            onSuccess={(email) => {
              setTeacherEmail(email);
              showToast('success', 'Bem-vindo(a), professor(a)!');
            }}
            showToast={showToast}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1">
                {(
                  [
                    ['corrections', 'Central de correções', ClipboardCheck],
                    ['activities', 'Atividades', ListChecks],
                  ] as const
                ).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 pr-3">
                <GraduationCap className="w-4 h-4 text-slate-600" />
                <span>Educação Digital • 2º Ano</span>
              </div>
            </div>

            {loadError && (
              <div className="ed-card-sm p-4 bg-rose-50 flex items-center justify-between gap-3 border border-rose-200" role="alert">
                <p className="text-sm text-rose-900 font-medium">{loadError}</p>
                <button
                  type="button"
                  onClick={loadAll}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-300 bg-white hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {tab === 'corrections' ? (
              <TeacherCorrections
                groups={groups}
                activities={activities}
                submissions={submissions}
                loading={loading}
                onReload={loadAll}
                onGraded={(updated) =>
                  setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
                }
                showToast={showToast}
              />
            ) : (
              <TeacherActivities
                activities={activities}
                submissions={submissions}
                loading={loading}
                onSaved={(saved) =>
                  setActivities((prev) =>
                    prev.some((a) => a.id === saved.id) ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev]
                  )
                }
                showToast={showToast}
              />
            )}
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Founders Grid — Central de Correções • <a href="#/" className="underline hover:text-slate-900">Ir para a área dos alunos</a>
      </footer>
    </div>
  );
};

const TeacherLogin: React.FC<{ onSuccess: (email: string) => void; showToast: ShowToast }> = ({ onSuccess, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await teacherSignIn(email, password);
      onSuccess(res.email);
    } catch (err) {
      showToast('error', 'Acesso negado', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ed-card p-6 sm:p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-display font-semibold text-slate-900">Central de correções</h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">Acesso exclusivo do professor.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teacher-email" className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="teacher-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>
        <div>
          <label htmlFor="teacher-password" className="block text-xs font-medium text-slate-700 mb-1">Senha</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="teacher-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Entrar
        </button>
      </form>
    </div>
  );
};

