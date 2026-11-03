-- ============================================================================
-- FOUNDERS GRID — CENTRAL DE ENTREGAS (v1)
-- Migration: 20261103000000_central_entregas.sql
-- Reversão:  20261103000000_central_entregas.down.sql
--
-- Pré-requisito: supabase/schema.sql já aplicado (tabela public.groups e
-- função public.handle_updated_at()).
--
-- Esta migration é ADITIVA: não altera, não apaga e não reescreve nenhuma
-- linha/coluna/política existente de public.groups nem do bucket company-logos.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. PROFESSORES
--    Papel de professor. Preenchido APENAS pelo SQL Editor / service_role.
--    O frontend não possui permissão de escrita nesta tabela.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teachers (
    user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.teachers FROM anon, authenticated;
GRANT SELECT ON public.teachers TO authenticated;

DROP POLICY IF EXISTS "teachers_select_self" ON public.teachers;
CREATE POLICY "teachers_select_self"
    ON public.teachers FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 2. FUNÇÕES DE IDENTIDADE (derivadas da sessão — nunca de parâmetros)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM public.teachers WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.my_group_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM public.groups WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Separa o texto livre de groups.members em nomes individuais.
-- Separadores aceitos: vírgula, ponto e vírgula, quebra de linha e " e ".
CREATE OR REPLACE FUNCTION public.split_member_names(p_members TEXT)
RETURNS TEXT[]
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
    SELECT COALESCE(array_agg(n ORDER BY ord), ARRAY[]::TEXT[])
    FROM (
        SELECT DISTINCT ON (lower(n)) n, ord
        FROM (
            SELECT btrim(regexp_replace(part, '\s+', ' ', 'g'), ' .') AS n, ord
            FROM regexp_split_to_table(
                     COALESCE(p_members, ''),
                     '\s*(?:[,;\r\n]+|\s[eE]\s)\s*'
                 ) WITH ORDINALITY AS t(part, ord)
        ) parts
        WHERE n <> ''
        ORDER BY lower(n), ord
    ) uniq;
$$;

-- Lista de integrantes do PRÓPRIO grupo da sessão (alimenta o seletor).
CREATE OR REPLACE FUNCTION public.get_my_members()
RETURNS TEXT[]
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.split_member_names(members)
    FROM public.groups
    WHERE user_id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- 3. ATIVIDADES (criadas pelo professor)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 160),
    instructions        TEXT NOT NULL DEFAULT '' CHECK (char_length(instructions) <= 5000),
    due_at              TIMESTAMPTZ,
    max_score           NUMERIC(6,2) NOT NULL DEFAULT 10 CHECK (max_score > 0 AND max_score <= 1000),
    class_names         TEXT[] NOT NULL DEFAULT ARRAY['2º2','2º3']::TEXT[]
                        CHECK (cardinality(class_names) > 0 AND class_names <@ ARRAY['2º2','2º3']::TEXT[]),
    is_published        BOOLEAN NOT NULL DEFAULT false,
    accepts_submissions BOOLEAN NOT NULL DEFAULT true,
    created_by          UUID DEFAULT auth.uid(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trigger_activities_updated_at ON public.activities;
CREATE TRIGGER trigger_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.activities FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;

DROP POLICY IF EXISTS "activities_select" ON public.activities;
CREATE POLICY "activities_select"
    ON public.activities FOR SELECT TO authenticated
    USING (
        public.is_teacher()
        OR (
            is_published
            AND EXISTS (
                SELECT 1 FROM public.groups g
                WHERE g.user_id = auth.uid()
                  AND g.class_name = ANY (activities.class_names)
            )
        )
    );

DROP POLICY IF EXISTS "activities_teacher_insert" ON public.activities;
CREATE POLICY "activities_teacher_insert"
    ON public.activities FOR INSERT TO authenticated
    WITH CHECK (public.is_teacher());

DROP POLICY IF EXISTS "activities_teacher_update" ON public.activities;
CREATE POLICY "activities_teacher_update"
    ON public.activities FOR UPDATE TO authenticated
    USING (public.is_teacher())
    WITH CHECK (public.is_teacher());

DROP POLICY IF EXISTS "activities_teacher_delete" ON public.activities;
CREATE POLICY "activities_teacher_delete"
    ON public.activities FOR DELETE TO authenticated
    USING (public.is_teacher());

-- ----------------------------------------------------------------------------
-- 4. ENTREGAS (uma linha por VERSÃO enviada — histórico preservado)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id                UUID NOT NULL REFERENCES public.groups(id) ON DELETE RESTRICT,
    activity_id             UUID NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
    version                 INTEGER NOT NULL CHECK (version >= 1),
    responsible_member_id   UUID,           -- NULL: integrantes ainda não possuem ID individual
    responsible_member_name TEXT NOT NULL CHECK (char_length(responsible_member_name) BETWEEN 1 AND 200),
    original_filename       TEXT NOT NULL CHECK (char_length(original_filename) BETWEEN 1 AND 255),
    storage_path            TEXT NOT NULL UNIQUE,
    file_size               BIGINT NOT NULL CHECK (file_size > 0 AND file_size <= 5242880),
    mime_type               TEXT NOT NULL,
    submitted_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_by            UUID NOT NULL,  -- auth.uid() da conta do grupo
    is_late                 BOOLEAN NOT NULL DEFAULT false,
    client_request_id       UUID NOT NULL UNIQUE,
    is_current              BOOLEAN NOT NULL DEFAULT true,
    status                  TEXT NOT NULL DEFAULT 'entregue' CHECK (status IN ('entregue', 'corrigida')),
    score                   NUMERIC(6,2) CHECK (score IS NULL OR score >= 0),
    feedback                TEXT CHECK (feedback IS NULL OR char_length(feedback) <= 5000),
    graded_at               TIMESTAMPTZ,
    graded_by               UUID,
    CONSTRAINT submissions_group_activity_version_key UNIQUE (group_id, activity_id, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS submissions_one_current_idx
    ON public.submissions (group_id, activity_id) WHERE is_current;
CREATE INDEX IF NOT EXISTS submissions_activity_idx ON public.submissions (activity_id);
CREATE INDEX IF NOT EXISTS submissions_group_idx ON public.submissions (group_id);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
-- Nenhuma escrita direta pelo cliente: somente via RPCs abaixo.
REVOKE ALL ON public.submissions FROM anon, authenticated;
GRANT SELECT ON public.submissions TO authenticated;

DROP POLICY IF EXISTS "submissions_select_own_or_teacher" ON public.submissions;
CREATE POLICY "submissions_select_own_or_teacher"
    ON public.submissions FOR SELECT TO authenticated
    USING (group_id = public.my_group_id() OR public.is_teacher());

-- ----------------------------------------------------------------------------
-- 5. RPC: registrar entrega (após upload confirmado no Storage)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_delivery(
    p_activity_id       UUID,
    p_member_name       TEXT,
    p_storage_path      TEXT,
    p_original_filename TEXT,
    p_client_request_id UUID
)
RETURNS public.submissions
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_group     public.groups%ROWTYPE;
    v_act       public.activities%ROWTYPE;
    v_row       public.submissions%ROWTYPE;
    v_member    TEXT;
    v_meta      JSONB;
    v_size      BIGINT;
    v_mime      TEXT;
    v_version   INTEGER;
    v_expected  TEXT;
    v_filename  TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Sessão inválida. Entre novamente.' USING ERRCODE = '28000';
    END IF;

    -- Empresa derivada exclusivamente da sessão autenticada
    SELECT * INTO v_group FROM public.groups WHERE user_id = auth.uid();
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Nenhuma empresa associada a esta sessão.' USING ERRCODE = '42501';
    END IF;

    IF p_client_request_id IS NULL THEN
        RAISE EXCEPTION 'Identificador da requisição ausente.' USING ERRCODE = '22023';
    END IF;

    -- Idempotência: reenvio da mesma requisição devolve o registro já criado
    SELECT * INTO v_row FROM public.submissions WHERE client_request_id = p_client_request_id;
    IF FOUND THEN
        IF v_row.group_id <> v_group.id THEN
            RAISE EXCEPTION 'Requisição inválida.' USING ERRCODE = '42501';
        END IF;
        RETURN v_row;
    END IF;

    SELECT * INTO v_act FROM public.activities WHERE id = p_activity_id;
    IF NOT FOUND OR NOT v_act.is_published OR NOT (v_group.class_name = ANY (v_act.class_names)) THEN
        RAISE EXCEPTION 'Atividade não disponível para a sua turma.' USING ERRCODE = '42501';
    END IF;
    IF NOT v_act.accepts_submissions THEN
        RAISE EXCEPTION 'Esta atividade não está recebendo entregas no momento.' USING ERRCODE = '42501';
    END IF;

    -- Responsável: precisa pertencer à lista de integrantes DESTA empresa
    SELECT m INTO v_member
    FROM unnest(public.split_member_names(v_group.members)) AS m
    WHERE lower(m) = lower(btrim(COALESCE(p_member_name, '')))
    LIMIT 1;
    IF v_member IS NULL THEN
        RAISE EXCEPTION 'Selecione um integrante cadastrado na sua empresa.' USING ERRCODE = '22023';
    END IF;

    -- Caminho obrigatório: <group_id>/<activity_id>/<client_request_id>.xlsx
    v_expected := v_group.id::TEXT || '/' || v_act.id::TEXT || '/' || p_client_request_id::TEXT || '.xlsx';
    IF p_storage_path IS DISTINCT FROM v_expected THEN
        RAISE EXCEPTION 'Caminho de arquivo inválido.' USING ERRCODE = '42501';
    END IF;

    v_filename := btrim(COALESCE(p_original_filename, ''));
    IF v_filename = '' OR char_length(v_filename) > 255 OR lower(v_filename) NOT LIKE '%.xlsx' THEN
        RAISE EXCEPTION 'Nome de arquivo inválido. Envie um arquivo .xlsx.' USING ERRCODE = '22023';
    END IF;

    -- O objeto precisa existir de fato no bucket privado
    SELECT metadata INTO v_meta
    FROM storage.objects
    WHERE bucket_id = 'entregas' AND name = p_storage_path;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Arquivo não encontrado no armazenamento. Envie novamente.' USING ERRCODE = 'P0002';
    END IF;

    v_size := COALESCE((v_meta ->> 'size')::BIGINT, (v_meta ->> 'contentLength')::BIGINT, 0);
    v_mime := COALESCE(v_meta ->> 'mimetype', '');
    IF v_size <= 0 OR v_size > 5242880 THEN
        RAISE EXCEPTION 'Tamanho de arquivo inválido (máximo 5 MB).' USING ERRCODE = '22023';
    END IF;
    IF v_mime <> 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' THEN
        RAISE EXCEPTION 'Tipo de arquivo inválido. Envie uma planilha .xlsx.' USING ERRCODE = '22023';
    END IF;

    -- Serializa versões concorrentes do mesmo grupo/atividade
    PERFORM pg_advisory_xact_lock(hashtextextended(v_group.id::TEXT || ':' || v_act.id::TEXT, 0));

    SELECT COALESCE(max(version), 0) + 1 INTO v_version
    FROM public.submissions
    WHERE group_id = v_group.id AND activity_id = v_act.id;

    UPDATE public.submissions
       SET is_current = false
     WHERE group_id = v_group.id AND activity_id = v_act.id AND is_current;

    INSERT INTO public.submissions (
        group_id, activity_id, version,
        responsible_member_id, responsible_member_name,
        original_filename, storage_path, file_size, mime_type,
        submitted_by, is_late, client_request_id, is_current, status
    ) VALUES (
        v_group.id, v_act.id, v_version,
        NULL, v_member,
        v_filename, p_storage_path, v_size, v_mime,
        auth.uid(), (v_act.due_at IS NOT NULL AND now() > v_act.due_at),
        p_client_request_id, true, 'entregue'
    )
    RETURNING * INTO v_row;

    RETURN v_row;
END;
$$;

-- ----------------------------------------------------------------------------
-- 6. RPC: correção (somente professor)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.grade_submission(
    p_submission_id UUID,
    p_score         NUMERIC,
    p_feedback      TEXT
)
RETURNS public.submissions
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_row public.submissions%ROWTYPE;
    v_max NUMERIC;
BEGIN
    IF NOT public.is_teacher() THEN
        RAISE EXCEPTION 'Apenas o professor pode corrigir entregas.' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_row FROM public.submissions WHERE id = p_submission_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Entrega não encontrada.' USING ERRCODE = 'P0002';
    END IF;
    SELECT max_score INTO v_max FROM public.activities WHERE id = v_row.activity_id;

    IF p_score IS NULL OR p_score < 0 OR p_score > v_max THEN
        RAISE EXCEPTION 'A nota deve estar entre 0 e %.', v_max USING ERRCODE = '22023';
    END IF;

    UPDATE public.submissions
       SET score      = round(p_score, 2),
           feedback   = NULLIF(btrim(COALESCE(p_feedback, '')), ''),
           status     = 'corrigida',
           graded_at  = now(),
           graded_by  = auth.uid()
     WHERE id = p_submission_id
    RETURNING * INTO v_row;

    RETURN v_row;
END;
$$;

-- Permissões das funções
REVOKE ALL ON FUNCTION public.is_teacher()                                   FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.my_group_id()                                  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_my_members()                               FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.submit_delivery(UUID, TEXT, TEXT, TEXT, UUID)  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.grade_submission(UUID, NUMERIC, TEXT)          FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_teacher()                                  TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_group_id()                                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_members()                              TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_delivery(UUID, TEXT, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grade_submission(UUID, NUMERIC, TEXT)         TO authenticated;

-- ----------------------------------------------------------------------------
-- 7. STORAGE: bucket PRIVADO 'entregas' (separado de company-logos)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'entregas', 'entregas', false, 5242880,
    ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO UPDATE
    SET public             = false,
        file_size_limit    = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Upload: somente na pasta do próprio grupo, em atividade aberta da sua turma.
DROP POLICY IF EXISTS "entregas_insert_own_group" ON storage.objects;
CREATE POLICY "entregas_insert_own_group"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'entregas'
        AND (storage.foldername(name))[1] = public.my_group_id()::TEXT
        AND lower(storage.extension(name)) = 'xlsx'
        AND EXISTS (
            SELECT 1
            FROM public.activities a
            JOIN public.groups g ON g.user_id = auth.uid()
            WHERE a.id::TEXT = (storage.foldername(name))[2]
              AND a.is_published
              AND a.accepts_submissions
              AND g.class_name = ANY (a.class_names)
        )
    );

-- Leitura (URLs assinadas): própria pasta ou professor.
DROP POLICY IF EXISTS "entregas_select_own_or_teacher" ON storage.objects;
CREATE POLICY "entregas_select_own_or_teacher"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'entregas'
        AND (
            (storage.foldername(name))[1] = public.my_group_id()::TEXT
            OR public.is_teacher()
        )
    );

-- Sem políticas de UPDATE/DELETE: arquivos enviados são imutáveis (histórico).

COMMIT;
