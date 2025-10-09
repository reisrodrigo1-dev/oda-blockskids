# Senha do Responsável - Documentação

## 📋 Visão Geral

Foi adicionada a funcionalidade de definir uma **senha de acesso** para o responsável ao cadastrar ou editar um cliente na tela `/admin/cadastrar-cliente-novo`.

## 🎯 Localização

- **Tela**: `/admin/cadastrar-cliente-novo`
- **Aba**: Responsável (3ª aba no formulário)
- **Campo**: "Senha de Acesso"

## ✨ Funcionalidades Implementadas

### 1. **Campo de Senha**
- ✅ Campo de entrada tipo `password` (oculta os caracteres)
- ✅ Validação de mínimo 6 caracteres
- ✅ Campo obrigatório (marcado com *)
- ✅ Placeholder explicativo: "Digite uma senha segura"

### 2. **Validações em Tempo Real**

#### Senha Inválida (< 6 caracteres)
```
⚠️ A senha deve ter pelo menos 6 caracteres
```
- Cor: Vermelha
- Ícone: AlertCircle

#### Senha Válida (≥ 6 caracteres)
```
✓ Senha válida
```
- Cor: Verde
- Ícone: CheckCircle

### 3. **Validações no Submit**

Ao tentar salvar o cliente, o sistema valida:

1. **Senha vazia**:
   - ❌ Mensagem: "A senha do responsável é obrigatória"
   - Impede o cadastro

2. **Senha curta (< 6 caracteres)**:
   - ❌ Mensagem: "A senha do responsável deve ter pelo menos 6 caracteres"
   - Impede o cadastro

3. **Senha válida**:
   - ✅ Permite o cadastro/atualização

### 4. **Informações de Ajuda**

Um banner informativo aparece no topo da aba Responsável:

```
ℹ️ Importante: Defina uma senha segura para o responsável. 
Esta senha será usada para acesso ao sistema.
```

## 📊 Estrutura de Dados

### Interface Cliente (atualizada)

```typescript
interface Cliente {
  // ... outros campos
  
  // Responsável
  nomeResponsavel: string;
  cargoResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
  senhaResponsavel: string;  // ✨ NOVO CAMPO
  
  // ... outros campos
}
```

### Dados Salvos no Firebase

```json
{
  "nomeResponsavel": "João Silva",
  "cargoResponsavel": "Diretor",
  "emailResponsavel": "joao@empresa.com",
  "telefoneResponsavel": "(11) 98765-4321",
  "senhaResponsavel": "senha123",  // ✨ Senha definida
  ...
}
```

## 🎨 Interface do Usuário

### Layout do Campo

```
┌────────────────────────────────────────────────────┐
│ Senha de Acesso * (Mínimo 6 caracteres)           │
│ ┌──────────────────────────────────────────────┐   │
│ │ ••••••                                        │   │
│ └──────────────────────────────────────────────┘   │
│ ✓ Senha válida                                     │
└────────────────────────────────────────────────────┘
```

### Estados Visuais

1. **Vazio**:
   - Campo normal
   - Sem feedback visual

2. **Senha Curta (< 6)**:
   - Borda vermelha (opcional)
   - Mensagem de erro em vermelho
   - Ícone de alerta

3. **Senha Válida (≥ 6)**:
   - Mensagem de sucesso em verde
   - Ícone de check

## 🔧 Como Usar

### Cadastrar Novo Cliente

1. Acesse `/admin/cadastrar-cliente-novo`
2. Clique em "Novo Cliente"
3. Preencha as abas:
   - Dados Básicos
   - Endereço
   - **Responsável** ← Defina a senha aqui
   - Professores
4. Na aba Responsável:
   - Preencha nome, cargo, email, telefone
   - **Digite uma senha com pelo menos 6 caracteres**
   - Veja o feedback visual
5. Clique em "Cadastrar Cliente"

### Editar Cliente Existente

1. Na lista de clientes, clique em "Editar"
2. Navegue até a aba "Responsável"
3. **Altere a senha se necessário**
4. Clique em "Atualizar Cliente"

## 🔐 Segurança

### Boas Práticas Implementadas

✅ **Campo tipo password**: Oculta os caracteres digitados
✅ **Validação de comprimento**: Mínimo 6 caracteres
✅ **Campo obrigatório**: Não permite salvar sem senha
✅ **Feedback visual**: Usuário sabe se a senha é válida

### Melhorias Futuras Sugeridas

⚠️ **Atenção**: A senha atualmente é armazenada em **texto plano** no Firebase. Para produção, recomenda-se:

- [ ] Implementar hash de senha (bcrypt, argon2)
- [ ] Adicionar confirmação de senha
- [ ] Validar complexidade (letras, números, símbolos)
- [ ] Exigir senha forte (8+ caracteres, maiúsculas, minúsculas, números)
- [ ] Implementar recuperação de senha
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar política de expiração de senha
- [ ] Registrar tentativas de login

## 📝 Validações Completas

### No Formulário (Tempo Real)

```typescript
// Validação visual enquanto digita
if (senha.length < 6) {
  // Mostra: "A senha deve ter pelo menos 6 caracteres"
} else {
  // Mostra: "Senha válida"
}
```

### No Submit (Ao Salvar)

```typescript
// 1. Verifica se está vazia
if (!senhaResponsavel.trim()) {
  toast.error("A senha do responsável é obrigatória");
  return;
}

// 2. Verifica comprimento mínimo
if (senhaResponsavel.length < 6) {
  toast.error("A senha deve ter pelo menos 6 caracteres");
  return;
}

// 3. Salva no banco
await saveCliente(clienteData);
```

## 🎯 Casos de Uso

### Caso 1: Primeiro Acesso
```
Admin cadastra cliente
→ Define senha "abc123" para o responsável
→ Responsável recebe email com as credenciais
→ Responsável faz login com email + senha
```

### Caso 2: Troca de Responsável
```
Admin edita cliente
→ Atualiza nome e email do responsável
→ Define nova senha
→ Novo responsável recebe as credenciais
```

### Caso 3: Redefinição de Senha
```
Responsável esqueceu a senha
→ Contata o admin
→ Admin edita o cliente
→ Define nova senha
→ Responsável recebe nova senha
```

## 📄 Arquivos Modificados

### Principal
- `client/src/pages/admin/cadastrar-cliente-novo.tsx`
  - Interface `Cliente` atualizada
  - Campo `senhaResponsavel` adicionado
  - Validações implementadas
  - UI atualizada

## 🚀 Próximos Passos Recomendados

### Curto Prazo
1. Adicionar campo de confirmação de senha
2. Implementar gerador de senha aleatória
3. Adicionar botão "Mostrar/Ocultar senha"

### Médio Prazo
1. Implementar sistema de login para responsável
2. Criar painel de controle do responsável
3. Adicionar recuperação de senha por email

### Longo Prazo
1. Implementar hash de senha
2. Adicionar autenticação de dois fatores
3. Criar auditoria de acessos
4. Implementar política de senha forte

## ✅ Checklist de Implementação

- [x] Campo de senha adicionado à interface
- [x] Validação de comprimento mínimo (6 caracteres)
- [x] Campo obrigatório
- [x] Feedback visual em tempo real
- [x] Validação no submit
- [x] Mensagens de erro claras
- [x] Banner informativo
- [x] Campo tipo password (oculta caracteres)
- [x] Salvamento no Firebase
- [x] Funciona em cadastro novo
- [x] Funciona em edição
- [x] Documentação criada

---

**Desenvolvido para**: Oficina do Amanhã - Blocks Kids
**Data**: Outubro 2025
**Versão**: 1.0
**Status**: ✅ Implementado e Funcional
