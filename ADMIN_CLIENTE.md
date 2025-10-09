# Admin-Cliente - Módulo Completo - Documentação

## 📋 Visão Geral

Foi criado um **módulo completo de Admin-Cliente** (Responsável) separado do sistema de Professor, permitindo que responsáveis de empresas e prefeituras acessem informações sobre seus professores, cursos e aulas.

## 🎯 Características do Sistema

### Acesso Exclusivo
- ✅ **Login com email e senha do responsável** (definidos no cadastro do cliente)
- ✅ **Professores NÃO podem logar** neste módulo
- ✅ Sistema completamente separado e independente
- ✅ Contexto de autenticação próprio

## 📁 Estrutura de Arquivos Criados

### Contexto de Autenticação
```
client/src/contexts/ClienteAuthContext.tsx
```
- Gerencia autenticação do responsável
- Armazena dados do cliente logado
- Funções: login(), logout()
- localStorage para persistência

### Páginas
```
client/src/pages/cliente/
├── login.tsx                  # Login do responsável
├── ProtectedRoute.tsx         # Rota protegida
├── DashboardLayout.tsx        # Layout comum
├── dashboard.tsx              # Dashboard principal
├── conta.tsx                  # Minha Conta
├── professores.tsx            # Lista de professores
└── projetos-aulas.tsx         # Cursos e aulas
```

## 🔐 Sistema de Login

### Credenciais
- **Email**: `emailResponsavel` (cadastrado no cliente)
- **Senha**: `senhaResponsavel` (definida no cadastro)

### Fluxo de Autenticação
1. Responsável acessa `/cliente/login`
2. Insere email e senha
3. Sistema busca no Firebase: `clientes` where `emailResponsavel == email` AND `senhaResponsavel == senha`
4. Se encontrado: redireciona para `/cliente/dashboard`
5. Se não: exibe erro "Email ou senha incorretos"

### Persistência
- Dados salvos no `localStorage` como `cliente_auth`
- Sessão mantida até logout
- Redirecionamento automático se já autenticado

## 📊 Páginas do Sistema

### 1. Login (`/cliente/login`)

**Funcionalidades**:
- Formulário de login com email e senha
- Validação de campos obrigatórios
- Mensagens de erro claras
- Link para área do professor
- Tema visual: gradiente verde-água (#00979D)

**Aviso Importante**:
> ℹ️ Este acesso é exclusivo para responsáveis cadastrados. Professores devem usar o login de professor.

---

### 2. Dashboard (`/cliente/dashboard`)

**Estatísticas Exibidas**:
- 📊 Total de professores
- 📖 Número de cursos
- 🎓 Total de aulas
- 🏢 Tipo (Empresa/Prefeitura)

**Seções**:
1. **Informações da Conta**
   - Razão Social
   - Nome Fantasia
   - CNPJ
   - Email, Telefone, Localização

2. **Dados do Responsável**
   - Nome
   - Cargo
   - Email
   - Telefone

3. **Professores Cadastrados** (Preview)
   - Mostra até 4 professores
   - Link "Ver todos" se houver mais

---

### 3. Minha Conta (`/cliente/conta`)

**Informações Detalhadas**:

#### Dados da Empresa/Prefeitura
- Razão Social
- Nome Fantasia
- CNPJ
- Tipo (badge colorido)

#### Informações de Contato
- E-mail principal
- Telefone
- Localização (Cidade/UF)

#### Responsável pela Conta
- Nome completo
- Cargo
- Email
- Telefone

#### Informações da Conta
- Total de professores
- Status: ✓ Ativa
- Tipo de acesso: 🔐 Responsável

**Banner Informativo**:
> Para atualizar qualquer informação da sua conta, entre em contato com o administrador

---

### 4. Professores (`/cliente/professores`)

**Estatísticas**:
- Total de professores
- Cursos diferentes
- Média de cursos por professor

**Lista de Professores**:
- Cards com informações completas
- Avatar com inicial do nome
- Email e telefone
- Lista de cursos atribuídos
- Número de aulas por curso
- Design: Grid responsivo 2 colunas

**Para Cada Professor**:
```
┌─────────────────────────────────────┐
│  [J] João Silva                     │
│      Professor                      │
├─────────────────────────────────────┤
│  📧 joao@escola.com                │
│  📞 (11) 98765-4321                │
├─────────────────────────────────────┤
│  📚 Cursos (2)                     │
│  ┌───────────────────────────────┐ │
│  │ Robótica Básica               │ │
│  │ Introdução à robótica...   │ │
│  │ [5 aulas]                   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### 5. Projetos e Aulas (`/cliente/projetos-aulas`)

**Estatísticas**:
- Total de cursos
- Total de aulas
- Número de professores
- Média de aulas por curso

**Lista de Cursos**:
- Cards expansíveis
- Header com gradiente verde-água
- Informações resumidas:
  - 🎥 Número de aulas
  - 👥 Professores que ministram
  - 📄 PDFs disponíveis

**Ao Expandir um Curso**:
1. **Professores que ministram**
   - Tags com nome dos professores

2. **Lista completa de aulas** (na ordem correta)
   - Numeração sequencial
   - Nome e descrição
   - Badges: 🎥 Vídeo, 📄 PDF
   - Hover: borda verde-água

---

## 🎨 Design System

### Cores Principais
- **Primária**: #00979D (verde-água)
- **Hover**: #007a85 (verde-água escuro)
- **Fundo**: Branco / Cinza claro
- **Texto**: Cinza escuro (#1f2937)

### Badges de Tipo
- **Empresa**: 🏭 Verde (#10b981)
- **Prefeitura**: 🏛️ Azul (#3b82f6)

### Layout
- **Sidebar**: 288px (w-72)
- **Container**: max-w-7xl
- **Padding**: p-8
- **Grid**: Responsivo 1/2/3 colunas

## 🔄 Fluxo Completo

### 1. Login
```
Responsável acessa /cliente/login
→ Insere emailResponsavel e senhaResponsavel
→ Sistema valida no Firebase
→ Se válido: redireciona /cliente/dashboard
→ Dados salvos no localStorage
```

### 2. Navegação
```
Dashboard (visão geral)
├── Minha Conta (detalhes completos)
├── Professores (lista e cursos)
└── Projetos e Aulas (conteúdo completo)
```

### 3. Logout
```
Botão "Sair" no menu lateral
→ Limpa localStorage
→ Redireciona para /cliente/login
```

## 🔒 Segurança

### Rotas Protegidas
- Todas as rotas `/cliente/*` (exceto `/cliente/login`) são protegidas
- Redirecionamento automático para login se não autenticado
- Componente `ProtectedRouteCliente`

### Validações
- ✅ Email obrigatório
- ✅ Senha obrigatória
- ✅ Verificação no Firebase
- ✅ Mensagens de erro claras

### Dados Sensíveis
- ⚠️ Senha armazenada em texto plano (para produção: usar hash)
- ⚠️ Token não implementado (sistema básico)

## 📝 Arquivos Modificados

### Novos Arquivos
1. `contexts/ClienteAuthContext.tsx` - Autenticação
2. `pages/cliente/login.tsx` - Login
3. `pages/cliente/ProtectedRoute.tsx` - Rota protegida
4. `pages/cliente/DashboardLayout.tsx` - Layout
5. `pages/cliente/dashboard.tsx` - Dashboard
6. `pages/cliente/conta.tsx` - Minha Conta
7. `pages/cliente/professores.tsx` - Professores
8. `pages/cliente/projetos-aulas.tsx` - Projetos e Aulas

### Modificados
1. `AppOffline.tsx`
   - Import do `ClienteAuthProvider`
   - Rotas do cliente adicionadas
   - Provider wrapper no App

## 🚀 Como Usar

### Para o Responsável

1. **Primeiro Acesso**:
   - Admin cadastra o cliente em `/admin/cadastrar-cliente-novo`
   - Admin define email e senha do responsável
   - Responsável recebe credenciais

2. **Login**:
   - Acessa `http://localhost:5000/cliente/login`
   - Insere email e senha
   - Clica em "Entrar"

3. **Navegação**:
   - **Dashboard**: Visão geral
   - **Minha Conta**: Dados completos
   - **Professores**: Lista de professores e cursos
   - **Projetos e Aulas**: Conteúdo detalhado

### Para o Administrador

1. **Cadastrar Cliente**:
   - Ir em `/admin/cadastrar-cliente-novo`
   - Preencher dados da empresa/prefeitura
   - **IMPORTANTE**: Definir email e senha do responsável
   - Cadastrar professores com cursos

2. **Informar Credenciais**:
   - Enviar email e senha para o responsável
   - Orientar sobre acesso em `/cliente/login`

## 🎯 Diferenças: Cliente vs Professor

| Aspecto | Admin-Cliente | Professor |
|---------|--------------|-----------|
| **Login** | Email/senha do responsável | Email/senha do professor |
| **Acesso** | Apenas responsável | Apenas professores |
| **Função** | Visualizar e acompanhar | Acessar e estudar |
| **Permissões** | Ver professores e conteúdo | Ver seus cursos e aulas |
| **Edição** | Não pode editar | Não pode editar |
| **Contexto** | `ClienteAuthContext` | `ProfessorAuthContext` |
| **Rotas** | `/cliente/*` | `/professor/*` |

## 📊 Dados Exibidos

### Dashboard
- ✅ Estatísticas gerais
- ✅ Informações da conta
- ✅ Dados do responsável
- ✅ Preview de professores

### Minha Conta
- ✅ Dados completos da empresa/prefeitura
- ✅ Informações de contato
- ✅ Dados do responsável
- ✅ Status da conta

### Professores
- ✅ Lista completa de professores
- ✅ Contato de cada professor
- ✅ Cursos atribuídos
- ✅ Número de aulas por curso

### Projetos e Aulas
- ✅ Todos os cursos disponíveis
- ✅ Lista completa de aulas (ordenadas)
- ✅ Professores por curso
- ✅ Recursos (vídeo, PDF)

## ⚠️ Limitações Atuais

1. **Apenas Visualização**: Responsável não pode editar nada
2. **Senha em Texto Plano**: Para produção, implementar hash
3. **Sem Recuperação de Senha**: Contatar admin para redefinir
4. **Sem Notificações**: Sistema básico de visualização
5. **Sem Analytics**: Não há tracking de acessos

## 🔧 Melhorias Futuras Sugeridas

### Curto Prazo
- [ ] Hash de senha (bcrypt)
- [ ] Recuperação de senha por email
- [ ] Edição de dados básicos do responsável
- [ ] Dashboard com gráficos

### Médio Prazo
- [ ] Sistema de notificações
- [ ] Relatórios de progresso dos professores
- [ ] Exportação de dados (PDF/Excel)
- [ ] Filtros e busca avançada

### Longo Prazo
- [ ] Analytics de uso
- [ ] Chat com suporte
- [ ] Integração com API externa
- [ ] App mobile

## ✅ Checklist de Implementação

- [x] Contexto de autenticação criado
- [x] Página de login implementada
- [x] Rota protegida configurada
- [x] Layout do dashboard criado
- [x] Dashboard principal funcional
- [x] Página Minha Conta completa
- [x] Página Professores implementada
- [x] Página Projetos e Aulas funcional
- [x] Rotas adicionadas ao AppOffline
- [x] Provider configurado
- [x] Sistema testado
- [x] Documentação criada

---

**Desenvolvido para**: Oficina do Amanhã - Blocks Kids
**Data**: Outubro 2025
**Versão**: 1.0
**Status**: ✅ Implementado e Funcional
