import type { Problem, OnlyofficeTool, LearningObjective } from '../types';

// ============================================================================
// 1. APRENDENDO O BÁSICO (Comum a todos — aula geral compartilhada)
// ============================================================================
export const COMMON_SPREADSHEET_TOOLS: OnlyofficeTool[] = [
  {
    category: 'Introdução ao ONLYOFFICE',
    details: 'Acesso à suíte, navegação pela interface, menus principais e salvamento na nuvem.',
    scope: 'comum',
  },
  {
    category: 'Criando uma Planilha',
    details: 'Criação de nova pasta de trabalho, compreensão de linhas, colunas, células e intervalos.',
    scope: 'comum',
  },
  {
    category: 'Estruturação de Tabela',
    details: 'Criação de cabeçalhos claros, dimensionamento adequado de colunas e boas práticas de layout.',
    scope: 'comum',
  },
  {
    category: 'Tipagem & Formatação',
    details: 'Padronização de tipos de células: texto, valores numéricos, moeda (R$) e datas.',
    scope: 'comum',
  },
  {
    category: 'Fórmulas Aritméticas Básicas',
    details: 'Cálculos fundamentais compartilhados por toda a turma (SOMA, subtração e MÉDIA).',
    scope: 'comum',
  },
  {
    category: 'Filtros & Ordenação',
    details: 'Habilitação de filtros no cabeçalho e ordenação rápida de dados por coluna.',
    scope: 'comum',
  },
];

export const COMMON_LEARNING_OBJECTIVES: LearningObjective[] = [
  {
    id: 'core_obj1',
    title: 'Introdução ao ONLYOFFICE (conhecer a interface e navegação da suíte)',
    scope: 'comum',
    description: 'Aprendendo o básico em aula com o professor.',
  },
  {
    id: 'core_obj2',
    title: 'Criando uma planilha (criar novo arquivo e compreender linhas, colunas e células)',
    scope: 'comum',
    description: 'Aprendendo o básico em aula com o professor.',
  },
  {
    id: 'core_obj3',
    title: 'Estruturar tabela com cabeçalhos claros e boas práticas de layout',
    scope: 'comum',
    description: 'Aprendendo o básico em aula com o professor.',
  },
  {
    id: 'core_obj4',
    title: 'Padronizar formatação de células e tipos de dados (texto, número, moeda R$)',
    scope: 'comum',
    description: 'Aprendendo o básico em aula com o professor.',
  },
  {
    id: 'core_obj5',
    title: 'Aplicar fórmulas matemáticas fundamentais (SOMA, subtração e média)',
    scope: 'comum',
    description: 'Aprendendo o básico em aula com o professor.',
  },
  {
    id: 'core_obj6',
    title: 'Configurar filtros no cabeçalho e ordenar registros com segurança',
    scope: 'comum',
    description: 'Aprendendo o básico em aula com o professor.',
  },
];

// ============================================================================
// 2. AS 4 MISSÕES (Aprendendo o básico + Agora é com você)
// ============================================================================
export const PROBLEMS_DATA: Problem[] = [
  {
    id: 1,
    number: 1,
    title: 'Falta de organização financeira',
    shortTitle: 'Organização Financeira',
    tag: 'Finanças & Fluxo de Caixa',
    description: 'Pequenos negócios têm dificuldade para controlar receitas, despesas, custos operacionais e lucro real.',
    objective: 'Criar uma planilha de fluxo de caixa para registrar entradas e saídas, calcular o saldo automaticamente e gerar gráficos de resultados.',
    icon: 'BadgeDollarSign',
    accentColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200 hover:border-emerald-300',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      gradient: '',
      lightBg: 'bg-emerald-50',
    },
    commonTools: COMMON_SPREADSHEET_TOOLS,
    specificTools: [
      {
        category: 'Cálculo de Saldo Automático',
        details: 'Fórmulas para saldo final acumulado e apuração de lucro líquido (Receitas - Despesas).',
        scope: 'especifico',
      },
      {
        category: 'Formatação Condicional de Saldo',
        details: 'Destaque visual automático com cores para saldo positivo (verde) ou negativo (vermelho).',
        scope: 'especifico',
      },
      {
        category: 'Gráficos Comparativos',
        details: 'Gráficos de barras e pizza para visualização clara da divisão de custos e receitas.',
        scope: 'especifico',
      },
    ],
    get onlyofficeTools() {
      return [...this.commonTools, ...this.specificTools];
    },
    learningObjectives: [
      ...COMMON_LEARNING_OBJECTIVES,
      {
        id: 'p1_spec1',
        title: 'Calcular receitas, despesas e o saldo final da empresa automaticamente',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p1_spec2',
        title: 'Configurar formatação condicional com cores para saldo positivo vs. negativo',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p1_spec3',
        title: 'Criar gráficos comparativos de receitas vs. despesas para análise da empresa',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
    ],
  },
  {
    id: 2,
    number: 2,
    title: 'Dificuldade para controlar estoque',
    shortTitle: 'Controle de Estoque',
    tag: 'Operações & Logística',
    description: 'Pequenos comércios perdem vendas ou compram produtos em excesso por não saberem com exatidão a quantidade em estoque.',
    objective: 'Criar uma planilha de controle de produtos com quantidades, custos, entradas, saídas e alertas automáticos de estoque mínimo.',
    icon: 'Boxes',
    accentColor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200 hover:border-blue-300',
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
      text: 'text-blue-700',
      gradient: '',
      lightBg: 'bg-blue-50',
    },
    commonTools: COMMON_SPREADSHEET_TOOLS,
    specificTools: [
      {
        category: 'Fórmulas de Quantidade e Valor',
        details: 'Cálculo de estoque atual dinâmico (Entradas - Saídas) e valor total do estoque (Qtd * Custo).',
        scope: 'especifico',
      },
      {
        category: 'Alerta de Estoque Mínimo',
        details: 'Formatação condicional com aviso visual automático para itens que atingiram o limite mínimo.',
        scope: 'especifico',
      },
      {
        category: 'Gráficos de Giro de Mercadorias',
        details: 'Visualização da movimentação de mercadorias e identificação dos itens mais vendidos.',
        scope: 'especifico',
      },
    ],
    get onlyofficeTools() {
      return [...this.commonTools, ...this.specificTools];
    },
    learningObjectives: [
      ...COMMON_LEARNING_OBJECTIVES,
      {
        id: 'p2_spec1',
        title: 'Calcular o saldo atual de estoque (entradas - saídas) e valor total investido',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p2_spec2',
        title: 'Aplicar formatação condicional com alerta visual para reposição de estoque mínimo',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p2_spec3',
        title: 'Gerar gráficos de movimentação e giro de produtos para tomada de decisão',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
    ],
  },
  {
    id: 3,
    number: 3,
    title: 'Falta de organização de tarefas e prazos',
    shortTitle: 'Tarefas e Prazos',
    tag: 'Gestão de Projetos & Equipes',
    description: 'Equipes escolares e de trabalho esquecem compromissos, atrasam entregas e têm dificuldade para dividir responsabilidades.',
    objective: 'Desenvolver uma planilha de cronograma e acompanhamento de tarefas com responsáveis, datas de entrega e status dinâmico.',
    icon: 'CalendarCheck2',
    accentColor: {
      bg: 'bg-amber-50',
      border: 'border-amber-200 hover:border-amber-300',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      text: 'text-amber-700',
      gradient: '',
      lightBg: 'bg-amber-50',
    },
    commonTools: COMMON_SPREADSHEET_TOOLS,
    specificTools: [
      {
        category: 'Validação de Dados (Listas)',
        details: 'Criação de menus suspensos para seleção padronizada de status (Pendente, Em Andamento, Concluído).',
        scope: 'especifico',
      },
      {
        category: 'Formatação Condicional de Prazos',
        details: 'Regras visuais automáticas para destacar tarefas atrasadas ou que vencem na semana.',
        scope: 'especifico',
      },
      {
        category: 'Fórmulas de Data & Acompanhamento',
        details: 'Cálculo de dias restantes para o prazo final e gráfico de tarefas concluídas vs. pendentes.',
        scope: 'especifico',
      },
    ],
    get onlyofficeTools() {
      return [...this.commonTools, ...this.specificTools];
    },
    learningObjectives: [
      ...COMMON_LEARNING_OBJECTIVES,
      {
        id: 'p3_spec1',
        title: 'Configurar lista suspensa com validação de dados para status das atividades',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p3_spec2',
        title: 'Aplicar formatação condicional para avisos visuais de prazos e tarefas atrasadas',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p3_spec3',
        title: 'Calcular dias restantes com fórmulas de data e gerar gráfico de progresso da equipe',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
    ],
  },
  {
    id: 5,
    number: 4,
    title: 'Falta de organização de informações e cadastros',
    shortTitle: 'Cadastros e Informações',
    tag: 'Dados & Registros',
    description: 'Pequenos negócios, associações e projetos comunitários têm dificuldade para manter registros limpos e confiáveis de clientes ou participantes.',
    objective: 'Desenvolver uma planilha de banco de dados organizada, com campos padronizados, validação para evitar erros e fórmulas estatísticas.',
    icon: 'Database',
    accentColor: {
      bg: 'bg-slate-100',
      border: 'border-slate-300 hover:border-slate-400',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      text: 'text-slate-800',
      gradient: '',
      lightBg: 'bg-slate-50',
    },
    commonTools: COMMON_SPREADSHEET_TOOLS,
    specificTools: [
      {
        category: 'Validação de Dados em Campos Críticos',
        details: 'Restrição de preenchimento para garantir formato correto de contatos, estados e categorias.',
        scope: 'especifico',
      },
      {
        category: 'Fórmulas Estatísticas (CONT.SE)',
        details: 'Totalização automática de cadastros por categoria, cidade ou segmento com a função CONT.SE.',
        scope: 'especifico',
      },
      {
        category: 'Tabela Resumo de Métricas',
        details: 'Construção de painel sintético com indicadores consolidados a partir da base de dados.',
        scope: 'especifico',
      },
    ],
    get onlyofficeTools() {
      return [...this.commonTools, ...this.specificTools];
    },
    learningObjectives: [
      ...COMMON_LEARNING_OBJECTIVES,
      {
        id: 'p4_spec1',
        title: 'Configurar validação de dados para padronizar campos e evitar falhas de cadastro',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p4_spec2',
        title: 'Criar fórmulas com CONT.SE para totalizar automaticamente registros por categoria',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
      {
        id: 'p4_spec3',
        title: 'Construir tabela de resumo com métricas e indicadores consolidados da base',
        scope: 'especifico',
        description: 'Agora é com você: desenvolvimento do grupo.',
      },
    ],
  },
];
