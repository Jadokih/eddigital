-- ========================================================
-- FOUNDERS GRID — EDUCAÇÃO DIGITAL | ETAPA 1
-- Script de Migração PostgreSQL / Supabase
-- ========================================================

-- 1. Habilitar extensões para UUID e Criptografia de Senhas (Bcrypt)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criação da Tabela `groups`
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

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON public.groups(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_class_name ON public.groups(class_name);
CREATE INDEX IF NOT EXISTS idx_groups_selected_problem ON public.groups(selected_problem_id);

-- 4. Função e Trigger para atualizar automaticamente o `updated_at`
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

-- 5. Configuração de Row Level Security (RLS)
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Política de Leitura: Usuários autenticados podem ver todos os grupos (para visualização dos projetos das turmas)
DROP POLICY IF EXISTS "Visualização de grupos por usuários autenticados" ON public.groups;
CREATE POLICY "Visualização de grupos por usuários autenticados"
    ON public.groups
    FOR SELECT
    TO authenticated
    USING (true);

-- Política de Inserção: O grupo só pode inserir um registro vinculado ao seu próprio auth.uid()
DROP POLICY IF EXISTS "Grupo pode cadastrar sua própria empresa" ON public.groups;
CREATE POLICY "Grupo pode cadastrar sua própria empresa"
    ON public.groups
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Política de Edição: O grupo só pode alterar o seu próprio registro
DROP POLICY IF EXISTS "Grupo pode atualizar apenas sua própria empresa" ON public.groups;
CREATE POLICY "Grupo pode atualizar apenas sua própria empresa"
    ON public.groups
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Configuração do Storage para os Logotipos das Empresas
-- Criar o bucket 'company-logos' público caso não exista
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para o bucket 'company-logos'
DROP POLICY IF EXISTS "Acesso público aos logotipos de empresas" ON storage.objects;
CREATE POLICY "Acesso público aos logotipos de empresas"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "Usuários autenticados podem enviar logotipo" ON storage.objects;
CREATE POLICY "Usuários autenticados podem enviar logotipo"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar logotipo" ON storage.objects;
CREATE POLICY "Usuários autenticados podem atualizar logotipo"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'company-logos');

-- 7. FUNÇÃO SEGURA DE CADASTRO PRÉ-CONFIRMADO PARA ALUNOS
-- Cria o usuário diretamente em auth.users (com senha criptografada em bcrypt)
-- e insere a empresa na tabela public.groups sem depender de envio de e-mails nem gerar erros de rate limit (429).
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
    -- Validação e normalização do login
    v_clean_username := lower(regexp_replace(trim(p_username), '[^a-zA-Z0-9_-]', '', 'g'));
    IF length(v_clean_username) < 3 THEN
        RAISE EXCEPTION 'O login do grupo deve conter pelo menos 3 caracteres alfanuméricos.';
    END IF;

    -- E-mail técnico com domínio público e registros MX universais
    v_technical_email := 'fg_' || v_clean_username || '@gmail.com';

    -- Verificar se o usuário já existe
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_technical_email) THEN
        RAISE EXCEPTION 'Este login de grupo já está cadastrado. Escolha um nome exclusivo.';
    END IF;

    -- Gerar UUID e criptografar a senha com Bcrypt usando a extensão pgcrypto
    v_user_id := gen_random_uuid();
    v_encrypted_pw := extensions.crypt(p_password, extensions.gen_salt('bf', 10));

    -- Inserir usuário pré-confirmado em auth.users (evita envio de e-mails e limites de envio)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated',
        'authenticated',
        v_technical_email,
        v_encrypted_pw,
        now(),
        jsonb_build_object('provider', 'email', 'providers', array['email']),
        jsonb_build_object('username', v_clean_username, 'company_name', p_company_name, 'class_name', p_class_name),
        now(),
        now(),
        '',
        ''
    );

    -- Inserir identidade em auth.identities para compatibilidade com o GoTrue
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        v_user_id::text,
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_technical_email),
        'email',
        v_technical_email,
        now(),
        now(),
        now()
    );

    -- Inserir os dados da empresa na tabela public.groups
    INSERT INTO public.groups (
        user_id,
        members,
        class_name,
        company_name,
        business_sector,
        description,
        logo_url,
        status,
        completed_objectives
    ) VALUES (
        v_user_id,
        trim(p_members),
        p_class_name,
        trim(p_company_name),
        trim(p_business_sector),
        trim(p_description),
        p_logo_url,
        'nao_iniciada',
        '[]'::jsonb
    )
    RETURNING * INTO v_group_row;

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'group_id', v_group_row.id,
        'email', v_technical_email
    );
END;
$$;

-- Permitir que a função de registro seja chamada pelo cliente anônimo e autenticado
GRANT EXECUTE ON FUNCTION public.register_group_account TO anon, authenticated, service_role;
