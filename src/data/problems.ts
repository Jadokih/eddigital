import type { Problem } from '../types';

export const PROBLEMS_DATA: Problem[] = [
  {
    id: 1,
    number: 1,
    title: 'Falta de organização financeira',
    shortTitle: 'Organização Financeira',
    tag: 'Finanças & Fluxo de Caixa',
    description: 'Pequenos negócios têm dificuldade para controlar receitas, despesas, custos e lucros.',
    objective: 'Criar uma planilha que permita registrar entradas e saídas, calcular o saldo e visualizar os resultados financeiros.',
    icon: 'BadgeDollarSign',
    accentColor: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30 hover:border-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      text: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
    },
    onlyofficeTools: [
      {
        category: 'Planilhas',
        details: 'Organização de dados em linhas e colunas bem estruturadas.',
      },
      {
        category: 'Fórmulas Matemáticas',
        details: 'Cálculos essenciais como SOMA, SUBTRAÇÃO e MÉDIA.',
      },
      {
        category: 'Formatação de Moeda',
        details: 'Padronização de valores em Real (R$) e números decimais.',
      },
      {
        category: 'Gráficos Financeiros',
        details: 'Gráficos de barras e pizza para visualização de lucros e despesas.',
      },
      {
        category: 'Filtros e Registros',
        details: 'Filtragem por data, categoria e forma de pagamento.',
      },
    ],
    learningObjectives: [
      { id: 'p1_obj1', title: 'Organizar informações em uma planilha estruturada' },
      { id: 'p1_obj2', title: 'Criar fórmulas para calcular totais (SOMA e subtração)' },
      { id: 'p1_obj3', title: 'Calcular receitas, despesas e saldo final automaticamente' },
      { id: 'p1_obj4', title: 'Aplicar formatação de moeda (R$) e estilos visuais' },
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
    description: 'Pequenos comércios perdem vendas ou compram produtos em excesso por não saberem exatamente o que têm em estoque.',
    objective: 'Criar um controle de produtos com quantidades, preços, entradas, saídas e alertas de estoque baixo.',
    icon: 'Boxes',
    accentColor: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30 hover:border-blue-500',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-blue-50',
    },
    onlyofficeTools: [
      {
        category: 'Planilhas',
        details: 'Tabelas padronizadas com código, produto, custo e preço de venda.',
      },
      {
        category: 'Fórmulas de Quantidade e Valor',
        details: 'Multiplicações automáticas de volume por preço unitário.',
      },
      {
        category: 'Formatação Condicional',
        details: 'Regras visuais para destacar automaticamente itens com estoque baixo.',
      },
      {
        category: 'Classificação e Filtros',
        details: 'Ordenação rápida por produtos mais estocados ou em falta.',
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
    description: 'Equipes de trabalho esquecem compromissos, atrasam entregas e têm dificuldade para dividir responsabilidades.',
    objective: 'Criar um sistema de acompanhamento de tarefas, responsáveis, prazos e andamento das atividades.',
    icon: 'CalendarCheck2',
    accentColor: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30 hover:border-amber-500',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      text: 'text-amber-600',
      gradient: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50',
    },
    onlyofficeTools: [
      {
        category: 'Planilhas (Cronograma)',
        details: 'Criação de matriz de atividades, responsáveis e prazos de entrega.',
      },
      {
        category: 'Listas Suspensas (Status)',
        details: 'Validação de dados para selecionar status (Pendente, Em Progresso, Entregue).',
      },
      {
        category: 'Formatação Condicional',
        details: 'Destaque de tarefas atrasadas ou que vencem no dia.',
      },
      {
        category: 'Editor de Documentos',
        details: 'Redação de manuais, atas de reunião e instruções de trabalho.',
      },
      {
        category: 'Editor de Apresentações',
        details: 'Slides executivos para demonstrar o progresso das entregas.',
      },
    ],
    learningObjectives: [
      { id: 'p3_obj1', title: 'Construir um cronograma com atividades, prazos e responsáveis' },
      { id: 'p3_obj2', title: 'Inserir listas suspensas para status das tarefas (A Fazer / Feito)' },
      { id: 'p3_obj3', title: 'Aplicar formatação condicional para avisos visuais de prazos' },
      { id: 'p3_obj4', title: 'Elaborar instruções de trabalho claras no Editor de Documentos' },
      { id: 'p3_obj5', title: 'Montar apresentação de resultados no Editor de Apresentações' },
      { id: 'p3_obj6', title: 'Avaliar e revisar periodicamente a divisão de funções do grupo' },
    ],
  },
  {
    id: 4,
    number: 4,
    title: 'Divulgação ineficiente de pequenos negócios',
    shortTitle: 'Divulgação & Marketing',
    tag: 'Comunicação & Vendas',
    description: 'Pequenos empreendedores têm dificuldade para divulgar seus produtos e serviços de maneira organizada e profissional.',
    objective: 'Desenvolver materiais de divulgação e um planejamento de publicações para apresentar a empresa ao público.',
    icon: 'Megaphone',
    accentColor: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30 hover:border-purple-500',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-600',
      lightBg: 'bg-purple-50',
    },
    onlyofficeTools: [
      {
        category: 'Editor de Documentos',
        details: 'Redação de briefings publicitários, cartas de apresentação e releases.',
      },
      {
        category: 'Editor de Apresentações',
        details: 'Criação de pitches visuais, portfólio de produtos e serviços.',
      },
      {
        category: 'Editor de Planilhas',
        details: 'Calendário de postagens, canais de divulgação e metas de público.',
      },
      {
        category: 'Elementos Visuais',
        details: 'Inserção e alinhamento de imagens, logomarcas, formas e tipografia.',
      },
      {
        category: 'Exportação em PDF',
        details: 'Geração de catálogos e folhetos digitais prontos para compartilhamento.',
      },
    ],
    learningObjectives: [
      { id: 'p4_obj1', title: 'Redigir proposta de valor e textos publicitários no Documentos' },
      { id: 'p4_obj2', title: 'Construir calendário de postagens e datas no Editor de Planilhas' },
      { id: 'p4_obj3', title: 'Desenvolver uma apresentação comercial atrativa da empresa' },
      { id: 'p4_obj4', title: 'Aplicar imagens, tabelas e identidade visual consistente' },
      { id: 'p4_obj5', title: 'Exportar materiais promocionais em formato PDF profissional' },
      { id: 'p4_obj6', title: 'Apresentar a estratégia de divulgação e público-alvo para a turma' },
    ],
  },
  {
    id: 5,
    number: 5,
    title: 'Falta de organização de informações e cadastros',
    shortTitle: 'Cadastros e Informações',
    tag: 'Dados & Atendimento ao Cliente',
    description: 'Pequenos negócios, associações e projetos comunitários têm dificuldade para organizar informações sobre clientes, produtos, participantes ou atendimentos.',
    objective: 'Desenvolver uma base organizada de registros, com campos padronizados, pesquisa e acompanhamento das informações.',
    icon: 'Database',
    accentColor: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30 hover:border-indigo-500',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      text: 'text-indigo-600',
      gradient: 'from-indigo-500 to-violet-600',
      lightBg: 'bg-indigo-50',
    },
    onlyofficeTools: [
      {
        category: 'Planilhas',
        details: 'Estruturação de banco de registros com colunas normatizadas.',
      },
      {
        category: 'Classificação e Filtros',
        details: 'Busca rápida de registros por nome, cidade, status ou tipo de atendimento.',
      },
      {
        category: 'Validação de Dados',
        details: 'Restrição de campos para evitar erros (datas, números de telefone, opções).',
      },
      {
        category: 'Fórmulas e Indicadores',
        details: 'Contagem automática (CONT.SE) e métricas consolidadas.',
      },
      {
        category: 'Editor de Documentos',
        details: 'Criação de fichas cadastrais individuais e relatórios resumidos.',
      },
    ],
    learningObjectives: [
      { id: 'p5_obj1', title: 'Modelar colunas padronizadas para cadastro seguro de registros' },
      { id: 'p5_obj2', title: 'Configurar validação de dados e menus de seleção' },
      { id: 'p5_obj3', title: 'Aplicar filtros avançados e ordenação por múltiplos critérios' },
      { id: 'p5_obj4', title: 'Criar fórmulas estatísticas simples (ex: CONT.SE para totalizar clientes)' },
      { id: 'p5_obj5', title: 'Gerar fichas e relatórios formais no Editor de Documentos' },
      { id: 'p5_obj6', title: 'Realizar testes práticos de busca e consulta ágil aos dados' },
    ],
  },
];
