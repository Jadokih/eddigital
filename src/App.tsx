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
import {
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'problems' | 'plan'>('dashboard');

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5 animate-pulse text-indigo-400" />
          </div>
          <span className="text-xs font-semibold text-slate-600">Carregando Founders Grid...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-slate-900 selection:text-white">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Header
        currentGroup={currentGroup}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            {/* Barra de Navegação Interna */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveSection('dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    activeSection === 'dashboard'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Painel do Grupo
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => setActiveSection('problems')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    activeSection === 'problems'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Situação-Problema (Planilhas)
                  {selectedProblem && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
                  )}
                </button>

                {selectedProblem && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
                    <button
                      type="button"
                      onClick={() => setActiveSection('plan')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        activeSection === 'plan'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Plano de Metas
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {currentGroup.completed_objectives?.length || 0}/
                        {selectedProblem.learningObjectives.length}
                      </span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 pr-2">
                <GraduationCap className="w-4 h-4 text-slate-600" />
                <span>Educação Digital • 2º Ano</span>
              </div>
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

            {/* Se estiver no Dashboard e já tiver problema escolhido, exibe preview do plano abaixo */}
            {activeSection === 'dashboard' && selectedProblem && (
              <LearningPlan
                group={currentGroup}
                problem={selectedProblem}
                onToggleObjective={handleToggleObjective}
                onChangeProblem={() => setActiveSection('problems')}
                showToast={showToast}
              />
            )}

            {/* Se estiver no Dashboard e ainda não tiver problema, sugere escolher abaixo */}
            {activeSection === 'dashboard' && !selectedProblem && (
              <ProblemSelection
                selectedProblemId={null}
                onSelectProblem={handleSelectProblem}
                showToast={showToast}
              />
            )}
          </div>
        )}
      </main>

      {/* Rodapé Institucional */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            Founders Grid — Ambiente Pedagógico de Educação Digital
          </p>
          <p className="text-[11px] text-slate-400">
            Ensino Médio • Turmas 2º2 e 2º3 • Práticas em Suíte Digital de Produtividade (ONLYOFFICE Planilhas)
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
