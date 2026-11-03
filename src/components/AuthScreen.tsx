import React, { useState } from 'react';
import {
  Building2,
  Users,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowLeft,
  KeyRound,
  X,
  HelpCircle,
} from 'lucide-react';
import type { ClassName, CreateGroupInput, Group } from '../types';
import { LogoGenerator } from './LogoGenerator';
import { signUpGroup, signInGroup, isValidEmail, requestPasswordReset } from '../lib/supabase';
import { BrandLogo } from './ui/BrandLogo';

interface AuthScreenProps {
  initialTab?: 'signin' | 'signup';
  onBackToHero?: () => void;
  onAuthSuccess: (group: Group) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const COMMON_SECTORS = [
  'Tecnologia & Inovação',
  'Alimentação & Gastronomia',
  'Sustentabilidade & Meio Ambiente',
  'Moda & Vestuário',
  'Educação & Cultura',
  'Saúde & Bem-Estar',
  'Comércio & Varejo',
  'Serviços & Logística',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialTab = 'signup',
  onBackToHero,
  onAuthSuccess,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal de Recuperação de Senha
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);

  // Estados do Cadastro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [members, setMembers] = useState('');
  const [className, setClassName] = useState<ClassName>('2º2');
  const [companyName, setCompanyName] = useState('');
  const [businessSector, setBusinessSector] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Estados do Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogoChange = (file: File | null, dataUrl: string | null) => {
    setLogoFile(file);
    setLogoUrl(dataUrl);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('error', 'Campo obrigatório', 'Informe o e-mail do grupo.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      showToast('error', 'E-mail inválido', 'Digite um endereço de e-mail válido (ex: grupo@escola.com).');
      return;
    }
    if (!password || password.length < 6) {
      showToast('error', 'Senha fraca', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Senhas não coincidem', 'A confirmação de senha deve ser idêntica à senha informada.');
      return;
    }
    if (!members.trim()) {
      showToast('error', 'Integrantes obrigatórios', 'Liste os nomes completos de todos os membros do grupo.');
      return;
    }
    if (!companyName.trim()) {
      showToast('error', 'Nome da empresa', 'Informe o nome da empresa fictícia do seu grupo.');
      return;
    }
    if (!businessSector.trim()) {
      showToast('error', 'Ramo de atuação', 'Informe o ramo de atividade da empresa.');
      return;
    }
    if (!description.trim()) {
      showToast('error', 'Descrição da empresa', 'Escreva uma breve descrição da sua empresa.');
      return;
    }

    setLoading(true);
    try {
      const input: CreateGroupInput = {
        email: cleanEmail,
        password,
        confirmPassword,
        members: members.trim(),
        class_name: className,
        company_name: companyName.trim(),
        business_sector: businessSector.trim(),
        description: description.trim(),
        logo_file: logoFile,
        logo_url: logoUrl,
      };

      const { group } = await signUpGroup(input);
      showToast('success', 'Empresa criada com sucesso!', `Bem-vindos ao Founders Grid, equipe da ${group.company_name}!`);
      onAuthSuccess(group);
    } catch (err: any) {
      showToast('error', 'Falha no cadastro', err.message || 'Ocorreu um erro ao criar a empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !loginPassword) {
      showToast('error', 'Preencha todos os campos', 'Informe o e-mail e a senha de acesso.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      showToast('error', 'E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { group } = await signInGroup(cleanEmail, loginPassword);
      showToast('success', 'Login efetuado com sucesso!', `Bem-vindos novamente, equipe ${group.company_name}!`);
      onAuthSuccess(group);
    } catch (err: any) {
      showToast('error', 'Erro ao entrar', err.message || 'Verifique o e-mail e senha informados.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      showToast('error', 'E-mail inválido', 'Informe um e-mail válido para recuperação.');
      return;
    }

    setSendingReset(true);
    try {
      await requestPasswordReset(forgotEmail);
      showToast(
        'success',
        'Solicitação registrada',
        'Se o e-mail estiver cadastrado, as instruções de redefinição serão enviadas. O professor também pode redefinir o acesso da equipe.'
      );
      setIsForgotModalOpen(false);
      setForgotEmail('');
    } catch (err: any) {
      showToast('error', 'Falha na solicitação', err.message || 'Não foi possível solicitar a recuperação.');
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 py-6 sm:py-12 px-4 sm:px-6 flex flex-col justify-between">
      {/* Barra Superior Discreta de Navegação */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6">
        {onBackToHero ? (
          <button
            type="button"
            onClick={onBackToHero}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </button>
        ) : (
          <div />
        )}

        <BrandLogo size="sm" variant="full" theme="light" />

        <a
          href="#/professor"
          className="text-xs font-mono text-slate-500 hover:text-slate-800 transition-colors"
        >
          Acesso do Professor
        </a>
      </div>

      {/* Conteúdo Central Acolhedor e Branco */}
      <div className="max-w-2xl w-full mx-auto my-auto py-4">
        {/* Alternador Suave de Abas */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-300/80">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`py-2 px-5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Já tenho uma empresa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-2 px-5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Criar Nova Empresa
            </button>
          </div>
        </div>

        {/* ========================================================
            MODO 1: LOGIN (AMBIENTE BRANCO E ACOLHEDOR)
            ======================================================== */}
        {activeTab === 'signin' ? (
          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl p-8 sm:p-10 space-y-6 animate-in fade-in zoom-in-98 duration-200">
            <div className="text-center space-y-2">
              <h2
                className="text-3xl sm:text-4xl font-serif font-normal text-zinc-900 tracking-tight"
                style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
              >
                Que bom ter você de volta!
              </h2>
              <p className="text-sm text-zinc-600 font-normal max-w-md mx-auto">
                Acesse a conta da sua empresa para continuar desenvolvendo suas habilidades no ONLYOFFICE Desktop.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto pt-2">
              <div>
                <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                  E-mail cadastrado da empresa *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ex: grupo@escola.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-full text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-normal placeholder:text-zinc-400"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-4 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-zinc-800">
                    Senha de acesso *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900 underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha de acesso"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-full text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 pr-10 font-normal placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm hover:shadow"
                >
                  {loading ? (
                    <span>Acessando...</span>
                  ) : (
                    <>
                      <span>Entrar na empresa</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 text-center border-t border-zinc-100">
                <p className="text-xs text-zinc-600 font-normal">
                  Sua equipe ainda não tem cadastro?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="font-medium text-zinc-900 underline cursor-pointer"
                  >
                    Criar nova empresa
                  </button>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================
             MODO 2: CADASTRO (ORGANIZADO, DIDÁTICO E AMIGÁVEL)
             ======================================================== */
          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-98 duration-200">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-800 mb-2">
                <GraduationCap className="w-4 h-4 text-zinc-700" />
                <span>Educação Digital • Turmas 2º2 e 2º3</span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-serif font-normal text-zinc-900 tracking-tight"
                style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
              >
                Cadastre sua nova empresa
              </h2>
              <p className="text-sm text-zinc-600 font-normal max-w-lg mx-auto">
                Registre a identidade da sua equipe fictícia para resolver desafios práticos com planilhas.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Bloco 1: Acesso do Grupo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                  <Mail className="w-4 h-4 text-zinc-700" />
                  <h3 className="text-xs font-medium text-zinc-800 uppercase tracking-wider">
                    1. Dados de acesso do grupo
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      E-mail do grupo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ex: grupo@escola.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-normal"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">E-mail compartilhado para login</p>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      Senha de acesso *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 pr-9 font-normal"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      Confirmar senha *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Repita a senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 2: Turma e Integrantes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                  <Users className="w-4 h-4 text-zinc-700" />
                  <h3 className="text-xs font-medium text-zinc-800 uppercase tracking-wider">
                    2. Turma e integrantes da equipe
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      Turma escolar *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['2º2', '2º3'] as ClassName[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setClassName(c)}
                          className={`py-2 px-3 rounded-full border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            className === c
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      Nomes completos dos integrantes da equipe *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Ex: Ana Clara Martins, Gabriel Santos, Lucas Silveira, Mariana Ramos"
                      value={members}
                      onChange={(e) => setMembers(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-normal leading-relaxed"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">Separe os nomes por vírgula</p>
                  </div>
                </div>
              </div>

              {/* Bloco 3: Dados da Empresa */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                  <Building2 className="w-4 h-4 text-zinc-700" />
                  <h3 className="text-xs font-medium text-zinc-800 uppercase tracking-wider">
                    3. Dados da empresa fictícia
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      Nome da empresa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alfa Logística e Distribuição"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                      Ramo de atuação *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Comércio, Alimentação, Logística..."
                      value={businessSector}
                      onChange={(e) => setBusinessSector(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-normal"
                    />
                  </div>
                </div>

                {/* Sugestões de Ramo em tags */}
                <div>
                  <span className="block text-xs font-medium text-zinc-600 mb-1.5">
                    Sugestões de setor:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SECTORS.map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => setBusinessSector(sector)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                          businessSector === sector
                            ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-800 mb-1.5">
                    Breve descrição da empresa *
                  </label>
                  <textarea
                    rows={3}
                    required
                    maxLength={300}
                    placeholder="Descreva o que a sua empresa faz, qual produto ou serviço ela oferece e qual o seu público principal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 leading-relaxed font-normal"
                  />
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-1">
                    <span>Escreva um resumo claro e objetivo.</span>
                    <span>{description.length}/300 caracteres</span>
                  </div>
                </div>
              </div>

              {/* Bloco 4: Logotipo da Empresa */}
              <LogoGenerator
                companyName={companyName}
                currentLogoUrl={logoUrl}
                onLogoChange={handleLogoChange}
              />

              {/* Botão de Envio do Cadastro */}
              <div className="pt-4 border-t border-zinc-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm hover:shadow"
                >
                  {loading ? (
                    <span>Cadastrando empresa...</span>
                  ) : (
                    <>
                      <span>Cadastrar empresa e selecionar missão</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-zinc-600 mt-4">
                  Já possui uma empresa cadastrada?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="font-medium text-zinc-900 underline cursor-pointer"
                  >
                    Fazer login
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modal de Recuperação de Senha */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-zinc-900">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-normal text-zinc-900">
                  Recuperação de Senha
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
              <p>
                Informe o e-mail da sua empresa cadastrado pelo grupo. Se o projeto estiver conectado ao Supabase com envio de e-mails ativado, você receberá um link para criar uma nova senha.
              </p>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start gap-2 text-zinc-600">
                <HelpCircle className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-900 font-medium">Aviso para a turma:</strong> Em ambiente de sala de aula, o professor também pode resetar ou conferir as contas diretamente pelo painel do professor.
                </span>
              </div>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-800 mb-1">
                  E-mail da empresa *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ex: grupo@escola.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-white border border-zinc-300 rounded-full text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sendingReset}
                  className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {sendingReset ? 'Enviando...' : 'Enviar link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rodapé Discreto */}
      <div className="max-w-4xl w-full mx-auto text-center pt-8 text-xs text-slate-500">
        <p>Founders Grid • Educação Digital • Ensino Médio</p>
      </div>
    </div>
  );
};
