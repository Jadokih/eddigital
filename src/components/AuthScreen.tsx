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
  PlusCircle,
} from 'lucide-react';
import type { ClassName, CreateGroupInput, Group } from '../types';
import { LogoGenerator } from './LogoGenerator';
import { signUpGroup, signInGroup, isValidEmail } from '../lib/supabase';

interface AuthScreenProps {
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
  onAuthSuccess,
  showToast,
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

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header Institucional */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-3">
          <GraduationCap className="w-4 h-4 text-slate-600" />
          Ensino Médio • Turmas 2º2 e 2º3
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Educação Digital — Projeto de Empresa
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          Registre a empresa do seu grupo, defina a identidade e selecione a situação-problema que será resolvida ao longo do ano letivo.
        </p>
      </div>

      {/* Caixa Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Seletor de Abas */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Cadastrar Nova Empresa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Acessar Empresa Existente
          </button>
        </div>

        {/* CONTEÚDO: CRIAR CONTA */}
        {activeTab === 'signup' ? (
          <form onSubmit={handleSignUp} className="p-6 sm:p-8 space-y-6">
            {/* Bloco 1: Acesso do Grupo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Mail className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Dados de Acesso
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
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Identificação para entrar no sistema</p>
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
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Turma e Integrantes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Users className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                        className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          className === c
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomes completos dos integrantes do grupo *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ex: Ana Clara Martins, Gabriel Santos, Lucas Silveira, Mariana Ramos"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                  <p className="text-[11px] text-slate-400 mt-0.5">Separe os nomes por vírgula</p>
                </div>
              </div>
            </div>

            {/* Bloco 3: Dados da Empresa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Building2 className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                    placeholder="Ex: Alfa Logística e Distribuição"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ramo de atuação *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Comércio, Alimentação, Logística..."
                    value={businessSector}
                    onChange={(e) => setBusinessSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Sugestões de Ramo */}
              <div>
                <span className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  Sugestões de setor:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => setBusinessSector(sector)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        businessSector === sector
                          ? 'bg-slate-900 text-white border-slate-900 font-medium'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Breve descrição da empresa *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={300}
                  placeholder="Descreva o que a sua empresa faz, qual produto ou serviço ela oferece e qual o seu público principal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
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
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Cadastrando empresa...</span>
                ) : (
                  <>
                    <span>Cadastrar Empresa e Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* CONTEÚDO: ENTRAR / LOGIN */
          <form onSubmit={handleSignIn} className="p-6 sm:p-8 max-w-sm mx-auto space-y-4">
            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Acessar Empresa</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Insira o e-mail e a senha cadastrados pelo grupo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail da empresa
              </label>
              <input
                type="email"
                required
                placeholder="ex: grupo@escola.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Senha de acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha de acesso"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Ainda não cadastrou a empresa? <span className="underline">Clique aqui</span>.
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
