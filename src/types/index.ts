export type ActivityStatus = 'nao_iniciada' | 'em_andamento' | 'concluida';
export type ClassName = '2º2' | '2º3';

export interface Group {
  id: string;
  user_id: string;
  members: string;
  class_name: ClassName;
  company_name: string;
  business_sector: string;
  description: string;
  logo_url: string | null;
  selected_problem_id: number | null;
  status: ActivityStatus;
  completed_objectives: string[];
  created_at: string;
  updated_at: string;
}

export interface LearningObjective {
  id: string;
  title: string;
  scope: 'comum' | 'especifico';
  description?: string;
}

export interface OnlyofficeTool {
  category: string;
  details: string;
  scope: 'comum' | 'especifico';
}

export interface Problem {
  id: number;
  number: number;
  title: string;
  shortTitle: string;
  tag: string;
  description: string;
  objective: string;
  commonTools: OnlyofficeTool[];
  specificTools: OnlyofficeTool[];
  onlyofficeTools: OnlyofficeTool[];
  learningObjectives: LearningObjective[];
  accentColor: {
    bg: string;
    border: string;
    badge: string;
    text: string;
    gradient: string;
    lightBg: string;
  };
  icon: string;
}

export interface CreateGroupInput {
  email: string;
  password: string;
  confirmPassword: string;
  members: string;
  class_name: ClassName;
  company_name: string;
  business_sector: string;
  description: string;
  logo_file?: File | null;
  logo_url?: string | null;
}

export interface UpdateGroupInput {
  company_name: string;
  business_sector: string;
  description: string;
  members: string;
  class_name: ClassName;
  logo_file?: File | null;
  logo_url?: string | null;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

// ============================================================================
// CENTRAL DE ENTREGAS
// ============================================================================

export interface Activity {
  id: string;
  title: string;
  instructions: string;
  due_at: string | null;
  max_score: number;
  class_names: ClassName[];
  is_published: boolean;
  accepts_submissions: boolean;
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = 'entregue' | 'corrigida';

/** Status exibido por atividade (pendente é derivado: sem nenhuma versão enviada). */
export type DeliveryStatus = 'pendente' | SubmissionStatus;

export interface Submission {
  id: string;
  group_id: string;
  activity_id: string;
  version: number;
  responsible_member_id: string | null;
  responsible_member_name: string;
  original_filename: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  submitted_at: string;
  submitted_by: string;
  is_late: boolean;
  client_request_id: string;
  is_current: boolean;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  graded_at: string | null;
  graded_by: string | null;
}

export interface ActivityInput {
  title: string;
  instructions: string;
  due_at: string | null;
  max_score: number;
  class_names: ClassName[];
  is_published: boolean;
  accepts_submissions: boolean;
}
