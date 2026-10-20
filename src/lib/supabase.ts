import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateGroupInput, Group, UpdateGroupInput } from '../types';

const STORAGE_KEYS = {
  URL: 'founders_grid_supabase_url',
  ANON_KEY: 'founders_grid_supabase_anon_key',
  DEMO_CURRENT_GROUP: 'founders_grid_demo_current_group',
  DEMO_GROUPS_LIST: 'founders_grid_demo_groups_list',
};

// Validação simples e permissiva de formato de e-mail
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Recupera as credenciais ativas (env ou salvas via interface)
export const getActiveSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.URL) : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ANON_KEY) : null;

  const url = (storedUrl || envUrl || '').trim();
  const anonKey = (storedKey || envKey || '').trim();

  const isConfigured = Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);

  return { url, anonKey, isConfigured };
};

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getActiveSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch (error) {
    console.error('Erro ao inicializar Supabase:', error);
    return null;
  }
};

export const saveSupabaseCredentials = (url: string, anonKey: string) => {
  localStorage.setItem(STORAGE_KEYS.URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
  cachedClient = null;
};

export const clearCustomSupabaseCredentials = () => {
  localStorage.removeItem(STORAGE_KEYS.URL);
  localStorage.removeItem(STORAGE_KEYS.ANON_KEY);
  cachedClient = null;
};

export const testSupabaseConnection = async (
  url: string,
  anonKey: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!url.startsWith('https://') || !anonKey) {
      return { success: false, message: 'URL deve começar com https:// e a chave não pode estar vazia.' };
    }
    const testClient = createClient(url, anonKey);
    const { error } = await testClient.from('groups').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205') {
        return {
          success: true,
          message:
            'Conexão ativa com o Supabase! Nota: A tabela "groups" ainda precisa ser criada executando o script em supabase/schema.sql.',
        };
      }
      if (error.message.includes('FetchError')) {
        return { success: false, message: 'Falha de rede ao conectar com a URL informada.' };
      }
    }

    return { success: true, message: 'Conexão com o Supabase estabelecida com sucesso!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Erro inesperado ao testar conexão.' };
  }
};

// ==========================================
// SERVIÇOS DE PERSISTÊNCIA & AUTENTICAÇÃO
// ==========================================

export const uploadCompanyLogo = async (file: File, groupIdentifier: string): Promise<string> => {
  const client = getSupabaseClient();

  if (client) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanId = groupIdentifier.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '') || 'logo';
      const fileName = `${cleanId}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await client.storage
        .from('company-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = client.storage.from('company-logos').getPublicUrl(filePath);
        return data.publicUrl;
      }
      console.warn('Upload no storage do Supabase indisponível, usando fallback seguro:', uploadError.message);
    } catch (err) {
      console.warn('Falha no upload do Supabase Storage:', err);
    }
  }

  // Fallback seguro: converte imagem para DataURL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Cadastro do Grupo com E-mail e Senha no Supabase Auth
export const signUpGroup = async (input: CreateGroupInput): Promise<{ group: Group }> => {
  const client = getSupabaseClient();
  const email = input.email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    throw new Error('Informe um endereço de e-mail válido (ex: grupo@escola.com).');
  }

  let finalLogoUrl = input.logo_url || null;
  if (input.logo_file) {
    try {
      finalLogoUrl = await uploadCompanyLogo(input.logo_file, email);
    } catch (e) {
      console.error('Falha ao processar logo:', e);
    }
  }

  if (client) {
    // 1. Cadastrar no Supabase Auth
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          company_name: input.company_name,
          class_name: input.class_name,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new Error('Este e-mail já está cadastrado para outro grupo. Use a aba "Entrar" ou outro e-mail.');
      }
      if (authError.message.includes('rate limit')) {
        throw new Error(
          'Limite de envio de e-mails atingido no Supabase. Para uso em sala de aula sem envio de e-mails, desmarque "Confirm email" em Authentication > Providers > Email no painel do Supabase.'
        );
      }
      throw new Error(`Erro no cadastro: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('Não foi possível obter o ID do usuário cadastrado.');
    }

    // Se a confirmação de e-mail estiver desativada no Supabase, tenta logar direto para garantir a sessão ativa
    if (!authData.session) {
      await client.auth.signInWithPassword({
        email,
        password: input.password,
      }).catch(() => null);
    }

    // 2. Inserir na tabela `groups`
    const newGroupData = {
      user_id: userId,
      members: input.members.trim(),
      class_name: input.class_name,
      company_name: input.company_name.trim(),
      business_sector: input.business_sector.trim(),
      description: input.description.trim(),
      logo_url: finalLogoUrl,
      selected_problem_id: null,
      status: 'nao_iniciada' as const,
      completed_objectives: [],
    };

    const { data: groupData, error: groupError } = await client
      .from('groups')
      .insert(newGroupData)
      .select()
      .single();

    if (groupError) {
      if (groupError.code === 'PGRST205') {
        throw new Error(
          'A tabela "groups" ainda não foi criada no Supabase. Por favor, execute o script SQL em "supabase/schema.sql" no SQL Editor do seu projeto Supabase.'
        );
      }
      throw new Error(`Empresa criada na autenticação, mas erro ao salvar dados: ${groupError.message}`);
    }

    return { group: groupData as Group };
  } else {
    // MODO DEMONSTRAÇÃO LOCAL
    const demoId = `demo-group-${Date.now()}`;
    const newGroup: Group = {
      id: demoId,
      user_id: `user-${demoId}`,
      members: input.members.trim(),
      class_name: input.class_name,
      company_name: input.company_name.trim(),
      business_sector: input.business_sector.trim(),
      description: input.description.trim(),
      logo_url: finalLogoUrl,
      selected_problem_id: null,
      status: 'nao_iniciada',
      completed_objectives: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveDemoGroup(newGroup, email, input.password);
    return { group: newGroup };
  }
};

// Login do Grupo com E-mail e Senha no Supabase Auth
export const signInGroup = async (email: string, password: string): Promise<{ group: Group }> => {
  const client = getSupabaseClient();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    throw new Error('Informe um endereço de e-mail válido.');
  }

  if (client) {
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error(`E-mail ou senha incorretos.`);
      }
      if (authError.message.includes('Email not confirmed')) {
        throw new Error(
          'O Supabase está exigindo confirmação de e-mail. Para desativar essa exigência em sala de aula, desmarque "Confirm email" em Authentication > Providers > Email no painel do Supabase.'
        );
      }
      throw new Error(`Erro ao entrar: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('Sessão não identificada.');
    }

    const { data: groupData, error: groupError } = await client
      .from('groups')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (groupError) {
      if (groupError.code === 'PGRST205') {
        throw new Error(
          'A tabela "groups" ainda não foi criada no Supabase. Execute o script em "supabase/schema.sql" no SQL Editor do Supabase.'
        );
      }
      throw new Error(`Erro ao recuperar informações da empresa: ${groupError.message}`);
    }

    if (!groupData) {
      throw new Error('Nenhuma empresa associada a este usuário foi encontrada no banco de dados.');
    }

    return { group: groupData as Group };
  } else {
    // MODO DEMONSTRAÇÃO
    const group = getDemoGroup(cleanEmail, password);
    if (!group) {
      throw new Error(`E-mail ou senha incorretos para "${cleanEmail}".`);
    }
    localStorage.setItem(STORAGE_KEYS.DEMO_CURRENT_GROUP, JSON.stringify(group));
    return { group };
  }
};

// Recuperar sessão ativa do grupo
export const getCurrentSession = async (): Promise<{ group: Group | null }> => {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) {
        return { group: null };
      }

      const { data: groupData, error } = await client
        .from('groups')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error || !groupData) {
        return { group: null };
      }

      return { group: groupData as Group };
    } catch (e) {
      console.warn('Erro ao verificar sessão Supabase:', e);
      return { group: null };
    }
  } else {
    // MODO DEMONSTRAÇÃO
    const stored = localStorage.getItem(STORAGE_KEYS.DEMO_CURRENT_GROUP);
    if (stored) {
      try {
        return { group: JSON.parse(stored) };
      } catch {
        return { group: null };
      }
    }
    return { group: null };
  }
};

// Logout do Grupo
export const signOutGroup = async (): Promise<void> => {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
  localStorage.removeItem(STORAGE_KEYS.DEMO_CURRENT_GROUP);
};

// Atualizar dados da empresa
export const updateGroupProfile = async (groupId: string, input: UpdateGroupInput): Promise<Group> => {
  const client = getSupabaseClient();

  let finalLogoUrl = input.logo_url;
  if (input.logo_file) {
    finalLogoUrl = await uploadCompanyLogo(input.logo_file, `logo-${groupId}`);
  }

  const updatePayload: Partial<Group> = {
    company_name: input.company_name.trim(),
    business_sector: input.business_sector.trim(),
    description: input.description.trim(),
    members: input.members.trim(),
    class_name: input.class_name,
    updated_at: new Date().toISOString(),
  };

  if (finalLogoUrl !== undefined) {
    updatePayload.logo_url = finalLogoUrl;
  }

  if (client) {
    const { data, error } = await client
      .from('groups')
      .update(updatePayload)
      .eq('id', groupId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar dados: ${error.message}`);
    }
    return data as Group;
  } else {
    // MODO DEMO
    const demo = getDemoCurrentGroup();
    if (!demo || demo.id !== groupId) {
      throw new Error('Grupo não encontrado na sessão demo.');
    }
    const updated = { ...demo, ...updatePayload };
    saveDemoCurrentGroup(updated);
    return updated;
  }
};

// Selecionar ou alterar problema escolhido
export const updateSelectedProblem = async (groupId: string, problemId: number): Promise<Group> => {
  const client = getSupabaseClient();

  const updatePayload = {
    selected_problem_id: problemId,
    status: 'em_andamento' as const,
    updated_at: new Date().toISOString(),
  };

  if (client) {
    const { data, error } = await client
      .from('groups')
      .update(updatePayload)
      .eq('id', groupId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao registrar escolha do problema: ${error.message}`);
    }
    return data as Group;
  } else {
    // MODO DEMO
    const demo = getDemoCurrentGroup();
    if (!demo || demo.id !== groupId) {
      throw new Error('Grupo não encontrado.');
    }
    const updated = { ...demo, ...updatePayload };
    saveDemoCurrentGroup(updated);
    return updated;
  }
};

// Alternar objetivo de aprendizagem (checklist)
export const toggleLearningObjective = async (
  group: Group,
  objectiveId: string,
  totalObjectivesCount: number
): Promise<Group> => {
  const client = getSupabaseClient();
  const currentList = Array.isArray(group.completed_objectives) ? [...group.completed_objectives] : [];

  const isAlreadyCompleted = currentList.includes(objectiveId);
  const updatedList = isAlreadyCompleted
    ? currentList.filter((id) => id !== objectiveId)
    : [...currentList, objectiveId];

  let newStatus = group.status;
  if (updatedList.length === totalObjectivesCount && totalObjectivesCount > 0) {
    newStatus = 'concluida';
  } else if (group.selected_problem_id) {
    newStatus = 'em_andamento';
  }

  const updatePayload = {
    completed_objectives: updatedList,
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (client) {
    const { data, error } = await client
      .from('groups')
      .update(updatePayload)
      .eq('id', group.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao salvar progresso: ${error.message}`);
    }
    return data as Group;
  } else {
    // MODO DEMO
    const updated = { ...group, ...updatePayload };
    saveDemoCurrentGroup(updated);
    return updated;
  }
};

// ==========================================
// HELPERS DO MODO DEMONSTRAÇÃO
// ==========================================

interface DemoStoreItem {
  email: string;
  passwordHash: string;
  group: Group;
}

const getDemoStore = (): DemoStoreItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEMO_GROUPS_LIST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveDemoGroup = (group: Group, email: string, password: string) => {
  const store = getDemoStore();
  const existing = store.findIndex((item) => item.email.toLowerCase() === email.toLowerCase());
  const item: DemoStoreItem = {
    email,
    passwordHash: btoa(password),
    group,
  };
  if (existing >= 0) {
    store[existing] = item;
  } else {
    store.push(item);
  }
  localStorage.setItem(STORAGE_KEYS.DEMO_GROUPS_LIST, JSON.stringify(store));
  saveDemoCurrentGroup(group);
};

const getDemoGroup = (email: string, password: string): Group | null => {
  const store = getDemoStore();
  const target = store.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.passwordHash === btoa(password)
  );
  return target ? target.group : null;
};

const getDemoCurrentGroup = (): Group | null => {
  const data = localStorage.getItem(STORAGE_KEYS.DEMO_CURRENT_GROUP);
  return data ? JSON.parse(data) : null;
};

const saveDemoCurrentGroup = (group: Group) => {
  localStorage.setItem(STORAGE_KEYS.DEMO_CURRENT_GROUP, JSON.stringify(group));
  const store = getDemoStore();
  const idx = store.findIndex((i) => i.group.id === group.id);
  if (idx >= 0) {
    store[idx].group = group;
    localStorage.setItem(STORAGE_KEYS.DEMO_GROUPS_LIST, JSON.stringify(store));
  }
};
