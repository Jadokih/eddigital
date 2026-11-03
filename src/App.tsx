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
import { HeroLanding } from './components/HeroLanding';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { ProblemSelection } from './components/ProblemSelection';
import { LearningPlan } from './components/LearningPlan';
import { EditCompanyModal } from './components/EditCompanyModal';
import { ToastContainer } from './components/Toast';
import type { ToastMessage, ToastType } from './components/Toast';
import { MyDeliveries } from './components/deliveries/MyDeliveries';
import { TeacherApp } from './components/teacher/TeacherApp';
import { BrandLogo } from './components/ui/BrandLogo';
import {
  LayoutDashboard,
  CheckCircle2,
  Compass,
  UploadCloud,
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'signin' | 'signup'>('landing');
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
      setAuthView('landing');
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
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <BrandLogo size="lg" variant="symbol" theme="light" />
          <span className="text-xs font-mono text-slate-500 tracking-wider">
            Iniciando Founders Grid...
          </span>
        </div>
      </div>
    );
  }

  if (isTeacherRoute) {
    return <TeacherApp />;
  }

  // 1. TELA INICIAL CINEMATOGRÁFICA OU TELA DE LOGIN/CADASTRO BRANCA
  if (!currentGroup) {
    if (authView === 'landing') {
      return (
        <>
          <ToastContainer toasts={toasts} onDismiss={removeToast} />
          <HeroLanding
            onOpenSignIn={() => setAuthView('signin')}
            onOpenSignUp={() => setAuthView('signup')}
          />
        </>
      );
    }

    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <AuthScreen
          initialTab={authView}
          onBackToHero={() => setAuthView('landing')}
          onAuthSuccess={(group) => {
            setCurrentGroup(group);
            setActiveSection(group.selected_problem_id ? 'plan' : 'dashboard');
          }}
          showToast={showToast}
        />
      </>
    );
  }

  // 2. APLICAÇÃO INTERNA PARA EMPRESA LOGADA
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col text-zinc-900 selection:bg-zinc-200 selection:text-zinc-900">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Header
        currentGroup={currentGroup}
        onLogout={handleLogout}
        activeSection={activeSection}
        onNavigate={(sec) => setActiveSection(sec)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6">
          {/* Navegação Mobile em Abas (Editorial Aberto, sem cápsulas) */}
          <div className="md:hidden flex items-center justify-between border-b border-zinc-200/70 pb-1 mb-2 text-xs font-normal">
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-b-2 transition-colors ${
                activeSection === 'dashboard'
                  ? 'border-zinc-950 text-zinc-950 font-medium'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel</span>
            </button>

            {!selectedProblem && (
              <button
                type="button"
                onClick={() => setActiveSection('problems')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-b-2 transition-colors ${
                  activeSection === 'problems'
                    ? 'border-zinc-950 text-zinc-950 font-medium'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Missões</span>
              </button>
            )}

            {selectedProblem && (
              <button
                type="button"
                onClick={() => setActiveSection('plan')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-b-2 transition-colors ${
                  activeSection === 'plan'
                    ? 'border-zinc-950 text-zinc-950 font-medium'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aulas</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveSection('deliveries')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-b-2 transition-colors ${
                activeSection === 'deliveries'
                  ? 'border-zinc-950 text-zinc-950 font-medium'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
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
                onNavigateDeliveries={() => setActiveSection('deliveries')}
                showToast={showToast}
              />
            )}

            {activeSection === 'deliveries' && (
              <MyDeliveries group={currentGroup} showToast={showToast} />
            )}
          </div>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="mt-20 border-t border-zinc-200/80 bg-white/50 backdrop-blur-xs py-8 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 space-y-1.5">
          <p className="font-serif font-normal text-zinc-800 text-sm" style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}>
            Founders Grid — Educação Digital
          </p>
          <p className="text-xs text-zinc-400 font-light">
            Turmas 2º2 e 2º3 • Suíte ONLYOFFICE Planilhas •{' '}
            <a href="#/professor" className="hover:text-zinc-800 underline transition-colors">
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
