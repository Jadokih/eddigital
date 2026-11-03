// ============================================================================
// CENTRAL DE ENTREGAS — camada de dados
//
// Regras de segurança (validadas NO SERVIDOR pela migration
// supabase/migrations/20261103000000_central_entregas.sql):
//  - a empresa é sempre derivada da sessão (auth.uid()), nunca de IDs do frontend;
//  - o arquivo vai para o bucket PRIVADO 'entregas' em <group_id>/<activity_id>/<uuid>.xlsx;
//  - o registro só é criado pela RPC submit_delivery, que confere objeto, integrante e turma;
//  - notas só via RPC grade_submission (exige professor).
//
// Este módulo NUNCA simula sucesso localmente: sem Supabase, as operações falham.
// ============================================================================
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getActiveSupabaseCredentials, getSupabaseClient } from './supabase';
import type { Activity, ActivityInput, DeliveryStatus, Group, Submission } from '../types';

export const DELIVERIES_BUCKET = 'entregas';
export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const MAX_DELIVERY_BYTES = 5 * 1024 * 1024; // 5 MB
const SIGNED_URL_TTL_SECONDS = 300;

export class DeliveryUnavailableError extends Error {
  constructor(message = 'A Central de Entregas está indisponível: o servidor não está conectado. Nenhum arquivo foi enviado.') {
    super(message);
    this.name = 'DeliveryUnavailableError';
  }
}

// ----------------------------------------------------------------------------
// Clientes
// ----------------------------------------------------------------------------

/** Cliente da sessão do GRUPO (o mesmo usado pelo login existente). */
export const getGroupClient = (): SupabaseClient | null => getSupabaseClient();

let teacherClient: SupabaseClient | null = null;
let teacherClientKey = '';

/**
 * Cliente do PROFESSOR com armazenamento de sessão separado, para que o login do
 * professor nunca interfira na sessão de um grupo aberta no mesmo navegador.
 */
export const getTeacherClient = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getActiveSupabaseCredentials();
  if (!isConfigured) return null;
  const key = `${url}|${anonKey}`;
  if (teacherClient && teacherClientKey === key) return teacherClient;
  teacherClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'founders_grid_teacher_session',
    },
  });
  teacherClientKey = key;
  return teacherClient;
};

const requireClient = (client: SupabaseClient | null): SupabaseClient => {
  if (!client) throw new DeliveryUnavailableError();
  return client;
};

/** Traduz erros de rede/servidor em mensagens claras, sem esconder falhas. */
const toFriendlyError = (err: unknown, fallback: string): Error => {
  if (err instanceof DeliveryUnavailableError) return err;
  const raw = (err as { message?: string })?.message || '';
  if (/failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(raw)) {
    return new DeliveryUnavailableError(
      'Não foi possível conectar ao servidor. Verifique a internet e tente novamente. Nenhuma entrega foi registrada.'
    );
  }
  if (/PGRST205|PGRST202|schema cache/i.test(raw)) {
    return new DeliveryUnavailableError(
      'A Central de Entregas ainda não foi instalada no servidor (migration pendente).'
    );
  }
  return new Error(raw || fallback);
};

const normalizeActivity = (a: Activity): Activity => ({ ...a, max_score: Number(a.max_score) });
const normalizeSubmission = (s: Submission): Submission => ({
  ...s,
  file_size: Number(s.file_size),
  score: s.score === null || s.score === undefined ? null : Number(s.score),
});

// ----------------------------------------------------------------------------
// Validação local do arquivo (o servidor valida novamente)
// ----------------------------------------------------------------------------

export interface FileValidationResult {
  ok: boolean;
  error?: string;
}

const ACCEPTED_BROWSER_MIMES = new Set([XLSX_MIME, '', 'application/octet-stream']);

export const validateXlsxFile = async (file: File | null): Promise<FileValidationResult> => {
  if (!file) return { ok: false, error: 'Selecione o arquivo da planilha.' };
  if (!/\.xlsx$/i.test(file.name)) {
    return { ok: false, error: 'Formato não aceito. Salve no ONLYOFFICE como "Planilha do Excel (.xlsx)".' };
  }
  if (!ACCEPTED_BROWSER_MIMES.has(file.type)) {
    return { ok: false, error: `Tipo de arquivo inválido (${file.type}). Envie uma planilha .xlsx.` };
  }
  if (file.size === 0) return { ok: false, error: 'O arquivo está vazio.' };
  if (file.size > MAX_DELIVERY_BYTES) {
    return {
      ok: false,
      error: `Arquivo muito grande (${formatBytes(file.size)}). O limite é ${formatBytes(MAX_DELIVERY_BYTES)}.`,
    };
  }
  // Assinatura real do arquivo: .xlsx é um pacote ZIP (bytes "PK\x03\x04").
  try {
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const isZip = head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
    if (!isZip) {
      return { ok: false, error: 'O conteúdo do arquivo não é uma planilha .xlsx válida.' };
    }
  } catch {
    return { ok: false, error: 'Não foi possível ler o arquivo selecionado.' };
  }
  return { ok: true };
};

// ----------------------------------------------------------------------------
// ÁREA DO ALUNO
// ----------------------------------------------------------------------------

export const fetchGroupActivities = async (): Promise<Activity[]> => {
  const client = requireClient(getGroupClient());
  try {
    const { data, error } = await client
      .from('activities')
      .select('*')
      .order('due_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data as Activity[]).map(normalizeActivity);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao carregar atividades.');
  }
};

export const fetchMySubmissions = async (): Promise<Submission[]> => {
  const client = requireClient(getGroupClient());
  try {
    const { data, error } = await client
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return (data as Submission[]).map(normalizeSubmission);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao carregar entregas.');
  }
};

/** Integrantes do PRÓPRIO grupo, separados pelo servidor (mesma regra usada na validação). */
export const fetchMyMembers = async (): Promise<string[]> => {
  const client = requireClient(getGroupClient());
  try {
    const { data, error } = await client.rpc('get_my_members');
    if (error) throw error;
    return Array.isArray(data) ? (data as string[]) : [];
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao carregar integrantes.');
  }
};

/** Upload via endpoint REST oficial do Storage, com progresso real (XHR). */
const uploadWithProgress = (
  baseUrl: string,
  anonKey: string,
  accessToken: string,
  path: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    xhr.open('POST', `${baseUrl}/storage/v1/object/${DELIVERIES_BUCKET}/${encodedPath}`);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('apikey', anonKey);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('Content-Type', XLSX_MIME);
    xhr.setRequestHeader('Cache-Control', 'max-age=3600');
    xhr.timeout = 120_000;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      let body: { statusCode?: string; error?: string; message?: string } = {};
      try {
        body = JSON.parse(xhr.responseText || '{}');
      } catch {
        /* resposta não-JSON */
      }
      // Mesmo caminho já existe = repetição da MESMA requisição (idempotente).
      if (xhr.status === 409 || body.statusCode === '409' || /already exists|duplicate/i.test(body.message || '')) {
        onProgress(100);
        resolve();
        return;
      }
      if (xhr.status === 413 || body.statusCode === '413') {
        reject(new Error('Arquivo maior que o limite de 5 MB permitido pelo servidor.'));
        return;
      }
      if (xhr.status === 403 || body.statusCode === '403' || /row-level security|unauthorized/i.test(body.message || '')) {
        reject(new Error('Envio não autorizado para esta atividade (verifique se ela ainda está aberta).'));
        return;
      }
      if (/mime|invalid_mime_type/i.test(body.message || body.error || '')) {
        reject(new Error('Tipo de arquivo recusado pelo servidor. Envie uma planilha .xlsx.'));
        return;
      }
      reject(new Error(body.message || `Falha no upload (HTTP ${xhr.status}).`));
    };
    xhr.onerror = () =>
      reject(new DeliveryUnavailableError('Conexão perdida durante o envio. Nenhuma entrega foi registrada.'));
    xhr.ontimeout = () =>
      reject(new DeliveryUnavailableError('O envio demorou demais e foi cancelado. Nenhuma entrega foi registrada.'));
    xhr.send(file);
  });

export interface SubmitDeliveryParams {
  group: Group;
  activity: Activity;
  memberName: string;
  file: File;
  /** Gerado UMA vez por tentativa no modal; reutilizado em novas tentativas para evitar duplicidade. */
  clientRequestId: string;
  onProgress: (percent: number) => void;
}

/**
 * 1) valida o arquivo; 2) sobe ao Storage; 3) registra via RPC.
 * Só resolve quando Storage E banco confirmaram.
 */
export const submitDelivery = async (params: SubmitDeliveryParams): Promise<Submission> => {
  const { group, activity, memberName, file, clientRequestId, onProgress } = params;
  const client = requireClient(getGroupClient());
  const { url, anonKey } = getActiveSupabaseCredentials();

  if (!memberName.trim()) throw new Error('Selecione o integrante responsável pela entrega.');
  const validation = await validateXlsxFile(file);
  if (!validation.ok) throw new Error(validation.error);

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    const token = sessionData.session?.access_token;
    if (!token) throw new Error('Sua sessão expirou. Saia e entre novamente para enviar.');

    // O servidor rejeita qualquer caminho diferente deste formato.
    const storagePath = `${group.id}/${activity.id}/${clientRequestId}.xlsx`;
    await uploadWithProgress(url, anonKey, token, storagePath, file, onProgress);

    const { data, error } = await client.rpc('submit_delivery', {
      p_activity_id: activity.id,
      p_member_name: memberName,
      p_storage_path: storagePath,
      p_original_filename: file.name,
      p_client_request_id: clientRequestId,
    });
    if (error) throw error;
    if (!data) throw new Error('O servidor não confirmou o registro da entrega.');
    return normalizeSubmission(data as Submission);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao enviar a entrega.');
  }
};

export const getSignedDownloadUrl = async (
  client: SupabaseClient | null,
  submission: Pick<Submission, 'storage_path' | 'original_filename'>
): Promise<string> => {
  const c = requireClient(client);
  try {
    const { data, error } = await c.storage
      .from(DELIVERIES_BUCKET)
      .createSignedUrl(submission.storage_path, SIGNED_URL_TTL_SECONDS, {
        download: submission.original_filename,
      });
    if (error) throw error;
    if (!data?.signedUrl) throw new Error('Não foi possível gerar o link de download.');
    return data.signedUrl;
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao gerar link de download.');
  }
};

// ----------------------------------------------------------------------------
// ÁREA DO PROFESSOR
// ----------------------------------------------------------------------------

export const teacherSignIn = async (email: string, password: string): Promise<{ email: string }> => {
  const client = requireClient(getTeacherClient());
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      if (/invalid login credentials/i.test(error.message)) throw new Error('E-mail ou senha incorretos.');
      throw error;
    }
    const isTeacher = await checkIsTeacher();
    if (!isTeacher) {
      await client.auth.signOut();
      throw new Error('Esta conta não possui perfil de professor.');
    }
    return { email: data.user?.email || email };
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao entrar.');
  }
};

export const checkIsTeacher = async (): Promise<boolean> => {
  const client = requireClient(getTeacherClient());
  const { data, error } = await client.rpc('is_teacher');
  if (error) throw toFriendlyError(error, 'Erro ao verificar perfil.');
  return data === true;
};

export const getTeacherSessionEmail = async (): Promise<string | null> => {
  const client = getTeacherClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  if (!data.session) return null;
  try {
    return (await checkIsTeacher()) ? data.session.user.email || 'Professor' : null;
  } catch {
    return null;
  }
};

export const teacherSignOut = async (): Promise<void> => {
  const client = getTeacherClient();
  if (client) await client.auth.signOut();
};

export const fetchAllGroups = async (): Promise<Group[]> => {
  const client = requireClient(getTeacherClient());
  try {
    const { data, error } = await client
      .from('groups')
      .select('id,user_id,members,class_name,company_name,business_sector,description,logo_url,selected_problem_id,status,completed_objectives,created_at,updated_at')
      .order('class_name')
      .order('company_name');
    if (error) throw error;
    return data as Group[];
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao carregar empresas.');
  }
};

export const fetchAllActivities = async (): Promise<Activity[]> => {
  const client = requireClient(getTeacherClient());
  try {
    const { data, error } = await client.from('activities').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Activity[]).map(normalizeActivity);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao carregar atividades.');
  }
};

export const fetchAllSubmissions = async (): Promise<Submission[]> => {
  const client = requireClient(getTeacherClient());
  try {
    const { data, error } = await client
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return (data as Submission[]).map(normalizeSubmission);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao carregar entregas.');
  }
};

export const saveActivity = async (input: ActivityInput, id?: string): Promise<Activity> => {
  const client = requireClient(getTeacherClient());
  const payload = {
    title: input.title.trim(),
    instructions: input.instructions.trim(),
    due_at: input.due_at,
    max_score: input.max_score,
    class_names: input.class_names,
    is_published: input.is_published,
    accepts_submissions: input.accepts_submissions,
  };
  try {
    const query = id
      ? client.from('activities').update(payload).eq('id', id).select().single()
      : client.from('activities').insert(payload).select().single();
    const { data, error } = await query;
    if (error) throw error;
    return normalizeActivity(data as Activity);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao salvar atividade.');
  }
};

export const gradeSubmission = async (
  submissionId: string,
  score: number,
  feedback: string
): Promise<Submission> => {
  const client = requireClient(getTeacherClient());
  try {
    const { data, error } = await client.rpc('grade_submission', {
      p_submission_id: submissionId,
      p_score: score,
      p_feedback: feedback,
    });
    if (error) throw error;
    return normalizeSubmission(data as Submission);
  } catch (err) {
    throw toFriendlyError(err, 'Erro ao salvar correção.');
  }
};

// ----------------------------------------------------------------------------
// Utilidades de apresentação
// ----------------------------------------------------------------------------

export const deliveryStatusOf = (current: Submission | undefined): DeliveryStatus =>
  !current ? 'pendente' : current.status;

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
};

const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export const formatDateTime = (iso: string | null | undefined): string =>
  iso ? dateTimeFmt.format(new Date(iso)) : '—';

export const formatScore = (n: number | null | undefined): string =>
  n === null || n === undefined ? '—' : n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/** Dispara o download de uma URL assinada (Content-Disposition: attachment) sem sair da página. */
export const triggerDownload = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const isPastDue = (activity: Pick<Activity, 'due_at'>): boolean =>
  !!activity.due_at && Date.now() > new Date(activity.due_at).getTime();
