import React, { useState } from 'react';
import {
  Building2,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { ClassName, CreateGroupInput, Group } from '../types';
import { LogoGenerator } from './LogoGenerator';
import { signUpGroup, signInGroup, isValidEmail } from '../lib/supabase';

interface AuthScreenProps {
  onAuthSuccess: (group: Group) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  isSupabaseConnected: boolean;
}

const COMMON_SECTORS = [
  'Tecnologia & Inovação',
  'Alimentação & Delivery',
  'Sustentabilidade & Meio Ambiente',
  'Moda & Vestuário',
  'Educação & Cultura',
  'Saúde & Bem-Estar',
  'Varejo & Comércio',
  'Serviços Comunitários',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  showToast,
  isSupabaseConnected,
}) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    // Validações
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
      showToast('success', 'Empresa criada com sucesso!', `Bem-vindos ao Founders Grid, grupo da ${group.company_name}!`);
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
      showToast('error', 'Preencha todos os campos', 'Informe seu e-mail e sua senha de acesso.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      showToast('error', 'E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { group } = await signInGroup(cleanEmail, loginPassword);
      showToast('success', 'Login efetuado com sucesso!', `Olá novamente, equipe ${group.company_name}!`);
      onAuthSuccess(group);
    } catch (err: any) {
      showToast('error', 'Erro ao entrar', err.message || 'Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3 shadow-xs">
          <GraduationCap className="w-4 h-4" />
          Ensino Médio • Turmas 2º2 e 2º3
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Educação Digital — Projeto de Empresa
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Crie sua empresa, identifique um problema e descubra como a tecnologia pode ajudar a resolvê-lo.
        </p>

        {/* Alerta explicativo transparente */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs bg-slate-100 text-slate-600 border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span>
            {isSupabaseConnected
              ? 'Autenticação e dados gerenciados em nuvem com Supabase.'
              : 'Ambiente de testes ativo no navegador. Seus dados persistem localmente.'}
          </span>
        </div>
      </div>

      {/* Caixa Principal */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Seletor de Abas */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Criar Empresa (Novo Grupo)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'signin'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Entrar (Já Tenho Conta)
          </button>
        </div>

        {/* CONTEÚDO: CRIAR CONTA */}
        {activeTab === 'signup' ? (
          <form onSubmit={handleSignUp} className="p-6 sm:p-8 space-y-6">
            {/* Bloco 1: Acesso do Grupo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Mail className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Acesso do Grupo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail do grupo *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ex: grupo@escola.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">E-mail para login no sistema</p>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Senha de acesso *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmar senha *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Turma e Integrantes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Turma e Integrantes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Turma escolar *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['2º2', '2º3'] as ClassName[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setClassName(c)}
                        className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${
                          className === c
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome completo de todos os integrantes do grupo *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ex: Ana Clara Martins, Gabriel Santos, Lucas Silveira, Mariana Ramos"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Separe os nomes por vírgula</p>
                </div>
              </div>
            </div>

            {/* Bloco 3: Dados da Empresa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Dados da Empresa Fictícia
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: EcoVida Soluções Sustentáveis"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ramo de atuação *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alimentação Saudável, Moda, Software..."
                    value={businessSector}
                    onChange={(e) => setBusinessSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Sugestões de Ramo */}
              <div>
                <span className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  Sugestões rápidas de ramo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => setBusinessSector(sector)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        businessSector === sector
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold'
                          : 'bg-slate-100/70 text-slate-600 border-slate-200 hover:bg-slate-200/70'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição curta da empresa *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={300}
                  placeholder="Descreva o que a sua empresa faz, qual produto ou serviço ela oferece e qual o seu público principal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
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

            {/* Botão de Envio */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <span>Criando empresa no sistema...</span>
                ) : (
                  <>
                    <span>Cadastrar Empresa e Iniciar Etapa 1</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* CONTEÚDO: ENTRAR / LOGIN */
          <form onSubmit={handleSignIn} className="p-6 sm:p-10 max-w-md mx-auto space-y-5">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 border border-indigo-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Acessar Projeto Salvo</h3>
              <p className="text-xs text-slate-500 mt-1">
                Insira o e-mail e a senha cadastrados pelo seu grupo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                E-mail cadastrado
              </label>
              <input
                type="email"
                required
                placeholder="ex: grupo@escola.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha de acesso"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>Entrar no Painel do Grupo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Ainda não cadastrou seu grupo? Clique aqui para criar a empresa.
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
