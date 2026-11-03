-- ============================================================================
-- REVERSÃO: 20261103000000_central_entregas.sql
--
-- ATENÇÃO: remove as tabelas activities/submissions/teachers e TODOS os
-- registros de entregas e notas. Exporte os dados antes (Table Editor > Export).
-- Não toca em public.groups nem no bucket company-logos.
--
-- Os ARQUIVOS do bucket 'entregas' não são apagados por SQL (o Supabase
-- bloqueia DELETE direto em storage.objects). Para remover o bucket:
--   Dashboard > Storage > entregas > selecionar tudo > Delete; depois Delete bucket.
-- ============================================================================

BEGIN;

DROP POLICY IF EXISTS "entregas_insert_own_group"      ON storage.objects;
DROP POLICY IF EXISTS "entregas_select_own_or_teacher" ON storage.objects;

DROP FUNCTION IF EXISTS public.grade_submission(UUID, NUMERIC, TEXT);
DROP FUNCTION IF EXISTS public.submit_delivery(UUID, TEXT, TEXT, TEXT, UUID);

DROP TABLE IF EXISTS public.submissions;
DROP TABLE IF EXISTS public.activities;

DROP FUNCTION IF EXISTS public.get_my_members();
DROP FUNCTION IF EXISTS public.split_member_names(TEXT);
DROP FUNCTION IF EXISTS public.my_group_id();
DROP FUNCTION IF EXISTS public.is_teacher();

DROP TABLE IF EXISTS public.teachers;

-- Bucket só é removido se estiver vazio (caso contrário, esvazie pelo Dashboard).
DELETE FROM storage.buckets
 WHERE id = 'entregas'
   AND NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'entregas');

COMMIT;
