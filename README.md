# Founders Grid — Educação Digital | Etapa 1

Aplicação web desenvolvida para a atividade escolar de **Educação Digital** do 2º ano do Ensino Médio (turmas **2º2** e **2º3**).

O objetivo é permitir que cada grupo crie sua empresa fictícia, registre seus integrantes e identidade visual, e escolha um problema real para resolver utilizando ferramentas digitais (suíte ONLYOFFICE) ao longo do ano letivo.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com design system refinado (/impeccable standards)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Animações e Efeitos:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com/)
  - **Supabase Auth:** Autenticação dos grupos com mapeamento transparente de login de usuário para e-mail técnico (`@foundersgrid.edu.br`).
  - **Supabase PostgreSQL:** Persistência relacional na tabela `groups` com Row Level Security (RLS) habilitado.
  - **Supabase Storage:** Armazenamento dos logotipos das empresas no bucket público `company-logos`.

---

## 📁 Estrutura do Projeto

```text
├── public/
│   └── logo-icon.svg             # Favicon e ícone do sistema
├── src/
│   ├── components/
│   │   ├── AuthScreen.tsx        # Telas de Criar Empresa e Entrar
│   │   ├── Dashboard.tsx         # Painel do Grupo (perfil, etapa e status)
│   │   ├── EditCompanyModal.tsx  # Modal de edição dos dados da empresa
│   │   ├── Header.tsx            # Barra superior com branding institucional
│   │   ├── LearningPlan.tsx      # Seção "O que precisamos aprender?" com checklist
│   │   ├── LogoGenerator.tsx     # Gerador de monograma com iniciais + upload de imagem
│   │   ├── ProblemSelection.tsx  # Cartões dos problemas com planilhas e confirmação
│   │   └── Toast.tsx             # Notificações flutuantes com auto-dismiss
│   ├── data/
│   │   └── problems.ts           # Conteúdo das 4 situações-problema de planilhas (ONLYOFFICE)
│   ├── lib/
│   │   └── supabase.ts           # Cliente Supabase, Auth, CRUD, Storage e fallback demo
│   ├── types/
│   │   └── index.ts              # Definições de tipos TypeScript do sistema
│   ├── App.tsx                   # Orquestrador da aplicação
│   ├── index.css                 # Estilos globais e tokens do Tailwind CSS v4
│   └── main.tsx                  # Ponto de entrada React
├── supabase/
│   └── schema.sql                # Script SQL completo com tabelas, RLS e Storage
├── .env.example                  # Variáveis de ambiente de exemplo
├── .env                          # Variáveis de ambiente locais
└── package.json                  # Dependências e scripts npm
```

---

## 🛠️ Como Executar Localmente

### 1. Pré-requisitos
- Node.js versão 18 ou superior instalado.
- Gerenciador de pacotes `npm`.

### 2. Instalação das dependências
Abra o terminal na pasta do projeto e execute:
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
O Vite iniciará o projeto localmente em:
👉 **`http://localhost:5173/`**

---

## 🗄️ Configuração do Supabase (Banco de Dados, Auth e Storage)

A aplicação conta com integração com o Supabase via variáveis de ambiente seguras no arquivo `.env`.

### Passo 1: Executar o Script SQL no Supabase
1. Acesse o seu painel do Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Abra seu projeto e navegue até **SQL Editor** > **New Query**.
3. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](file:///c:/Users/USER/Desktop/Educa%C3%A7%C3%A3o%20Digital/supabase/schema.sql).
4. Cole no editor e clique no botão **Run**.

O script irá criar:
- A tabela `public.groups` com campos para dados da empresa, integrantes, turma (`2º2` ou `2º3`), problema selecionado, status e checklist de objetivos.
- Trigger automática para manter o campo `updated_at` atualizado.
- Políticas de segurança **Row Level Security (RLS)** que garantem que cada grupo só pode alterar sua própria empresa.
- O bucket de storage público `company-logos` com permissão de upload para grupos autenticados.
- A função segura `register_group_account` para cadastro pré-confirmado em lote dos alunos sem envio de e-mails e sem atingir limites de rate limit (429).

### Passo 2: Desativar a Confirmação por E-mail (Importante para Sala de Aula)
Como os alunos criam empresas fictícias e não possuem caixas de entrada para verificar links:
1. No painel do Supabase, vá em **Authentication** > **Providers** > **Email**.
2. Desmarque a opção **"Confirm email"** (mude para desligado).
3. Clique em **Save**.

### Passo 3: Configurar as Chaves de Acesso no `.env`
No arquivo `.env` na raiz do projeto (invisível para os alunos na interface), insira sua URL e Anon Key:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

> 💡 **Modo de Demonstração Silencioso:** Se o Supabase ainda não estiver configurado no `.env`, a aplicação opera com persistência demonstrativa local no navegador, permitindo testar todos os fluxos de cadastro, login, troca de problemas e marcação de objetivos de forma transparente.

---

## 🎯 Funcionalidades Implementadas

1. **Tela Inicial — Criar Empresa e Entrar:**
   - Alternância entre abas "Cadastrar Nova Empresa" e "Acessar Empresa Existente".
   - Validações de campos obrigatórios e igualdade de senhas.
   - Seleção de turma (`2º2` ou `2º3`) e lista de integrantes.
   - Gerador de monograma visual institucional OU upload de imagem para o logotipo.

2. **Painel do Grupo (Dashboard):**
   - Exibição de logotipo, nome da empresa, turma e integrantes.
   - Ramo de atuação e descrição.
   - Indicador da etapa atual: *Educação Digital — Etapa 1*.
   - Badge dinâmico de status: *Não iniciada*, *Em andamento* ou *Concluída*.
   - Botões: "Continuar atividade", "Editar dados da empresa" e "Sair".

3. **Educação Digital — Etapa 1 (Escolha da Situação-Problema):**
   - Apresentação das 4 situações-problema com foco em **Planilhas (ONLYOFFICE)**.
   - Descrição da situação real e objetivo da planilha.
   - Listagem das habilidades de planilha trabalhadas em cada desafio.
   - Modal de confirmação antes de gravar a escolha.

4. **Plano de Metas ("Metas de Aprendizagem da Empresa"):**
   - Checklist interativo dos objetivos na planilha.
   - Barra de progresso de habilidades desenvolvidas.
   - Compromisso pedagógico de aprendizagem do ano letivo.
   - Barra de progresso dinâmica em tempo real (% de habilidades dominadas).
   - Efeito visual de confete ao concluir todas as metas da Etapa 1.
   - Mensagem pedagógica orientadora do ano letivo.

5. **Edição dos Dados da Empresa:**
   - Modal para atualizar nome, ramo, descrição, integrantes, turma e logotipo.
