// ============================================================================
// CONTEÚDO PEDAGÓGICO ESTRUTURADO — AULAS DO FOUNDERS GRID
// Estrutura didática EdTech:
// A. O que você vai aprender?
// B. O que você precisa fazer?
// C. Como fazer? (Passo a passo com menu e simulação visual de planilha)
// D. Dica anti-erro
// E. Hora de praticar
// F. Confira seu resultado (Autoavaliação)
// G. Próxima etapa
// ============================================================================

export interface LessonStep {
  number: number;
  instruction: string;
  menuPath?: string[];
  detail: string;
}

export interface LessonData {
  id: string;
  title: string;
  category: string;
  scope: 'comum' | 'especifico';
  learningGoal: string; // A. O que você vai aprender?
  practicalTask: string; // B. O que você precisa fazer?
  steps: LessonStep[]; // C. Como fazer?
  mockup?: {
    title: string;
    formulaBar?: string;
    columns: string[];
    rows: Array<
      Array<{
        value: string;
        isHeader?: boolean;
        isFormula?: boolean;
        align?: 'left' | 'center' | 'right';
        highlight?: 'emerald' | 'rose' | 'amber' | 'blue' | 'selected';
      }>
    >;
    caption?: string;
  };
  tip: {
    title: string;
    content: string;
    type: 'tip' | 'warning' | 'success';
  }; // D. Dica anti-erro / de ouro
  practiceExercise: string; // E. Hora de praticar
  selfChecklist: string[]; // F. Confira seu resultado
  nextStepPreview: string; // G. Próxima etapa
}

export const LESSONS_MAP: Record<string, LessonData> = {
  // ==========================================================================
  // FUNDAMENTOS COMUNS (Aprendendo o básico com o professor)
  // ==========================================================================
  core_obj1: {
    id: 'core_obj1',
    title: 'Introdução ao ONLYOFFICE Desktop',
    category: 'Suíte ONLYOFFICE & Interface',
    scope: 'comum',
    learningGoal:
      'Conhecer a interface do aplicativo ONLYOFFICE Desktop, como navegar entre os menus principais e salvar a planilha da sua empresa no computador.',
    practicalTask:
      'Abrir o aplicativo ONLYOFFICE Desktop no computador, reconhecer as barras de ferramentas e salvar o arquivo de trabalho .xlsx.',
    steps: [
      {
        number: 1,
        instruction: 'Abra o aplicativo ONLYOFFICE Desktop no computador.',
        detail: 'Localize o ícone do ONLYOFFICE na Área de Trabalho ou no menu Iniciar do computador da escola ou no seu notebook.',
      },
      {
        number: 2,
        instruction: 'Localize a barra de menus superior.',
        menuPath: ['Arquivo', 'Página Inicial', 'Inserir', 'Layout', 'Fórmula', 'Dados'],
        detail: 'Essa barra agrupa todas as ações: na "Página Inicial" você formata textos e valores, e em "Fórmula" e "Dados" você faz cálculos e filtros.',
      },
      {
        number: 3,
        instruction: 'Aprenda a salvar o arquivo da sua empresa no computador.',
        detail: 'No ONLYOFFICE Desktop, use o menu Arquivo → Salvar como para salvar sua planilha com extensão .xlsx na pasta da sua empresa, ou use o atalho Ctrl + S.',
      },
    ],
    mockup: {
      title: 'Ambiente ONLYOFFICE Desktop — Barra Superior',
      columns: ['Arquivo', 'Página Inicial', 'Inserir', 'Fórmulas', 'Dados'],
      rows: [
        [
          { value: 'Salvar / Salvar como', isHeader: true, align: 'center' },
          { value: 'Fonte & Moeda R$', isHeader: true, align: 'center', highlight: 'selected' },
          { value: 'Gráficos', isHeader: true, align: 'center' },
          { value: 'Soma / Média', isHeader: true, align: 'center' },
          { value: 'Filtros A-Z', isHeader: true, align: 'center' },
        ],
      ],
      caption: 'A aba Página Inicial é a mais utilizada durante a estruturação da planilha da empresa.',
    },
    tip: {
      title: 'Dica de Ouro de Salvamento',
      content:
        'Sempre que for encerrar a aula, salve sua planilha com Ctrl + S na pasta da sua empresa no computador. Ao final de todas as aulas da Etapa 1, esse mesmo arquivo .xlsx será enviado na Central de Entregas.',
      type: 'tip',
    },
    practiceExercise:
      'Abra o aplicativo ONLYOFFICE Desktop, explore as abas da barra superior e teste salvar um novo arquivo .xlsx no computador.',
    selfChecklist: [
      'Consegui abrir o aplicativo ONLYOFFICE Desktop no computador.',
      'Identifiquei as abas Arquivo, Página Inicial e Dados.',
      'Localizei como salvar a planilha com formato .xlsx no computador.',
    ],
    nextStepPreview: 'Na próxima aula, você aprenderá a criar uma planilha do zero e entender o sistema de linhas, colunas e células.',
  },

  core_obj2: {
    id: 'core_obj2',
    title: 'Criando uma Planilha',
    category: 'Estrutura de Grade & Células',
    scope: 'comum',
    learningGoal:
      'Compreender como uma planilha funciona através de linhas numeradas, colunas com letras e células individuais (ex: A1, B4).',
    practicalTask:
      'Criar uma nova pasta de trabalho no ONLYOFFICE, renomear com o nome da sua empresa e navegar pelas coordenadas da grade.',
    steps: [
      {
        number: 1,
        instruction: 'Crie uma nova planilha.',
        menuPath: ['Arquivo', 'Novo', 'Planilha Eletrônica'],
        detail: 'Uma nova grade em branco será aberta com colunas identificadas por letras (A, B, C...) e linhas por números (1, 2, 3...).',
      },
      {
        number: 2,
        instruction: 'Renomeie o arquivo com o nome oficial da sua empresa.',
        menuPath: ['Arquivo', 'Renomear...'],
        detail: 'Adote o padrão: "[NomeDaEmpresa] - Controle.xlsx". Exemplo: "CoffeeShopp - Controle.xlsx".',
      },
      {
        number: 3,
        instruction: 'Pratique a localização por coordenadas.',
        detail: 'Clique na célula C4. Observe que a coluna C e a linha 4 ficam destacadas na cor verde.',
      },
    ],
    mockup: {
      title: 'CoffeeShopp - Controle.xlsx',
      formulaBar: 'Célula Ativa: B2',
      columns: ['A (Itens)', 'B (Setor)', 'C (Valor)'],
      rows: [
        [
          { value: 'Produto', isHeader: true },
          { value: 'Categoria', isHeader: true },
          { value: 'Preço', isHeader: true },
        ],
        [
          { value: 'Café Expresso', align: 'left' },
          { value: 'Bebidas', align: 'center', highlight: 'selected' },
          { value: 'R$ 7,50', align: 'right' },
        ],
      ],
      caption: 'A célula B2 está na interseção da Coluna B com a Linha 2.',
    },
    tip: {
      title: 'Evite o Erro: Nomes Genéricos',
      content:
        'Nunca deixe o arquivo salvo como "Pasta1" ou "Sem Título". Renomeie imediatamente com o nome do seu grupo para que o arquivo não se perca no computador da escola.',
      type: 'warning',
    },
    practiceExercise:
      'Crie a planilha da sua empresa fictícia, dê o nome correto e clique nas células A1, B3 e D5 para treinar a leitura das coordenadas.',
    selfChecklist: [
      'Criei uma nova pasta de trabalho em branco.',
      'O arquivo está renomeado com o nome da empresa fictícia.',
      'Compreendi que cada célula tem um endereço de Letra + Número (ex: A1).',
    ],
    nextStepPreview: 'Na próxima aula, você vai criar a Linha 1 de cabeçalho para organizar os dados da empresa de forma profissional.',
  },

  core_obj3: {
    id: 'core_obj3',
    title: 'Estruturação de Tabela',
    category: 'Cabeçalhos & Layout',
    scope: 'comum',
    learningGoal:
      'Aprender a estruturar tabelas claras, com cabeçalhos bem definidos e colunas na largura correta, para que ninguém confunda os dados.',
    practicalTask:
      'Criar os cabeçalhos na Linha 1 com fundo destacado, aplicar bordas e ajustar a largura das colunas para que nenhum texto fique cortado.',
    steps: [
      {
        number: 1,
        instruction: 'Defina os nomes das colunas na Linha 1.',
        detail: 'Digite na célula A1, B1, C1, etc. os títulos dos dados (ex: "Item", "Data", "Valor", "Status").',
      },
      {
        number: 2,
        instruction: 'Destaque visualmente a linha de cabeçalho.',
        menuPath: ['Página Inicial', 'Negrito (Ctrl+B)', 'Cor de Preenchimento'],
        detail: 'Aplique fonte em Negrito e um fundo suave (cinza claro ou azul marinho com texto branco).',
      },
      {
        number: 3,
        instruction: 'Ajuste a largura das colunas com duplo clique.',
        detail: 'Passe o mouse na linha divisória entre a letra A e B no topo. O cursor virará uma seta dupla (↔). Dê duplo clique para autoajustar.',
      },
    ],
    mockup: {
      title: 'Estrutura Profissional de Tabela',
      columns: ['A (Data)', 'B (Descrição do Item)', 'C (Categoria)', 'D (Valor Total)'],
      rows: [
        [
          { value: 'Data', isHeader: true, align: 'center' },
          { value: 'Descrição do Item', isHeader: true, align: 'left' },
          { value: 'Categoria', isHeader: true, align: 'center' },
          { value: 'Valor Total', isHeader: true, align: 'right' },
        ],
        [
          { value: '01/11/2026', align: 'center' },
          { value: 'Embalagens Ecológicas 500ml', align: 'left' },
          { value: 'Insumos', align: 'center' },
          { value: 'R$ 150,00', align: 'right' },
        ],
      ],
      caption: 'Cabeçalhos em negrito e colunas dimensionadas garantem que nenhuma informação fique oculta ou comprimida.',
    },
    tip: {
      title: 'Evite o Erro: Textos Cortados com "###"',
      content:
        'Se uma célula mostrar "###" em vez do número, não entre em pânico! Significa apenas que a coluna é estreita demais para o valor. Dê duplo clique na linha entre as colunas para alargar.',
      type: 'tip',
    },
    practiceExercise:
      'Na planilha da sua empresa, crie a Linha 1 com os cabeçalhos necessários para o seu negócio (ex: produtos, preços, quantidades) e ajuste a largura das colunas.',
    selfChecklist: [
      'A Linha 1 contém os cabeçalhos com nomes claros e objetivos.',
      'O cabeçalho está formatado em negrito e diferenciado dos dados.',
      'Nenhum texto ou valor está cortado por falta de espaço na coluna.',
    ],
    nextStepPreview: 'Na próxima aula, você aprenderá a dizer à planilha o que é Dinheiro (R$), o que é Data e o que é Texto simples.',
  },

  core_obj4: {
    id: 'core_obj4',
    title: 'Tipagem & Formatação',
    category: 'Formatação de Moeda, Texto e Datas',
    scope: 'comum',
    learningGoal:
      'Ensinar a planilha a reconhecer a diferença entre texto, número comum, dinheiro em Reais (R$) e datas, garantindo que os cálculos funcionem.',
    practicalTask:
      'Formatar a coluna financeira como Moeda (R$), datas no padrão DD/MM/AAAA e alinhar números à direita.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione a coluna que contém os valores em dinheiro.',
        detail: 'Clique na letra da coluna (ex: Coluna D) ou selecione o intervalo das células de valores (ex: D2:D20).',
      },
      {
        number: 2,
        instruction: 'Aplique o formato de Moeda (R$).',
        menuPath: ['Página Inicial', 'Formato de Número', 'Moeda (R$)'],
        detail: 'O ONLYOFFICE adicionará automaticamente o símbolo "R$" e duas casas decimais (ex: 25 vira R$ 25,00).',
      },
      {
        number: 3,
        instruction: 'Padronize o alinhamento das células.',
        detail: 'Regra de ouro: Textos sempre alinhados à esquerda; Datas centralizadas; Valores numéricos e dinheiro sempre alinhados à direita.',
      },
    ],
    mockup: {
      title: 'Padronização de Tipagem',
      columns: ['A (Texto)', 'B (Data)', 'C (Número)', 'D (Moeda R$)'],
      rows: [
        [
          { value: 'Item', isHeader: true, align: 'left' },
          { value: 'Data', isHeader: true, align: 'center' },
          { value: 'Qtd.', isHeader: true, align: 'right' },
          { value: 'Preço Unitário', isHeader: true, align: 'right' },
        ],
        [
          { value: 'Café Grão Especial', align: 'left' },
          { value: '03/11/2026', align: 'center' },
          { value: '12', align: 'right' },
          { value: 'R$ 38,90', align: 'right', highlight: 'emerald' },
        ],
      ],
      caption: 'Valores em R$ formatados via sistema não perdem a capacidade de serem somados matematicamente.',
    },
    tip: {
      title: 'Evite o Erro Clássico: Não digite "R$" com o teclado!',
      content:
        'Se você digitar "R$ 50,00" manualmente no teclado, a planilha entenderá que é um TEXTO e não conseguirá somar depois! Digite apenas 50 e clique no botão de Moeda.',
      type: 'warning',
    },
    practiceExercise:
      'Selecione todos os preços da sua planilha e aplique a formatação "Moeda (R$)". Em seguida, formate as datas como "Data Curta".',
    selfChecklist: [
      'Valores financeiros têm o símbolo R$ aplicado pelo menu (e não digitados no teclado).',
      'Datas estão no formato brasileiro DD/MM/AAAA.',
      'Valores numéricos e preços estão alinhados à direita.',
    ],
    nextStepPreview: 'Agora que os dados estão padronizados, na próxima aula você vai aprender a fazer contas automáticas com SOMA e MÉDIA!',
  },

  core_obj5: {
    id: 'core_obj5',
    title: 'Fórmulas Matemáticas Fundamentais',
    category: 'Cálculos Automáticos (SOMA, MÉDIA, Subtração)',
    scope: 'comum',
    learningGoal:
      'Fazer a planilha calcular resultados sozinha! Toda vez que um preço ou quantidade mudar, a planilha atualiza o total instantaneamente.',
    practicalTask:
      'Criar uma linha de "Total Geral" usando a fórmula =SOMA(...) e calcular a média de valores com =MÉDIA(...).',
    steps: [
      {
        number: 1,
        instruction: 'Toda fórmula começa OBRIGATORIAMENTE com o sinal de igual (=).',
        detail: 'Clique na célula vazia onde quer o resultado (ex: D10) e digite = no teclado. Isso avisa à planilha que uma conta começará.',
      },
      {
        number: 2,
        instruction: 'Para somar uma coluna inteira, use =SOMA(início:fim).',
        detail: 'Exemplo: =SOMA(D2:D9). Dica prática: você pode digitar =SOMA( e arrastar com o mouse sobre os valores que quer somar.',
      },
      {
        number: 3,
        instruction: 'Pressione Enter para confirmar o cálculo.',
        detail: 'A célula exibirá o total calculado. Para conferir a fórmula por trás, basta clicar na célula e olhar a barra de fórmulas no topo.',
      },
    ],
    mockup: {
      title: 'Cálculo de SOMA em Tempo Real',
      formulaBar: '=SOMA(C2:C4)',
      columns: ['A (Descrição)', 'B (Qtd)', 'C (Subtotal R$)'],
      rows: [
        [
          { value: 'Item', isHeader: true },
          { value: 'Qtd', isHeader: true, align: 'right' },
          { value: 'Valor (R$)', isHeader: true, align: 'right' },
        ],
        [
          { value: 'Pão de Queijo', align: 'left' },
          { value: '20', align: 'right' },
          { value: 'R$ 80,00', align: 'right' },
        ],
        [
          { value: 'Café Coado', align: 'left' },
          { value: '15', align: 'right' },
          { value: 'R$ 75,00', align: 'right' },
        ],
        [
          { value: 'Bolo de Cenoura', align: 'left' },
          { value: '8', align: 'right' },
          { value: 'R$ 64,00', align: 'right' },
        ],
        [
          { value: 'TOTAL GERAL', isHeader: true, highlight: 'selected' },
          { value: '43', isHeader: true, align: 'right' },
          { value: 'R$ 219,00', isHeader: true, align: 'right', highlight: 'emerald' },
        ],
      ],
      caption: 'A célula C5 contém =SOMA(C2:C4). Se qualquer preço mudar nas linhas de cima, o R$ 219,00 atualiza sozinho!',
    },
    tip: {
      title: 'Macetes de Fórmulas',
      content:
        'SOMA: =SOMA(D2:D10) | MÉDIA: =MÉDIA(D2:D10) | SUBTRAÇÃO: =B2-C2 (use o sinal de menos direto). Nunca esqueça de fechar os parênteses!',
      type: 'tip',
    },
    practiceExercise:
      'Crie a linha "Total" ao final da sua tabela. Digite =SOMA( e selecione com o mouse os valores da sua coluna de dinheiro. Aperte Enter e teste mudar um número!',
    selfChecklist: [
      'Iniciei a fórmula com o sinal de igual (=).',
      'Usei a fórmula =SOMA(...) para obter o total geral.',
      'Testei alterar um valor na tabela e vi o total recalcular automaticamente.',
    ],
    nextStepPreview: 'Na próxima aula, você aprenderá a filtrar e ordenar registros em ordem alfabética ou do maior para o menor.',
  },

  core_obj6: {
    id: 'core_obj6',
    title: 'Filtros & Ordenação',
    category: 'Organização de Registros & Pesquisa Rápida',
    scope: 'comum',
    learningGoal:
      'Aprender a colocar funis de filtro no cabeçalho para encontrar informações em segundos e ordenar registros do mais caro ao mais barato com segurança.',
    practicalTask:
      'Ativar os filtros no cabeçalho da tabela e realizar uma ordenação segura sem desalinhar as linhas.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione a linha de cabeçalho (Linha 1).',
        detail: 'Clique e arraste da célula A1 até a última coluna da sua tabela.',
      },
      {
        number: 2,
        instruction: 'Ative os Filtros.',
        menuPath: ['Dados', 'Filtro (ícone de funil)'],
        detail: 'Pequenas setas para baixo (▼) aparecerão no canto direito de cada célula do cabeçalho.',
      },
      {
        number: 3,
        instruction: 'Ordene ou filtre os registros.',
        detail: 'Clique na setinha da coluna de Valor e escolha "Classificar do Maior para o Menor". Toda a linha se moverá mantendo a integridade.',
      },
    ],
    mockup: {
      title: 'Filtros Ativados no ONLYOFFICE',
      columns: ['Produto ▼', 'Categoria ▼', 'Preço Unitário (Maior p/ Menor) ▼'],
      rows: [
        [
          { value: 'Produto ▼', isHeader: true },
          { value: 'Categoria ▼', isHeader: true, align: 'center' },
          { value: 'Preço ▼', isHeader: true, align: 'right', highlight: 'selected' },
        ],
        [
          { value: 'Café Grão Especial 1kg', align: 'left' },
          { value: 'Insumos', align: 'center' },
          { value: 'R$ 78,00', align: 'right', highlight: 'emerald' },
        ],
        [
          { value: 'Bolo Caseiro Inteiro', align: 'left' },
          { value: 'Doces', align: 'center' },
          { value: 'R$ 45,00', align: 'right' },
        ],
        [
          { value: 'Café Expresso Simples', align: 'left' },
          { value: 'Bebidas', align: 'center' },
          { value: 'R$ 7,50', align: 'right' },
        ],
      ],
      caption: 'A tabela foi classificada automaticamente pelo Preço em ordem decrescente.',
    },
    tip: {
      title: 'Cuidado ao Ordenar: Selecione a Tabela Completa',
      content:
        'Nunca selecione apenas uma coluna antes de clicar em ordenar, pois você pode misturar os preços com os produtos errados! Use sempre o funil de filtro na Linha 1 para que a linha inteira seja ordenada.',
      type: 'warning',
    },
    practiceExercise:
      'Ative os filtros no cabeçalho da sua planilha e filtre para exibir apenas uma categoria específica de produtos ou custos.',
    selfChecklist: [
      'As setinhas de filtro (▼) estão visíveis na Linha 1 de cabeçalho.',
      'Consegui ordenar a tabela do maior para o menor valor.',
      'Os dados permaneceram alinhados com suas respectivas linhas.',
    ],
    nextStepPreview: 'Parabéns! Você concluiu os 6 Fundamentos Básicos com o professor. Agora é hora das metas específicas da sua Missão!',
  },

  // ==========================================================================
  // MISSÃO 1: ORGANIZAÇÃO FINANCEIRA
  // ==========================================================================
  p1_spec1: {
    id: 'p1_spec1',
    title: 'Cálculo de Saldo Automático da Empresa',
    category: 'Missão 1: Finanças & Fluxo de Caixa',
    scope: 'especifico',
    learningGoal:
      'Calcular o Saldo Líquido da empresa (Receitas menos Despesas) de forma contínua e automática a cada transação.',
    practicalTask:
      'Criar uma coluna "Saldo" onde cada linha calcula: Saldo Anterior + Entrada - Saída.',
    steps: [
      {
        number: 1,
        instruction: 'Defina a estrutura de colunas do fluxo de caixa.',
        detail: 'Crie colunas: Data, Descrição, Entradas (Receitas), Saídas (Despesas) e Saldo.',
      },
      {
        number: 2,
        instruction: 'Insira a fórmula de saldo na linha 2.',
        detail: 'Na primeira linha de dados (ex: E2), digite: =C2-D2 (Entrada menos Saída).',
      },
      {
        number: 3,
        instruction: 'Na linha 3 em diante, acumule o saldo anterior.',
        detail: 'Na célula E3, digite: =E2+C3-D3. Em seguida, clique no quadradinho verde no canto da célula e arraste para baixo.',
      },
    ],
    mockup: {
      title: 'Fluxo de Caixa — Saldo Acumulado',
      formulaBar: '=E2+C3-D3',
      columns: ['Data', 'Descrição', 'Entradas (+)', 'Saídas (-)', 'Saldo Final'],
      rows: [
        [
          { value: 'Data', isHeader: true, align: 'center' },
          { value: 'Descrição', isHeader: true },
          { value: 'Entradas (+)', isHeader: true, align: 'right' },
          { value: 'Saídas (-)', isHeader: true, align: 'right' },
          { value: 'Saldo Acumulado', isHeader: true, align: 'right' },
        ],
        [
          { value: '01/11', align: 'center' },
          { value: 'Capital Inicial', align: 'left' },
          { value: 'R$ 500,00', align: 'right' },
          { value: 'R$ 0,00', align: 'right' },
          { value: 'R$ 500,00', align: 'right', highlight: 'emerald' },
        ],
        [
          { value: '02/11', align: 'center' },
          { value: 'Compra de Insumos', align: 'left' },
          { value: 'R$ 0,00', align: 'right' },
          { value: 'R$ 120,00', align: 'right' },
          { value: 'R$ 380,00', align: 'right', highlight: 'selected' },
        ],
      ],
      caption: 'A célula E3 calculou: R$ 500 (saldo anterior) + R$ 0 (entrada) - R$ 120 (saída) = R$ 380.',
    },
    tip: {
      title: 'Dica Financeira',
      content:
        'Sempre deixe uma linha ou célula destacada no topo ou no final com o "Saldo Atual em Caixa" para o gestor da empresa bater o olho rapidamente.',
      type: 'tip',
    },
    practiceExercise:
      'Cadastre pelo menos 5 movimentações reais ou simuladas da sua empresa e monte a fórmula de saldo acumulado.',
    selfChecklist: [
      'Existe uma coluna para Entradas e outra para Saídas.',
      'A coluna Saldo reflete a soma das entradas menos as saídas.',
      'A fórmula foi arrastada com sucesso para as demais linhas.',
    ],
    nextStepPreview: 'Na próxima etapa, você vai colocar cores automáticas (verde para lucro e vermelho para prejuízo)!',
  },

  p1_spec2: {
    id: 'p1_spec2',
    title: 'Formatação Condicional de Saldo',
    category: 'Missão 1: Finanças & Fluxo de Caixa',
    scope: 'especifico',
    learningGoal:
      'Fazer a planilha pintar as células de verde quando a empresa tiver lucro (> 0) e de vermelho quando o saldo estiver negativo (< 0).',
    practicalTask:
      'Aplicar uma regra de Formatação Condicional na coluna de Saldo.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione as células da coluna de Saldo.',
        detail: 'Clique na célula E2 e arraste até o fim da tabela.',
      },
      {
        number: 2,
        instruction: 'Acesse a Formatação Condicional.',
        menuPath: ['Página Inicial', 'Formatação Condicional', 'Regras de Realce das Células'],
        detail: 'Escolha "Maior do que..." e digite 0. Escolha a cor verde claro com texto verde escuro.',
      },
      {
        number: 3,
        instruction: 'Crie a segunda regra para saldo negativo.',
        menuPath: ['Página Inicial', 'Formatação Condicional', 'Menor do que...'],
        detail: 'Digite 0 e selecione o preenchimento vermelho claro.',
      },
    ],
    mockup: {
      title: 'Alertas Visuais de Saldo',
      columns: ['Mês', 'Receita Total', 'Despesa Total', 'Resultado'],
      rows: [
        [
          { value: 'Mês', isHeader: true, align: 'center' },
          { value: 'Receitas', isHeader: true, align: 'right' },
          { value: 'Despesas', isHeader: true, align: 'right' },
          { value: 'Resultado Líquido', isHeader: true, align: 'right' },
        ],
        [
          { value: 'Novembro', align: 'center' },
          { value: 'R$ 1.450,00', align: 'right' },
          { value: 'R$ 980,00', align: 'right' },
          { value: 'R$ 470,00 (LUCRO)', align: 'right', highlight: 'emerald' },
        ],
        [
          { value: 'Dezembro (Simulado)', align: 'center' },
          { value: 'R$ 600,00', align: 'right' },
          { value: 'R$ 850,00', align: 'right' },
          { value: '-R$ 250,00 (PREJUÍZO)', align: 'right', highlight: 'rose' },
        ],
      ],
      caption: 'A formatação condicional reage na hora aos números: positivo fica verde, negativo fica vermelho!',
    },
    tip: {
      title: 'Boas Práticas de Cores',
      content:
        'Evite tons de vermelho e verde muito fortes ou fluorescentes. Tons pastéis (suaves) deixam a planilha profissional e fácil de ler.',
      type: 'tip',
    },
    practiceExercise:
      'Aplique as duas regras na coluna de Saldo e teste digitar uma saída bem alta para ver a célula mudar para vermelho instantaneamente.',
    selfChecklist: [
      'Valores positivos ficam destacados em verde.',
      'Valores negativos ficam destacados em vermelho.',
      'A cor muda sozinha ao alterar os valores da linha.',
    ],
    nextStepPreview: 'Na próxima etapa, você vai transformar esses dados em um gráfico visual para apresentar aos sócios da empresa!',
  },

  p1_spec3: {
    id: 'p1_spec3',
    title: 'Gráficos Comparativos de Despesas e Receitas',
    category: 'Missão 1: Finanças & Fluxo de Caixa',
    scope: 'especifico',
    learningGoal:
      'Transformar números em gráficos fáceis de entender, permitindo que a equipe visualize em que o dinheiro está sendo gasto.',
    practicalTask:
      'Inserir um gráfico de Colunas ou Pizza comparando as maiores categorias de despesas da empresa.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione os dados que irão compor o gráfico.',
        detail: 'Selecione as colunas de "Categoria" e "Valor Total" (ex: B2:B7 e C2:C7).',
      },
      {
        number: 2,
        instruction: 'Insira o gráfico recomendado.',
        menuPath: ['Inserir', 'Gráfico', 'Coluna 2D ou Pizza'],
        detail: 'Para comparar receitas vs despesas, o gráfico de Colunas é o ideal. Para ver a divisão de gastos, use o de Pizza.',
      },
      {
        number: 3,
        instruction: 'Adicione um título claro ao gráfico.',
        detail: 'Clique duas vezes no título do gráfico e escreva algo direto, como "Distribuição de Despesas de Novembro".',
      },
    ],
    mockup: {
      title: 'Gráfico Integrado na Planilha',
      columns: ['Categoria de Custo', 'Total Gasto (R$)', 'Participação no Orçamento'],
      rows: [
        [
          { value: 'Categoria', isHeader: true },
          { value: 'Total Gasto', isHeader: true, align: 'right' },
          { value: '% do Total', isHeader: true, align: 'right' },
        ],
        [
          { value: 'Matéria-prima & Insumos', align: 'left' },
          { value: 'R$ 620,00', align: 'right' },
          { value: '52%', align: 'right', highlight: 'blue' },
        ],
        [
          { value: 'Embalagens & Logística', align: 'left' },
          { value: 'R$ 280,00', align: 'right' },
          { value: '24%', align: 'right', highlight: 'blue' },
        ],
        [
          { value: 'Marketing & Divulgação', align: 'left' },
          { value: 'R$ 150,00', align: 'right' },
          { value: '13%', align: 'right', highlight: 'blue' },
        ],
      ],
      caption: 'Os dados da tabela alimentam o gráfico automaticamente.',
    },
    tip: {
      title: 'Dica Visual de Apresentação',
      content:
        'Não cubra a tabela com o gráfico. Posicione o gráfico ao lado ou logo abaixo dos dados para que a página fique limpa e organizada.',
      type: 'tip',
    },
    practiceExercise:
      'Gere um gráfico de colunas comparando suas despesas e ajuste o título e as cores para combinar com a identidade visual da sua empresa.',
    selfChecklist: [
      'O gráfico foi gerado a partir de dados da planilha.',
      'Possui um título informativo e fácil de compreender.',
      'Está posicionado de forma harmônica na pasta de trabalho.',
    ],
    nextStepPreview: 'Excelente! Sua empresa agora possui um controle financeiro completo e profissional!',
  },

  // ==========================================================================
  // MISSÃO 2: CONTROLE DE ESTOQUE
  // ==========================================================================
  p2_spec1: {
    id: 'p2_spec1',
    title: 'Cálculo de Estoque Atual e Valor Investido',
    category: 'Missão 2: Controle de Estoque',
    scope: 'especifico',
    learningGoal:
      'Calcular automaticamente quanto produto a empresa ainda tem nas prateleiras e quanto dinheiro está parado em mercadorias.',
    practicalTask:
      'Criar a fórmula de Estoque Atual: =Entradas - Saídas, e de Valor Total: =EstoqueAtual * CustoUnitário.',
    steps: [
      {
        number: 1,
        instruction: 'Estruture as colunas do inventário.',
        detail: 'Colunas essenciais: Código, Produto, Qtd Inicial, Entradas, Saídas, Estoque Atual e Custo Unitário.',
      },
      {
        number: 2,
        instruction: 'Calcule o Estoque Atual.',
        detail: 'Na coluna de Estoque Atual (ex: F2), digite: =C2+D2-E2 (Inicial + Entradas - Saídas).',
      },
      {
        number: 3,
        instruction: 'Calcule o Valor Total Investido.',
        detail: 'Na coluna de Valor Total (ex: H2), digite: =F2*G2 (Estoque Atual vezes Custo Unitário).',
      },
    ],
    mockup: {
      title: 'Inventário e Valor em Estoque',
      formulaBar: '=D2-E2',
      columns: ['Produto', 'Entradas', 'Saídas', 'Estoque Atual', 'Custo Unit.', 'Valor Total'],
      rows: [
        [
          { value: 'Produto', isHeader: true },
          { value: 'Entradas', isHeader: true, align: 'right' },
          { value: 'Saídas', isHeader: true, align: 'right' },
          { value: 'Estoque Atual', isHeader: true, align: 'right' },
          { value: 'Custo Unit.', isHeader: true, align: 'right' },
          { value: 'Valor Total', isHeader: true, align: 'right' },
        ],
        [
          { value: 'Capa Celular Silicone', align: 'left' },
          { value: '50', align: 'right' },
          { value: '38', align: 'right' },
          { value: '12', align: 'right', highlight: 'selected' },
          { value: 'R$ 15,00', align: 'right' },
          { value: 'R$ 180,00', align: 'right', highlight: 'emerald' },
        ],
      ],
      caption: 'Estoque Atual: 50 - 38 = 12 unidades. Valor total: 12 × R$ 15 = R$ 180,00.',
    },
    tip: {
      title: 'Símbolo de Multiplicação',
      content:
        'Lembre-se: no teclado do computador e nas planilhas, a multiplicação é representada pelo asterisco (*), e não pela letra "x"!',
      type: 'tip',
    },
    practiceExercise:
      'Cadastre os produtos da sua empresa e calcule o estoque disponível e o total em Reais investido no estoque.',
    selfChecklist: [
      'A coluna Estoque Atual desconta as saídas das entradas.',
      'A coluna Valor Total multiplica a quantidade pelo custo unitário (*).',
      'Os totais atualizam automaticamente se houver novas vendas.',
    ],
    nextStepPreview: 'Na próxima etapa, vamos criar um alerta visual que avisa quando o estoque estiver acabando!',
  },

  p2_spec2: {
    id: 'p2_spec2',
    title: 'Alerta Automático de Estoque Mínimo',
    category: 'Missão 2: Controle de Estoque',
    scope: 'especifico',
    learningGoal:
      'Configurar a planilha para avisar com alerta vermelho quando a quantidade de um produto cair abaixo da margem de segurança.',
    practicalTask:
      'Criar uma coluna "Estoque Mínimo" e usar formatação condicional para sinalizar os itens que precisam de compra urgente.',
    steps: [
      {
        number: 1,
        instruction: 'Defina a quantidade mínima de segurança.',
        detail: 'Crie uma coluna "Estoque Mínimo" com a quantidade que nunca deve faltar (ex: 5 unidades).',
      },
      {
        number: 2,
        instruction: 'Aplique a regra condicional.',
        menuPath: ['Página Inicial', 'Formatação Condicional', 'Nova Regra'],
        detail: 'Regra: Se o Estoque Atual for MENOR OU IGUAL ao Estoque Mínimo, preencher a célula de vermelho.',
      },
      {
        number: 3,
        instruction: 'Teste o gatilho.',
        detail: 'Altere as saídas de um produto para que ele fique abaixo do mínimo e veja o alerta acender na hora!',
      },
    ],
    mockup: {
      title: 'Alerta Visual de Reposição',
      columns: ['Item', 'Estoque Atual', 'Estoque Mínimo', 'Status de Compra'],
      rows: [
        [
          { value: 'Item', isHeader: true },
          { value: 'Estoque Atual', isHeader: true, align: 'right' },
          { value: 'Estoque Mínimo', isHeader: true, align: 'right' },
          { value: 'Status', isHeader: true, align: 'center' },
        ],
        [
          { value: 'Película de Vidro 3D', align: 'left' },
          { value: '3', align: 'right', highlight: 'rose' },
          { value: '10', align: 'right' },
          { value: 'REPOR URGENTE', align: 'center', highlight: 'rose' },
        ],
        [
          { value: 'Fone Bluetooth Pro', align: 'left' },
          { value: '18', align: 'right', highlight: 'emerald' },
          { value: '5', align: 'right' },
          { value: 'Estoque Regular', align: 'center', highlight: 'emerald' },
        ],
      ],
      caption: 'A Película de Vidro tem apenas 3 unidades (mínimo era 10), acionando o alerta vermelho.',
    },
    tip: {
      title: 'Evite a Falta de Produtos',
      content:
        'Nas empresas reais, o estoque mínimo é o tempo que o fornecedor demora para entregar um novo lote. Ele impede que a empresa perca vendas.',
      type: 'tip',
    },
    practiceExercise:
      'Estipule um estoque mínimo para cada item da sua empresa fictícia e aplique a formatação condicional de alerta de reposição.',
    selfChecklist: [
      'Defini uma quantidade de estoque mínimo para os produtos.',
      'Os itens com estoque crítico ficam destacados em vermelho.',
      'Os itens com estoque seguro permanecem normais ou em verde.',
    ],
    nextStepPreview: 'Na próxima etapa, vamos criar gráficos de movimentação para identificar os produtos campeões de venda!',
  },

  p2_spec3: {
    id: 'p2_spec3',
    title: 'Gráfico de Giro de Produtos e Vendas',
    category: 'Missão 2: Controle de Estoque',
    scope: 'especifico',
    learningGoal:
      'Gerar um gráfico de barras para que o gestor da empresa saiba quais produtos têm mais saída e quais estão parados no depósito.',
    practicalTask:
      'Inserir um gráfico de barras comparando a quantidade de saídas de cada produto.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione a coluna de Produtos e a de Saídas.',
        detail: 'Segure a tecla Ctrl para selecionar colunas que não estão coladas uma na outra.',
      },
      {
        number: 2,
        instruction: 'Insira o Gráfico de Barras Horizontais.',
        menuPath: ['Inserir', 'Gráfico', 'Barra 2D'],
        detail: 'O gráfico de barras horizontais é excelente para nomes longos de produtos.',
      },
      {
        number: 3,
        instruction: 'Ordene a tabela pelas saídas para o gráfico ficar bonito.',
        detail: 'Ordene do maior para o menor para que o produto mais vendido fique no topo do gráfico.',
      },
    ],
    mockup: {
      title: 'Ranking de Giro de Produtos',
      columns: ['Produto', 'Unidades Vendidas', 'Classificação'],
      rows: [
        [
          { value: 'Produto', isHeader: true },
          { value: 'Unidades Vendidas', isHeader: true, align: 'right' },
          { value: 'Desempenho', isHeader: true, align: 'center' },
        ],
        [
          { value: 'Carregador Turbo 20W', align: 'left' },
          { value: '84 un.', align: 'right', highlight: 'emerald' },
          { value: 'Mais Vendido ⭐', align: 'center' },
        ],
        [
          { value: 'Cabo Tipo-C Reforçado', align: 'left' },
          { value: '62 un.', align: 'right', highlight: 'blue' },
          { value: 'Alta Saída', align: 'center' },
        ],
        [
          { value: 'Suporte Veicular Magnético', align: 'left' },
          { value: '11 un.', align: 'right', highlight: 'amber' },
          { value: 'Baixa Saída', align: 'center' },
        ],
      ],
      caption: 'Identificar os produtos líderes ajuda a empresa a comprar mais do que vende rápido e negociar descontos.',
    },
    tip: {
      title: 'Tomada de Decisão Empresarial',
      content:
        'Produtos com baixa saída devem receber promoções para liberar dinheiro parado no estoque. Use essa conclusão no relatório do seu grupo!',
      type: 'tip',
    },
    practiceExercise:
      'Crie o gráfico de saídas dos produtos da sua empresa e posicione-o em uma área limpa da planilha.',
    selfChecklist: [
      'O gráfico apresenta claramente o nome dos produtos e a quantidade vendida.',
      'Os títulos dos eixos estão legíveis.',
      'Consigo identificar visualmente qual é o produto campeão da minha empresa.',
    ],
    nextStepPreview: 'Excelente! O controle operacional de mercadorias da sua empresa está pronto e profissional!',
  },

  // ==========================================================================
  // MISSÃO 3: TAREFAS E PRAZOS
  // ==========================================================================
  p3_spec1: {
    id: 'p3_spec1',
    title: 'Lista Suspensa com Validação de Dados',
    category: 'Missão 3: Gestão de Tarefas & Prazos',
    scope: 'especifico',
    learningGoal:
      'Criar menus suspensos para que qualquer membro da equipe selecione o status da tarefa ("Pendente", "Em Andamento", "Concluído") sem erros de digitação.',
    practicalTask:
      'Configurar Validação de Dados do tipo Lista na coluna de Status.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione as células da coluna de Status.',
        detail: 'Exemplo: selecione o intervalo de D2 até D20.',
      },
      {
        number: 2,
        instruction: 'Abra a ferramenta de Validação de Dados.',
        menuPath: ['Dados', 'Validação de Dados'],
        detail: 'Na janela que abrir, na opção "Permitir", mude de "Qualquer valor" para "Lista".',
      },
      {
        number: 3,
        instruction: 'Digite as opções permitidas separadas por vírgula.',
        detail: 'No campo Origem, digite: Pendente, Em Andamento, Concluído. Clique em OK.',
      },
    ],
    mockup: {
      title: 'Menu Suspenso de Status',
      columns: ['Tarefa da Equipe', 'Responsável', 'Data Limite', 'Status ▼'],
      rows: [
        [
          { value: 'Tarefa', isHeader: true },
          { value: 'Responsável', isHeader: true, align: 'center' },
          { value: 'Prazo', isHeader: true, align: 'center' },
          { value: 'Status ▼', isHeader: true, align: 'center', highlight: 'selected' },
        ],
        [
          { value: 'Criar Identidade Visual', align: 'left' },
          { value: 'Lara', align: 'center' },
          { value: '05/11', align: 'center' },
          { value: 'Concluído ✓', align: 'center', highlight: 'emerald' },
        ],
        [
          { value: 'Pesquisar Fornecedores', align: 'left' },
          { value: 'Larissa', align: 'center' },
          { value: '10/11', align: 'center' },
          { value: 'Em Andamento ⏳', align: 'center', highlight: 'blue' },
        ],
      ],
      caption: 'Ao clicar na célula, uma setinha aparece permitindo escolher o status sem precisar digitar.',
    },
    tip: {
      title: 'Evite Erros de Escrita',
      content:
        'A validação de dados impede que um aluno escreva "concluido", outro "Concluído" e outro "Feito". A padronização é essencial para filtros e relatórios futuros.',
      type: 'tip',
    },
    practiceExercise:
      'Crie a lista de tarefas da sua empresa fictícia e adicione o menu suspenso de status em todas as linhas.',
    selfChecklist: [
      'As células exibem uma setinha para selecionar o status.',
      'A lista contém as opções padronizadas da equipe.',
      'A planilha rejeita se alguém tentar digitar algo fora da lista.',
    ],
    nextStepPreview: 'Na próxima etapa, vamos fazer tarefas atrasadas piscarem em vermelho na planilha!',
  },

  p3_spec2: {
    id: 'p3_spec2',
    title: 'Alerta Visual para Prazos e Tarefas Atrasadas',
    category: 'Missão 3: Gestão de Tarefas & Prazos',
    scope: 'especifico',
    learningGoal:
      'Configurar a planilha para comparar a data da tarefa com a data de hoje e destacar automaticamente em vermelho as atividades atrasadas.',
    practicalTask:
      'Usar a função =HOJE() combinada com formatação condicional para sinalizar atrasos.',
    steps: [
      {
        number: 1,
        instruction: 'Selecione as datas de entrega da tabela.',
        detail: 'Selecione o intervalo da coluna de Prazo (ex: C2:C15).',
      },
      {
        number: 2,
        instruction: 'Crie uma regra de formatação para datas passadas.',
        menuPath: ['Página Inicial', 'Formatação Condicional', 'Regras de Realce', 'Menor do que...'],
        detail: 'No campo de valor, digite: =HOJE(). Escolha o formato vermelho claro.',
      },
      {
        number: 3,
        instruction: 'A função =HOJE() é dinâmica.',
        detail: 'A planilha sempre consultará o relógio do computador. Assim, quando amanhã chegar, tarefas que venceram hoje já ficarão vermelhas sozinhas!',
      },
    ],
    mockup: {
      title: 'Cronograma com Alerta de Atraso',
      columns: ['Atividade', 'Data Limite', 'Situação'],
      rows: [
        [
          { value: 'Atividade', isHeader: true },
          { value: 'Prazo', isHeader: true, align: 'center' },
          { value: 'Status', isHeader: true, align: 'center' },
        ],
        [
          { value: 'Aprovação do Orçamento', align: 'left' },
          { value: '28/10/2026', align: 'center', highlight: 'rose' },
          { value: 'ATRASADO ⚠️', align: 'center', highlight: 'rose' },
        ],
        [
          { value: 'Entrega da Planilha no ONLYOFFICE', align: 'left' },
          { value: '10/11/2026', align: 'center' },
          { value: 'No Prazo', align: 'center', highlight: 'emerald' },
        ],
      ],
      caption: 'Qualquer data anterior a hoje fica automaticamente destacada em vermelho.',
    },
    tip: {
      title: 'Atenção com Tarefas já Concluídas',
      content:
        'Se a tarefa já estiver "Concluída", você não quer que ela continue vermelha! Dica extra: você pode adicionar uma regra em verde para células com texto "Concluído".',
      type: 'tip',
    },
    practiceExercise:
      'Coloque datas reais nas tarefas da sua equipe e aplique a regra =HOJE() para testar o alerta de atraso.',
    selfChecklist: [
      'Apliquei a regra de formatação condicional com a fórmula =HOJE().',
      'Tarefas com prazo vencido ficam destacadas em vermelho.',
      'Tarefas futuras permanecem com visual limpo.',
    ],
    nextStepPreview: 'Na próxima etapa, vamos criar uma barra de progresso e gráfico para acompanhar o avanço da equipe!',
  },

  p3_spec3: {
    id: 'p3_spec3',
    title: 'Cálculo de Dias Restantes e Progresso da Equipe',
    category: 'Missão 3: Gestão de Tarefas & Prazos',
    scope: 'especifico',
    learningGoal:
      'Calcular quantos dias faltam para a entrega de cada compromisso e montar um gráfico de pizza mostrando a porcentagem de tarefas já concluídas.',
    practicalTask:
      'Usar a fórmula =Prazo-HOJE() e criar um gráfico de acompanhamento de status.',
    steps: [
      {
        number: 1,
        instruction: 'Calcule os dias restantes.',
        detail: 'Na coluna "Dias Restantes" (ex: E2), digite: =C2-HOJE(). Formate a célula como Número Geral.',
      },
      {
        number: 2,
        instruction: 'Crie uma pequena tabela resumo de status.',
        detail: 'Em um cantinho da planilha, liste: Concluído, Em Andamento, Pendente.',
      },
      {
        number: 3,
        instruction: 'Insira um gráfico de Rosca ou Pizza.',
        menuPath: ['Inserir', 'Gráfico', 'Pizza / Rosca'],
        detail: 'Esse gráfico mostrará claramente a "fatia" do projeto que já foi entregue pela turma.',
      },
    ],
    mockup: {
      title: 'Painel de Gestão da Equipe',
      formulaBar: '=C2-HOJE()',
      columns: ['Tarefa', 'Prazo Final', 'Dias Restantes', 'Responsável'],
      rows: [
        [
          { value: 'Tarefa', isHeader: true },
          { value: 'Prazo', isHeader: true, align: 'center' },
          { value: 'Dias Restantes', isHeader: true, align: 'right' },
          { value: 'Membro', isHeader: true, align: 'center' },
        ],
        [
          { value: 'Gravação do Pitch de Negócios', align: 'left' },
          { value: '10/11/2026', align: 'center' },
          { value: '7 dias', align: 'right', highlight: 'selected' },
          { value: 'Todos', align: 'center' },
        ],
      ],
      caption: 'A coluna de dias restantes ajuda a equipe a priorizar o que vence mais rápido.',
    },
    tip: {
      title: 'Mantenha o Cronograma Vivo',
      content:
        'Um cronograma só funciona se for atualizado semanalmente. Defina um integrante da sua empresa fictícia para ser o gestor oficial do cronograma!',
      type: 'tip',
    },
    practiceExercise:
      'Adicione a contagem de dias restantes e gere o gráfico de pizza do andamento geral do projeto do grupo.',
    selfChecklist: [
      'A coluna calcula quantos dias faltam usando =Data-HOJE().',
      'O gráfico de progresso da equipe está inserido e configurado.',
      'Todos os integrantes têm suas tarefas distribuídas.',
    ],
    nextStepPreview: 'Excelente! A gestão de tarefas do seu projeto agora tem padrão de grandes empresas!',
  },

  // ==========================================================================
  // MISSÃO 4: CADASTROS E INFORMAÇÕES
  // ==========================================================================
  p4_spec1: {
    id: 'p4_spec1',
    title: 'Validação de Dados em Campos Críticos',
    category: 'Missão 4: Banco de Dados & Registros',
    scope: 'especifico',
    learningGoal:
      'Garantir que ninguém digite números de telefone errados, estados inexistentes ou dados incompletos na base de clientes ou fornecedores.',
    practicalTask:
      'Criar regras de validação para tamanho de texto e listas pré-definidas de categorias.',
    steps: [
      {
        number: 1,
        instruction: 'Defina as colunas do banco de dados.',
        detail: 'Exemplo: Nome Completo, Categoria de Cliente, Estado (UF), Telefone e E-mail.',
      },
      {
        number: 2,
        instruction: 'Restrinja o campo de Estado para 2 letras.',
        menuPath: ['Dados', 'Validação de Dados', 'Comprimento do Texto'],
        detail: 'Defina "Igual a: 2" para obrigar o preenchimento apenas da sigla (ex: MG, SP, RJ).',
      },
      {
        number: 3,
        instruction: 'Crie mensagem de erro amigável.',
        detail: 'Na aba "Alerta de Erro", digite: "Por favor, digite apenas a sigla de 2 letras do Estado (ex: MG)".',
      },
    ],
    mockup: {
      title: 'Base de Dados Padronizada',
      columns: ['Nome do Cliente / Parceiro', 'Segmento', 'UF', 'Status do Cadastro'],
      rows: [
        [
          { value: 'Nome / Razão Social', isHeader: true },
          { value: 'Segmento', isHeader: true, align: 'center' },
          { value: 'UF', isHeader: true, align: 'center' },
          { value: 'Validação', isHeader: true, align: 'center' },
        ],
        [
          { value: 'Padaria Central Ltda', align: 'left' },
          { value: 'Comércio Local', align: 'center' },
          { value: 'MG', align: 'center', highlight: 'selected' },
          { value: 'Aprovado ✓', align: 'center', highlight: 'emerald' },
        ],
        [
          { value: 'Supermercado Progresso', align: 'left' },
          { value: 'Atacado', align: 'center' },
          { value: 'SP', align: 'center' },
          { value: 'Aprovado ✓', align: 'center', highlight: 'emerald' },
        ],
      ],
      caption: 'Campos validados garantem que a base de dados nunca receba lixo eletrônico ou abreviações erradas.',
    },
    tip: {
      title: 'Qualidade de Dados (Data Quality)',
      content:
        'Em sistemas corporativos reais, corrigir dados digitados incorretamente custa caro. Regras de validação na entrada evitam 99% das dores de cabeça.',
      type: 'tip',
    },
    practiceExercise:
      'Crie a tabela de cadastro com pelo menos 10 registros e aplique validação de tamanho de texto na coluna de UF.',
    selfChecklist: [
      'A coluna de Estado aceita exatamente 2 caracteres.',
      'A coluna de Categoria possui menu suspenso de seleção.',
      'O sistema exibe mensagem de erro se algo for digitado fora do padrão.',
    ],
    nextStepPreview: 'Na próxima etapa, vamos usar a fórmula CONT.SE para contar quantos clientes temos em cada cidade!',
  },

  p4_spec2: {
    id: 'p4_spec2',
    title: 'Fórmulas Estatísticas com CONT.SE',
    category: 'Missão 4: Banco de Dados & Registros',
    scope: 'especifico',
    learningGoal:
      'Fazer a planilha contar automaticamente quantos registros atendem a um critério específico (ex: "Quantos clientes são de Minas Gerais?").',
    practicalTask:
      'Aplicar a fórmula =CONT.SE(intervalo; critério) para gerar totais por segmento.',
    steps: [
      {
        number: 1,
        instruction: 'Entenda a estrutura da fórmula CONT.SE.',
        detail: 'Ela precisa de dois parâmetros: onde procurar (intervalo) e o que procurar (critério entre aspas).',
      },
      {
        number: 2,
        instruction: 'Digite a fórmula para contar um estado.',
        detail: 'Exemplo: =CONT.SE(C2:C50; "MG"). A planilha contará quantas vezes "MG" aparece na coluna C.',
      },
      {
        number: 3,
        instruction: 'Aperte Enter e veja o contador dinâmico.',
        detail: 'Se você cadastrar um novo cliente de MG amanhã, o total mudará de 1 para 2 automaticamente!',
      },
    ],
    mockup: {
      title: 'Contagem Automática por Categoria',
      formulaBar: '=CONT.SE(C2:C10; "MG")',
      columns: ['Estado (UF)', 'Fórmula Usada', 'Total de Clientes Contados'],
      rows: [
        [
          { value: 'Estado / Região', isHeader: true },
          { value: 'Fórmula', isHeader: true, align: 'center' },
          { value: 'Cadastros Contados', isHeader: true, align: 'right' },
        ],
        [
          { value: 'Minas Gerais (MG)', align: 'left' },
          { value: '=CONT.SE(C2:C10; "MG")', align: 'center', highlight: 'selected' },
          { value: '7 clientes', align: 'right', highlight: 'emerald' },
        ],
        [
          { value: 'São Paulo (SP)', align: 'left' },
          { value: '=CONT.SE(C2:C10; "SP")', align: 'center' },
          { value: '3 clientes', align: 'right', highlight: 'blue' },
        ],
      ],
      caption: 'A função CONT.SE elimina o trabalho braçal de contar linhas uma por uma.',
    },
    tip: {
      title: 'Atenção com as Aspas!',
      content:
        'Sempre que o critério for um texto (como "MG", "Ativo" ou "Varejo"), coloque obrigatoriamente entre aspas duplas (""). Sem aspas, a fórmula dará erro #NOME?.',
      type: 'warning',
    },
    practiceExercise:
      'Monte um quadro resumo com a função CONT.SE totalizando os clientes por categoria na sua planilha.',
    selfChecklist: [
      'Utilizei a sintaxe =CONT.SE(intervalo; "critério").',
      'O resultado reflete a quantidade exata de linhas cadastradas.',
      'O número atualiza sozinho ao adicionar um novo registro.',
    ],
    nextStepPreview: 'Na última etapa, você vai montar uma Tabela Resumo com os principais indicadores do seu banco de dados!',
  },

  p4_spec3: {
    id: 'p4_spec3',
    title: 'Tabela Resumo com Indicadores da Base',
    category: 'Missão 4: Banco de Dados & Registros',
    scope: 'especifico',
    learningGoal:
      'Construir um mini-painel executivo (Dashboard) com cartões de indicadores consolidados (Total de Cadastros, Cidade Líder, Média por Grupo).',
    practicalTask:
      'Organizar uma área de resumo no topo ou em uma aba separada com as principais métricas do negócio.',
    steps: [
      {
        number: 1,
        instruction: 'Reserve um espaço para os Indicadores Chave.',
        detail: 'Crie uma seção destacada no topo da planilha com 3 ou 4 caixas de métricas.',
      },
      {
        number: 2,
        instruction: 'Insira o contador total de registros.',
        detail: 'Use a fórmula =CONT.VALORES(A2:A100) para saber o total geral de pessoas/empresas cadastradas.',
      },
      {
        number: 3,
        instruction: 'Combine com gráficos para visualização executiva.',
        detail: 'Adicione um gráfico de pizza mostrando a porcentagem de cada segmento cadastrado na base.',
      },
    ],
    mockup: {
      title: 'Mini Painel de Indicadores',
      columns: ['Indicador Chave', 'Valor Consolidado', 'Significado para o Negócio'],
      rows: [
        [
          { value: 'Métrica', isHeader: true },
          { value: 'Valor', isHeader: true, align: 'right' },
          { value: 'Observação', isHeader: true },
        ],
        [
          { value: 'Total de Cadastros Ativos', align: 'left' },
          { value: '48 contatos', align: 'right', highlight: 'emerald' },
          { value: 'Meta de 50 atingida em 96%', align: 'left' },
        ],
        [
          { value: 'Segmento Predominante', align: 'left' },
          { value: 'Gastronomia (62%)', align: 'right', highlight: 'blue' },
          { value: 'Foco prioritário da equipe', align: 'left' },
        ],
      ],
      caption: 'Um resumo executivo permite que a liderança da empresa tome decisões sem precisar ler a tabela toda.',
    },
    tip: {
      title: 'Padrão de Apresentação Executiva',
      content:
        'Destaque os números grandes em negrito e com tamanho 14 ou 16. A clareza visual é o que diferencia uma boa planilha de um amontoado de dados.',
      type: 'tip',
    },
    practiceExercise:
      'Monte o painel resumo com pelo menos 2 métricas consolidadas e um gráfico representativo na planilha da sua empresa.',
    selfChecklist: [
      'Criei a seção de resumo com os indicadores principais.',
      'Os totais são calculados por fórmulas dinâmicas.',
      'A estética da tabela está limpa, alinhada e profissional.',
    ],
    nextStepPreview: 'Sensacional! Sua empresa agora possui uma base de dados estruturada com padrão profissional de mercado!',
  },
};

export const getLessonById = (id: string): LessonData | null => {
  return LESSONS_MAP[id] || null;
};
