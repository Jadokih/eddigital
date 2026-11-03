import React, { useState, useEffect } from 'react';
import type { Group, UpdateGroupInput } from './types';
import { PROBLEMS_DATA } from './data/problems';
import {
  getCurrentSession,
  signOutGroup,
  updateSelectedProblem,
  toggleLearningObjective,
  updateGroupProfile,
} from './lib/supabase';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { ProblemSelection } from './components/ProblemSelection';
import { LearningPlan } from './components/LearningPlan';
import { EditCompanyModal } from './components/EditCompanyModal';
import { ToastContainer } from './components/Toast';
import type { ToastMessage, ToastType } from './components/Toast';
import { MyDeliveries } from './components/deliveries/MyDeliveries';
import { TeacherApp } from './components/teacher/TeacherApp';
import {
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'problems' | 'plan' | 'deliveries'>('dashboard');
  const [isTeacherRoute, setIsTeacherRoute] = useState(
    typeof window !== 'undefined' && window.location.hash.startsWith('#/professor')
  );

  useEffect(() => {
    const handleHash = () => {
      setIsTeacherRoute(window.location.hash.startsWith('#/professor'));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showToast = (type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Carregar sessão existente ao iniciar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { group } = await getCurrentSession();
        if (group) {
          setCurrentGroup(group);
        }
      } catch (err) {
        console.warn('Erro ao restaurar sessão:', err);
      } finally {
        setLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutGroup();
      setCurrentGroup(null);
      setActiveSection('dashboard');
      showToast('info', 'Sessão encerrada', 'Você saiu da conta da sua empresa.');
    } catch (err: any) {
      showToast('error', 'Erro ao sair', err.message);
    }
  };

  const handleSelectProblem = async (problemId: number) => {
    if (!currentGroup) return;
    const updated = await updateSelectedProblem(currentGroup.id, problemId);
    setCurrentGroup(updated);
    setActiveSection('plan');
  };

  const handleToggleObjective = async (objectiveId: string) => {
    if (!currentGroup || !currentGroup.selected_problem_id) return;
    const selectedProblem = PROBLEMS_DATA.find((p) => p.id === currentGroup.selected_problem_id);
    const totalCount = selectedProblem?.learningObjectives.length || 0;

    const updated = await toggleLearningObjective(currentGroup, objectiveId, totalCount);
    setCurrentGroup(updated);
  };

  const handleUpdateCompany = async (input: UpdateGroupInput) => {
    if (!currentGroup) return;
    const updated = await updateGroupProfile(currentGroup.id, input);
    setCurrentGroup(updated);
  };

  const selectedProblem = currentGroup?.selected_problem_id
    ? PROBLEMS_DATA.find((p) => p.id === currentGroup.selected_problem_id) || null
    : null;

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-center text-slate-900">
            <GraduationCap className="w-6 h-6 animate-pulse text-emerald-600" />
          </div>
          <span className="text-xs font-display font-bold text-slate-800">Carregando Founders Grid...</span>
        </div>
      </div>
    );
  }

  if (isTeacherRoute) {
    return <TeacherApp />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 selection:bg-emerald-200 selection:text-slate-900">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Header
        currentGroup={currentGroup}
        onLogout={handleLogout}
        activeSection={activeSection}
        onNavigate={(sec) => setActiveSection(sec)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {!currentGroup ? (
          <AuthScreen
            onAuthSuccess={(group) => {
              setCurrentGroup(group);
              setActiveSection(group.selected_problem_id ? 'plan' : 'dashboard');
            }}
            showToast={showToast}
          />
        ) : (
          <div className="space-y-6">
            {/* Navegação Mobile em Abas (Aparece apenas em telas pequenas) */}
            <div className="md:hidden flex items-center justify-between gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-2xs max-w-md mx-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSection === 'dashboard'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Painel</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('problems')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSection === 'problems'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Missões</span>
              </button>

              {selectedProblem && (
                <button
                  type="button"
                  onClick={() => setActiveSection('plan')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeSection === 'plan'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aulas</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveSection('deliveries')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSection === 'deliveries'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Entregas</span>
              </button>
            </div>

            {/* Visualização de Abas */}
            {activeSection === 'dashboard' && (
              <Dashboard
                group={currentGroup}
                selectedProblem={selectedProblem}
                onContinueActivity={() => {
                  if (currentGroup.selected_problem_id) {
                    setActiveSection('plan');
                  } else {
                    setActiveSection('problems');
                  }
                }}
                onEditCompany={() => setIsEditModalOpen(true)}
                onNavigateDeliveries={() => setActiveSection('deliveries')}
                onLogout={handleLogout}
              />
            )}

            {activeSection === 'problems' && (
              <ProblemSelection
                selectedProblemId={currentGroup.selected_problem_id}
                onSelectProblem={handleSelectProblem}
                showToast={showToast}
              />
            )}

            {activeSection === 'plan' && selectedProblem && (
              <LearningPlan
                group={currentGroup}
                problem={selectedProblem}
                onToggleObjective={handleToggleObjective}
                onChangeProblem={() => setActiveSection('problems')}
                showToast={showToast}
              />
            )}

            {activeSection === 'deliveries' && (
              <MyDeliveries group={currentGroup} showToast={showToast} />
            )}

            {/* Se estiver no Dashboard e já tiver problema escolhido, exibe preview do plano abaixo */}
            {activeSection === 'dashboard' && selectedProblem && (
              <div className="pt-4">
                <LearningPlan
                  group={currentGroup}
                  problem={selectedProblem}
                  onToggleObjective={handleToggleObjective}
                  onChangeProblem={() => setActiveSection('problems')}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Se estiver no Dashboard e ainda não tiver problema, sugere escolher abaixo */}
            {activeSection === 'dashboard' && !selectedProblem && (
              <div className="pt-4">
                <ProblemSelection
                  selectedProblemId={null}
                  onSelectProblem={handleSelectProblem}
                  showToast={showToast}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rodapé Neo-Editorial */}
      <footer className="mt-20 border-t-2 border-slate-900 bg-white py-8 text-center text-xs text-slate-600">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-display font-bold text-slate-900 text-sm">
            Founders Grid — Plataforma Educacional de Educação Digital
          </p>
          <p className="text-xs text-slate-500">
            Ensino Médio • Turmas 2º2 e 2º3 • Atividades com a Suíte ONLYOFFICE Planilhas •{' '}
            <a href="#/professor" className="hover:text-slate-900 underline">
              Acesso do Professor
            </a>
          </p>
        </div>
      </footer>

      {/* Modal de Edição dos Dados da Empresa */}
      {currentGroup && (
        <EditCompanyModal
          isOpen={isEditModalOpen}
          group={currentGroup}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateCompany}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default App;
