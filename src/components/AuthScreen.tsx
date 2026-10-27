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
    <div className="py-6 sm:py-10 px-4 max-w-4xl mx-auto" id="auth-section">
      {/* Header Institucional com destaque verde da Image 1 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-900/10 shadow-xs mb-4">
          <GraduationCap className="w-4 h-4 text-slate-700" />
          <span>Educação Digital • Turmas 2º2 e 2º3</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Crie a sua{' '}
          <span className="highlight-anchor">
            empresa
          </span>{' '}
          e inicie a Etapa 1.
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          Cadastre seu grupo, registre sua identidade visual e escolha qual situação-problema real vocês irão solucionar com planilhas digitais.
        </p>

        {/* Alternador de Abas em Pílula (match direto com Image 1) */}
        <div className="mt-6 inline-flex p-1.5 rounded-full bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadastrar Nova Empresa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acessar Empresa Existente
          </button>
        </div>
      </div>

      {/* Caixa Principal (Neo-Card com contorno escuro e sombra sólida) */}
      <div className="neo-card p-6 sm:p-9">
        {activeTab === 'signup' ? (
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Bloco 1: Acesso do Grupo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
                <Mail className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-display">
                  1. Dados de Acesso do Grupo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    E-mail do grupo *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ex: grupo@escola.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">E-mail para login no sistema</p>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Senha de acesso *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Confirmar senha *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Turma e Integrantes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-display">
                  2. Turma e Integrantes da Equipe
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Turma escolar *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['2º2', '2º3'] as ClassName[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setClassName(c)}
                        className={`py-2 px-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          className === c
                            ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomes completos dos integrantes do grupo *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ex: Ana Clara Martins, Gabriel Santos, Lucas Silveira, Mariana Ramos"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-0.5">Separe os nomes por vírgula</p>
                </div>
              </div>
            </div>

            {/* Bloco 3: Dados da Empresa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-900">
                <Building2 className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-display">
                  3. Dados da Empresa Fictícia
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nome da empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alfa Logística e Distribuição"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ramo de atuação *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Comércio, Alimentação, Logística..."
                    value={businessSector}
                    onChange={(e) => setBusinessSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Sugestões de Ramo em pílulas */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Sugestões de setor:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => setBusinessSector(sector)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        businessSector === sector
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-[2px_2px_0px_#0f172a]'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Breve descrição da empresa *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={300}
                  placeholder="Descreva o que a sua empresa faz, qual produto ou serviço ela oferece e qual o seu público principal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
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

            {/* Botão de Envio (Pill com sombra verde estilo Image 1) */}
            <div className="pt-4 border-t-2 border-slate-900">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-all shadow-[4px_4px_0px_#22c55e] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Cadastrando empresa...</span>
                ) : (
                  <>
                    <span>Cadastrar Empresa e Selecionar Missão</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* CONTEÚDO: ENTRAR / LOGIN */
          <form onSubmit={handleSignIn} className="p-4 sm:p-6 max-w-sm mx-auto space-y-4">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] text-slate-900 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Acessar Empresa</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Insira o e-mail e a senha cadastrados pelo grupo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                E-mail da empresa
              </label>
              <input
                type="email"
                required
                placeholder="ex: grupo@escola.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Senha de acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Sua senha de acesso"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-[3px_3px_0px_#22c55e] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Ainda não cadastrou o grupo? <span className="underline">Clique aqui</span>.
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
