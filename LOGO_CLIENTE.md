# Logo do Cliente - Documentação

## 📋 Visão Geral

Implementado sistema de upload de **logo em Base64** no cadastro de clientes. A logo é exibida nos dashboards de professores e responsáveis quando estiverem logados.

## 🎯 Funcionalidades

### Upload de Logo
- ✅ Upload de imagem no cadastro do cliente
- ✅ Conversão automática para Base64
- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Validação de tamanho (máximo 2MB)
- ✅ Preview da imagem antes de salvar
- ✅ Opção de remover logo

### Exibição da Logo
- ✅ Dashboard do Professor
- ✅ Dashboard do Cliente (Responsável)
- ✅ Logo aparece automaticamente quando disponível
- ✅ Design responsivo e otimizado

## 📁 Arquivos Modificados

### 1. Interface do Cliente
**Arquivo**: `client/src/pages/admin/cadastrar-cliente-novo.tsx`

**Adicionado**:
- Campo `logoBase64?: string` na interface `Cliente`
- Estado `logoPreview` para preview da imagem
- Função `handleLogoUpload()` para processar upload
- Função `handleRemoveLogo()` para remover logo
- Componente de upload na aba "Dados Básicos"

### 2. Contexto do Professor
**Arquivo**: `client/src/contexts/ProfessorAuthContext.tsx`

**Adicionado**:
- Campo `logoBase64?: string` na interface `Cliente`
- Logo incluída nas informações do cliente no login

### 3. Contexto do Cliente
**Arquivo**: `client/src/contexts/ClienteAuthContext.tsx`

**Adicionado**:
- Campo `logoBase64?: string` na interface `Cliente`

### 4. Dashboard do Professor
**Arquivo**: `client/src/pages/professor/dashboard.tsx`

**Adicionado**:
- Exibição da logo no header do dashboard
- Logo em container branco com sombra
- Posicionamento à direita da saudação

### 5. Dashboard do Cliente
**Arquivo**: `client/src/pages/cliente/dashboard.tsx`

**Adicionado**:
- Exibição da logo no header do dashboard
- Logo em container com borda
- Posicionamento à direita do título

## 🎨 Design da Interface

### Upload de Logo (Cadastro)
```
┌─────────────────────────────────────────┐
│ Logo da Empresa/Prefeitura              │
│ Esta logo será exibida nos dashboards   │
│ (máx 2MB)                               │
├─────────────────────────────────────────┤
│                                         │
│  SEM LOGO:                              │
│  [Escolher arquivo]                     │
│                                         │
│  COM LOGO:                              │
│  ┌───────────┐                          │
│  │   [IMG]   │  [🗑️ Remover Logo]      │
│  └───────────┘                          │
│                                         │
└─────────────────────────────────────────┘
```

### Dashboard do Professor
```
┌─────────────────────────────────────────────┐
│ Olá, João! 👋              ┌──────────┐    │
│ Bem-vindo ao seu portal    │  [LOGO]  │    │
│                            └──────────┘    │
└─────────────────────────────────────────────┘
```

### Dashboard do Cliente
```
┌─────────────────────────────────────────────┐
│ Bem-vindo, Maria Silva!    ┌──────────┐    │
│ Gerencie as informações    │  [LOGO]  │    │
│                            └──────────┘    │
└─────────────────────────────────────────────┘
```

## 💻 Código de Implementação

### Upload de Logo
```typescript
const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Verificar se é imagem
  if (!file.type.startsWith('image/')) {
    toast({ title: 'Erro', description: 'Selecione uma imagem válida' });
    return;
  }

  // Verificar tamanho (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast({ title: 'Erro', description: 'Imagem deve ter no máximo 2MB' });
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result as string;
    setFormData({ ...formData, logoBase64: base64String });
    setLogoPreview(base64String);
  };
  reader.readAsDataURL(file);
};
```

### Exibição da Logo
```tsx
{cliente?.logoBase64 && (
  <div className="bg-white rounded-lg p-3 shadow-lg">
    <img 
      src={cliente.logoBase64} 
      alt="Logo da empresa" 
      className="max-h-16 max-w-[150px] object-contain"
    />
  </div>
)}
```

## ✅ Validações

### Upload
- ✅ **Tipo de arquivo**: Apenas imagens (image/*)
- ✅ **Tamanho máximo**: 2MB (2.097.152 bytes)
- ✅ **Formato**: Qualquer formato de imagem válido (PNG, JPG, GIF, SVG, etc.)

### Base64
- ✅ **Conversão automática**: FileReader converte para Base64
- ✅ **Armazenamento**: Salvo diretamente no Firebase
- ✅ **Persistência**: Mantido no localStorage junto com dados do cliente

## 📊 Fluxo Completo

### 1. Cadastro/Edição
```
Admin acessa cadastro de cliente
→ Seleciona arquivo de imagem
→ Sistema valida tipo e tamanho
→ Converte para Base64
→ Exibe preview
→ Salva no Firebase junto com dados do cliente
```

### 2. Login e Exibição
```
Professor/Responsável faz login
→ Sistema carrega dados do cliente (incluindo logo)
→ Logo é armazenada no contexto de autenticação
→ Dashboard exibe logo automaticamente se disponível
```

## 🎯 Casos de Uso

### Caso 1: Cliente sem Logo
- Dashboard exibe normalmente sem a seção de logo
- Nenhum espaço vazio aparece
- Layout se adapta automaticamente

### Caso 2: Cliente com Logo
- Logo aparece no canto superior direito dos dashboards
- Container branco com sombra para destaque
- Dimensões limitadas: max-h-16, max-w-[150px]
- Proporção preservada (object-contain)

### Caso 3: Atualização de Logo
- Admin pode remover logo existente
- Admin pode fazer upload de nova logo
- Preview é atualizado em tempo real
- Alterações salvas ao salvar o cliente

## 🔧 Especificações Técnicas

### Formato de Armazenamento
```
"logoBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### Tamanho no Banco
- **Imagem 100KB**: ~133KB em Base64
- **Imagem 500KB**: ~667KB em Base64
- **Imagem 2MB**: ~2.67MB em Base64

### Performance
- ✅ Carregamento instantâneo (já está em Base64)
- ✅ Não requer requisições adicionais
- ✅ Cache automático via localStorage
- ⚠️ Aumenta tamanho do documento no Firebase

## 📏 Dimensões Recomendadas

### Para Melhor Resultado
- **Largura**: 300-600px
- **Altura**: 100-200px
- **Formato**: PNG (com transparência) ou JPG
- **Proporção**: 3:1 ou 4:1 (horizontal)
- **Peso**: 100-500KB

### Exemplos de Boas Logos
```
✅ 400x100px, PNG, 150KB - Perfeito
✅ 600x150px, JPG, 300KB - Ótimo
✅ 300x100px, SVG, 50KB - Excelente
⚠️ 2000x500px, PNG, 1.8MB - Funciona mas é pesado
❌ 100x100px, PNG, 10KB - Muito pequeno
❌ 4000x1000px, PNG, 3MB - Muito grande (não valida)
```

## 🚀 Como Usar

### Para o Admin

1. **Adicionar Logo ao Cadastrar Cliente**:
   - Ir em `/admin/cadastrar-cliente-novo`
   - Preencher dados do cliente
   - Na seção "Logo da Empresa/Prefeitura", clicar em "Escolher arquivo"
   - Selecionar imagem (PNG, JPG, etc.)
   - Verificar preview
   - Salvar cliente

2. **Adicionar/Alterar Logo em Cliente Existente**:
   - Clicar em "Editar" no cliente
   - Ir para aba "Dados Básicos"
   - Fazer upload da nova logo
   - Para remover: clicar em "Remover Logo"
   - Salvar alterações

### Para Professor/Responsável

- Logo aparece **automaticamente** no dashboard após login
- Nenhuma ação necessária
- Logo sempre atualizada conforme cadastro do admin

## 💡 Dicas e Boas Práticas

### Para Admins
1. **Use logos com fundo transparente** (PNG) para melhor aparência
2. **Otimize a imagem antes do upload** para reduzir tamanho
3. **Prefira logos horizontais** (não quadradas)
4. **Teste a visualização** após salvar
5. **Use ferramentas de compressão** como TinyPNG

### Para Designers
1. **Mantenha logos simples** para melhor legibilidade
2. **Use cores que contrastem** com fundo branco
3. **Evite textos muito pequenos** na logo
4. **Teste em diferentes tamanhos** antes de finalizar

## ⚠️ Limitações

### Técnicas
- ⚠️ **Tamanho máximo**: 2MB por imagem
- ⚠️ **Formatos**: Apenas imagens (não aceita PDF, etc.)
- ⚠️ **Base64**: Aumenta ~33% o tamanho original
- ⚠️ **Firebase**: Aumenta tamanho do documento

### Funcionais
- ⚠️ Logo aparece apenas nos dashboards (não em outras páginas)
- ⚠️ Sem galeria de logos (1 logo por cliente)
- ⚠️ Sem edição de imagem (crop, resize) no sistema
- ⚠️ Sem versionamento de logos

## 🔮 Melhorias Futuras Sugeridas

### Curto Prazo
- [ ] Crop/resize de imagem antes do upload
- [ ] Compressão automática para reduzir tamanho
- [ ] Suporte a múltiplas logos (clara e escura)
- [ ] Preview em mais locais (lista de clientes)

### Médio Prazo
- [ ] Upload direto para Firebase Storage (em vez de Base64)
- [ ] CDN para servir logos otimizadas
- [ ] Histórico de logos (versionamento)
- [ ] Galeria de templates de logo

### Longo Prazo
- [ ] Editor de logo integrado
- [ ] Gerador de logo com IA
- [ ] Análise de qualidade da logo
- [ ] Sugestões de otimização

## 📈 Benefícios

### Para Clientes
- ✅ **Identidade visual** preservada nos dashboards
- ✅ **Profissionalismo** aumentado
- ✅ **Branding** consistente
- ✅ **Reconhecimento** imediato da empresa/prefeitura

### Para Professores
- ✅ **Conexão visual** com a instituição
- ✅ **Profissionalismo** da plataforma
- ✅ **Identificação rápida** do cliente

### Para o Sistema
- ✅ **Personalização** por cliente
- ✅ **Diferenciação** entre clientes
- ✅ **Valor agregado** ao produto

---

**Desenvolvido para**: Oficina do Amanhã - Blocks Kids
**Data**: Janeiro 2025
**Versão**: 1.0
**Status**: ✅ Implementado e Funcional
