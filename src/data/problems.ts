import type { Problem } from '../types';

export const PROBLEMS_DATA: Problem[] = [
  {
    id: 1,
    number: 1,
    title: 'Falta de organização financeira',
    shortTitle: 'Organização Financeira',
    tag: 'Finanças & Fluxo de Caixa',
    description: 'Pequenos negócios têm dificuldade para controlar receitas, despesas, custos operacionais e lucro real.',
    objective: 'Criar uma planilha estruturada para registrar entradas e saídas, calcular o saldo automaticamente e visualizar a saúde financeira.',
    icon: 'BadgeDollarSign',
    accentColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200 hover:border-emerald-300',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      gradient: '',
      lightBg: 'bg-emerald-50',
    },
    onlyofficeTools: [
      {
        category: 'Planilhas',
        details: 'Estruturação de fluxo de caixa em linhas e colunas bem padronizadas.',
      },
      {
        category: 'Fórmulas Matemáticas',
        details: 'Cálculos essenciais com SOMA, SUBTRAÇÃO e MÉDIA.',
      },
      {
        category: 'Formatação de Moeda',
        details: 'Padronização visual em Real (R$) e formatação de valores decimais.',
      },
      {
        category: 'Gráficos Financeiros',
        details: 'Gráficos de barras e pizza para visualização clara de lucros e despesas.',
      },
      {
        category: 'Filtros e Registros',
        details: 'Filtragem por data, tipo de despesa e categoria de receita.',
      },
    ],
    learningObjectives: [
      { id: 'p1_obj1', title: 'Organizar informações em uma planilha financeira estruturada' },
      { id: 'p1_obj2', title: 'Criar fórmulas para calcular totais (SOMA e subtração)' },
      { id: 'p1_obj3', title: 'Calcular receitas, despesas e saldo final automaticamente' },
      { id: 'p1_obj4', title: 'Aplicar formatação de moeda (R$) e estilos visuais adequados' },
      { id: 'p1_obj5', title: 'Criar gráficos comparativos de receitas vs. despesas' },
      { id: 'p1_obj6', title: 'Apresentar os resultados e conclusões financeiras da empresa' },
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
    onlyofficeTools: [
      {
        category: 'Planilhas',
        details: 'Tabelas padronizadas com código, produto, custo unitário e preço de venda.',
      },
      {
        category: 'Fórmulas de Quantidade e Valor',
        details: 'Multiplicações automáticas de volume por preço unitário e saldo em estoque.',
      },
      {
        category: 'Formatação Condicional',
        details: 'Regras visuais para destacar automaticamente itens com estoque baixo.',
      },
      {
        category: 'Classificação e Filtros',
        details: 'Ordenação rápida por produtos com maior giro ou em risco de falta.',
      },
      {
        category: 'Gráficos de Movimentação',
        details: 'Monitoramento da evolução de entradas e saídas de mercadorias.',
      },
    ],
    learningObjectives: [
      { id: 'p2_obj1', title: 'Estruturar tabela de produtos com código, nome e categoria' },
      { id: 'p2_obj2', title: 'Registrar entradas, saídas e calcular estoque atual dinâmico' },
      { id: 'p2_obj3', title: 'Criar fórmulas para valor total investido em mercadorias' },
      { id: 'p2_obj4', title: 'Configurar formatação condicional com cores para alerta de estoque mínimo' },
      { id: 'p2_obj5', title: 'Aplicar filtros para localizar mercadorias com rapidez' },
      { id: 'p2_obj6', title: 'Gerar gráficos de movimentação e giro de produtos' },
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
    onlyofficeTools: [
      {
        category: 'Planilhas (Cronograma)',
        details: 'Matriz de atividades, datas de início, prazos finais e responsáveis.',
      },
      {
        category: 'Validação de Dados (Listas)',
        details: 'Menu suspenso para status (Pendente, Em Andamento, Concluído).',
      },
      {
        category: 'Formatação Condicional',
        details: 'Destaque automático de tarefas atrasadas ou que vencem na semana.',
      },
      {
        category: 'Fórmulas de Data e Prazos',
        details: 'Cálculo de dias restantes para a entrega e contagem de itens em aberto.',
      },
      {
        category: 'Gráficos de Acompanhamento',
        details: 'Gráfico de barras para visualização do progresso das atividades.',
      },
    ],
    learningObjectives: [
      { id: 'p3_obj1', title: 'Construir um cronograma com atividades, prazos e responsáveis' },
      { id: 'p3_obj2', title: 'Inserir listas suspensas de validação para status (A Fazer / Feito)' },
      { id: 'p3_obj3', title: 'Aplicar formatação condicional para avisos visuais de prazos' },
      { id: 'p3_obj4', title: 'Calcular dias restantes e prazos com fórmulas de data na planilha' },
      { id: 'p3_obj5', title: 'Criar gráfico de acompanhamento de tarefas concluídas vs. pendentes' },
      { id: 'p3_obj6', title: 'Avaliar e revisar periodicamente a divisão de funções do grupo' },
    ],
  },
  {
    id: 5,
    number: 4,
    title: 'Falta de organização de informações e cadastros',
    shortTitle: 'Cadastros e Informações',
    tag: 'Dados & Registros',
    description: 'Pequenos negócios, associações e projetos comunitários têm dificuldade para manter registros limpos e confiáveis de clientes ou participantes.',
    objective: 'Desenvolver uma planilha de banco de dados organizada, com campos padronizados, validação para evitar erros e fórmulas de consulta.',
    icon: 'Database',
    accentColor: {
      bg: 'bg-slate-100',
      border: 'border-slate-300 hover:border-slate-400',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      text: 'text-slate-800',
      gradient: '',
      lightBg: 'bg-slate-50',
    },
    onlyofficeTools: [
      {
        category: 'Planilhas (Base de Dados)',
        details: 'Estruturação de colunas padronizadas com tipagem de dados correta.',
      },
      {
        category: 'Classificação e Filtros Avançados',
        details: 'Busca ágil por cidade, status, categoria ou data de cadastro.',
      },
      {
        category: 'Validação de Dados',
        details: 'Regras de preenchimento para evitar erros em e-mails, telefones e opções.',
      },
      {
        category: 'Fórmulas Estatísticas (CONT.SE)',
        details: 'Totalizadores automáticos de clientes por categoria ou região.',
      },
      {
        category: 'Resumo e Métricas em Tabela',
        details: 'Painel sintético com indicadores consolidados a partir dos registros.',
      },
    ],
    learningObjectives: [
      { id: 'p5_obj1', title: 'Modelar colunas padronizadas para cadastro seguro de registros' },
      { id: 'p5_obj2', title: 'Configurar validação de dados e menus suspensos de opções' },
      { id: 'p5_obj3', title: 'Aplicar filtros avançados e ordenação por múltiplos critérios' },
      { id: 'p5_obj4', title: 'Criar fórmulas estatísticas (ex: CONT.SE para totalizar categorias)' },
      { id: 'p5_obj5', title: 'Gerar tabela de resumo com métricas consolidadas dos registros' },
      { id: 'p5_obj6', title: 'Realizar testes práticos de busca e consulta ágil aos dados' },
    ],
  },
];
