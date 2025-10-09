# Configuração do Firebase para Cadastro de Aulas

## ## 6. Funcionalidades Implementadas

✅ **Dashboard com Abas**: O painel admin agora tem duas abas - Dashboard e Cadastro de Aulas
✅ **CRUD Completo de Aulas**:
   - Criar novas aulas (Nome, Link YouTube, Descrição, PDF)
   - Listar todas as aulas cadastradas
   - Editar aulas existentes
   - Excluir aulas
✅ **Upload de PDFs**: PDFs são salvos no Firebase Storage
✅ **Links Diretos**: Links para vídeos do YouTube e downloads de PDFs
✅ **Interface Responsiva**: Design moderno com componentes shadcn/ui

## 7. Como Usar

1. Configure o Firebase seguindo os passos acima
2. Execute `npm run dev` na pasta client
3. Acesse `/admin`
4. Clique na aba "Cadastro de Aulas"
5. Use o botão "Nova Aula" para criar aulas
6. Use os botões de editar/excluir para gerenciar aulas existentesProjeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto" ou "Add project"
3. Dê um nome ao projeto (ex: "oda-blockskids-admin")
4. Siga o assistente de configuração

## 2. Habilitar Firestore Database

1. No seu projeto Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (você pode alterar as regras de segurança depois)
4. Selecione uma localização para o banco de dados

## 3. Habilitar Storage

1. No seu projeto Firebase, vá para "Storage"
2. Clique em "Começar"
3. Escolha "Iniciar no modo de teste" (você pode alterar as regras de segurança depois)

## 4. Obter Configuração do Firebase

1. No seu projeto Firebase, clique no ícone de engrenagem → "Configurações do projeto"
2. Role para baixo até "Seus apps"
3. Clique em "Adicionar app" → Web (</>)
4. Registre o app com um apelido
5. Copie o objeto de configuração

## 5. Atualizar Configuração no Código

Substitua os valores placeholder em `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-real",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id-real",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id-real",
  appId: "seu-app-id-real"
};
```

## 6. Testar a Aplicação

Após configurar o Firebase, execute:

```bash
cd client
npm run dev
```

Acesse `/admin` para testar a interface CRUD de aulas.

## Funcionalidades Implementadas

- ✅ Criar novas aulas (Nome, Link YouTube, Descrição, PDF)
- ✅ Listar todas as aulas cadastradas
- ✅ Editar aulas existentes
- ✅ Excluir aulas
- ✅ Upload de PDFs para o Firebase Storage
- ✅ Links diretos para vídeos do YouTube
- ✅ Links para download dos PDFs

## Estrutura dos Dados no Firestore

As aulas são salvas na coleção `aulas` com a seguinte estrutura:

```json
{
  "nome": "Nome da Aula",
  "linkYoutube": "https://youtube.com/watch?v=...",
  "descricao": "Descrição da aula",
  "pdfUrl": "https://firebasestorage.googleapis.com/...",
  "pdfName": "arquivo.pdf",
  "createdAt": "2025-01-07T..."
}
```