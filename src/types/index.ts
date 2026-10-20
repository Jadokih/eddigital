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
}

export interface Problem {
  id: number;
  number: number;
  title: string;
  shortTitle: string;
  tag: string;
  description: string;
  objective: string;
  onlyofficeTools: {
    category: string;
    details: string;
  }[];
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
