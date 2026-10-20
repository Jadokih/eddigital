import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  KeyRound,
  Globe,
  Trash2,
} from 'lucide-react';
import {
  getActiveSupabaseCredentials,
  saveSupabaseCredentials,
  clearCustomSupabaseCredentials,
  testSupabaseConnection,
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const SUPABASE_SQL_SCRIPT = `-- ========================================================
-- FOUNDERS GRID — TABELAS, POLÍTICAS E AUTENTICAÇÃO
-- Cole no SQL Editor do seu projeto Supabase:
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela 'groups'
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    members TEXT NOT NULL,
    class_name TEXT NOT NULL CHECK (class_name IN ('2º2', '2º3')),
    company_name TEXT NOT NULL,
    business_sector TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT,
    selected_problem_id INTEGER CHECK (selected_problem_id BETWEEN 1 AND 5),
    status TEXT NOT NULL DEFAULT 'nao_iniciada' CHECK (status IN ('nao_iniciada', 'em_andamento', 'concluida')),
    completed_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_group UNIQUE (user_id)
);

-- 2. Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_groups_updated_at ON public.groups;
CREATE TRIGGER trigger_groups_updated_at
    BEFORE UPDATE ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visualização para todos os autenticados" ON public.groups;
CREATE POLICY "Visualização para todos os autenticados"
    ON public.groups FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Grupo cadastra sua própria empresa" ON public.groups;
CREATE POLICY "Grupo cadastra sua própria empresa"
    ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Grupo atualiza sua própria empresa" ON public.groups;
CREATE POLICY "Grupo atualiza sua própria empresa"
    ON public.groups FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Bucket de Storage para Logotipos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Logotipos públicos" ON storage.objects;
CREATE POLICY "Logotipos públicos"
    ON storage.objects FOR SELECT USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "Upload por grupos autenticados" ON storage.objects;
CREATE POLICY "Upload por grupos autenticados"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-logos');

-- 5. Função de Cadastro Pré-confirmado (Sem Envio de E-mails / Sem Rate Limit)
CREATE OR REPLACE FUNCTION public.register_group_account(
    p_username TEXT,
    p_password TEXT,
    p_members TEXT,
    p_class_name TEXT,
    p_company_name TEXT,
    p_business_sector TEXT,
    p_description TEXT,
    p_logo_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
    v_clean_username TEXT;
    v_technical_email TEXT;
    v_user_id UUID;
    v_encrypted_pw TEXT;
    v_group_row RECORD;
BEGIN
    v_clean_username := lower(regexp_replace(trim(p_username), '[^a-zA-Z0-9_-]', '', 'g'));
    IF length(v_clean_username) < 3 THEN
        RAISE EXCEPTION 'O login deve ter pelo menos 3 caracteres alfanuméricos.';
    END IF;

    v_technical_email := 'fg_' || v_clean_username || '@gmail.com';

    IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_technical_email) THEN
        RAISE EXCEPTION 'Este login de grupo já está cadastrado. Escolha um nome exclusivo.';
    END IF;

    v_user_id := gen_random_uuid();
    v_encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf', 10));

    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
        v_technical_email, v_encrypted_pw, now(),
        jsonb_build_object('provider', 'email', 'providers', array['email']),
        jsonb_build_object('username', v_clean_username, 'company_name', p_company_name, 'class_name', p_class_name),
        now(), now(), '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        v_user_id::text, v_user_id, jsonb_build_object('sub', v_user_id::text, 'email', v_technical_email),
        'email', v_technical_email, now(), now(), now()
    );

    INSERT INTO public.groups (
        user_id, members, class_name, company_name, business_sector, description, logo_url, status, completed_objectives
    ) VALUES (
        v_user_id, trim(p_members), p_class_name, trim(p_company_name), trim(p_business_sector), trim(p_description), p_logo_url, 'nao_iniciada', '[]'::jsonb
    ) RETURNING * INTO v_group_row;

    RETURN jsonb_build_object('success', true, 'user_id', v_user_id, 'group_id', v_group_row.id, 'email', v_technical_email);
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_group_account TO anon, authenticated, service_role;
`;

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  showToast,
}) => {
  const currentCreds = getActiveSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection(url, anonKey);
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      saveSupabaseCredentials(url, anonKey);
      showToast('success', 'Supabase Conectado!', 'As credenciais foram salvas e validadas com sucesso.');
      onConfigUpdated();
    } else {
      showToast('error', 'Falha na conexão', res.message);
    }
  };

  const handleClear = () => {
    clearCustomSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    showToast('info', 'Credenciais limpas', 'O sistema retornou ao modo de demonstração local.');
    onConfigUpdated();
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    showToast('success', 'SQL Copiado!', 'Cole no SQL Editor do seu painel Supabase.');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Configuração do Supabase</h3>
              <p className="text-xs text-slate-500">
                Integração com Supabase PostgreSQL, Auth e Storage de Logotipos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Atual */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              currentCreds.isConfigured
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {currentCreds.isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-bold">
                {currentCreds.isConfigured
                  ? 'Banco de Dados Supabase Ativo'
                  : 'Modo de Demonstração Local Ativo'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {currentCreds.isConfigured
                  ? 'As contas dos grupos, login e logotipos estão sendo persistidos diretamente no seu projeto Supabase com PostgreSQL e Row Level Security.'
                  : 'O aplicativo está operando com dados simulados no navegador. Para persistência multiusuário real entre computadores e celulares, insira os dados do seu projeto Supabase abaixo.'}
              </p>
            </div>
          </div>

          {/* Formulário de Configuração */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                Supabase Project URL
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                Supabase Anon Public Key
              </label>
              <textarea
                rows={2}
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Utilize apenas a chave pública (anon/public). Nunca use a chave privada service_role no frontend.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                {testResult.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar Configurações
              </button>

              <button
                type="submit"
                disabled={testing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all ml-auto"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Testando Conexão...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Salvar e Conectar
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Seção do Script SQL */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Script SQL para o Supabase</h4>
                <p className="text-xs text-slate-500">
                  Cria a tabela <code>groups</code>, políticas de segurança (RLS) e bucket <code>company-logos</code>.
                </p>
              </div>

              <button
                type="button"
                onClick={copySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedSql ? 'Copiado!' : 'Copiar SQL'}
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs font-mono max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
                {SUPABASE_SQL_SCRIPT}
              </pre>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Como aplicar: Vá no Supabase &gt; SQL Editor &gt; New Query &gt; Cole e clique em Run.</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
              >
                Abrir Painel Supabase
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
