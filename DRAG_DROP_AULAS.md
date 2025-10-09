# Funcionalidade de Reordenação de Aulas com Drag & Drop

## 📋 Resumo das Alterações

Foi implementada a funcionalidade de **arrastar e soltar (drag and drop)** para reordenar as aulas dentro de um curso na tela `/admin/criar-curso`. A ordem definida é salva no Firebase e respeitada nas telas de acesso do professor.

## 🎯 Funcionalidades Implementadas

### 1. Tela de Criação/Edição de Curso (`/admin/criar-curso`)

#### Recursos Adicionados:
- ✅ **Seleção de Aulas**: Mantida a funcionalidade de checkbox para selecionar aulas
- ✅ **Nova Seção "Ordem das Aulas"**: Aparece automaticamente quando aulas são selecionadas
- ✅ **Drag and Drop**: Arraste as aulas usando o ícone de linhas (GripVertical) para reordenar
- ✅ **Indicador Visual**: Cada aula mostra seu número de ordem em um círculo colorido
- ✅ **Dica Visual**: Banner azul explicando como usar o drag and drop
- ✅ **Remover Aula**: Botão para remover aula individual da lista ordenada

#### Como Usar:
1. Selecione as aulas desejadas usando os checkboxes
2. As aulas aparecem automaticamente na seção "Ordem das Aulas no Curso"
3. Clique e arraste o ícone de linhas (≡) para reordenar
4. Clique no botão de lixeira para remover uma aula
5. Salve o curso - a ordem será preservada

### 2. Tela do Professor (`/professor/cursos`)

#### Recursos Atualizados:
- ✅ As aulas agora aparecem **na ordem definida** pelo administrador
- ✅ A numeração das aulas reflete a ordem correta
- ✅ Mantida toda funcionalidade existente

### 3. Tela de Assistir Aula (`/professor/assistir/:cursoId/:aulaId?`)

#### Recursos Atualizados:
- ✅ As aulas são carregadas **na ordem correta**
- ✅ Navegação (próxima/anterior) respeita a ordem definida
- ✅ Barra lateral mostra aulas na sequência correta

## 🔧 Tecnologias Utilizadas

### Biblioteca: @dnd-kit
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Componentes utilizados:**
- `DndContext`: Contexto principal do drag and drop
- `SortableContext`: Contexto para itens ordenáveis
- `useSortable`: Hook para tornar elementos arrastáveis
- `arrayMove`: Função auxiliar para reordenar arrays

## 📊 Estrutura de Dados no Firebase

### Antes:
```typescript
interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
  createdAt?: Date;
}
```

### Depois:
```typescript
interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
  aulasOrdenadas?: Array<{ id: string; ordem: number }>; // NOVO
  createdAt?: Date;
}
```

### Exemplo de Dados Salvos:
```json
{
  "nome": "Introdução ao Arduino",
  "descricao": "Curso básico de Arduino",
  "aulasIds": ["aula1", "aula2", "aula3"],
  "aulasOrdenadas": [
    { "id": "aula2", "ordem": 1 },
    { "id": "aula1", "ordem": 2 },
    { "id": "aula3", "ordem": 3 }
  ]
}
```

## 🎨 Componentes Criados

### `SortableAulaItem`
Componente que renderiza cada aula arrastável com:
- Ícone de arrastar (GripVertical)
- Número da ordem
- Informações da aula (nome, descrição)
- Tags de recursos (vídeo, PDF)
- Botão de remover

## 📝 Arquivos Modificados

1. **`client/src/pages/admin/criar-curso.tsx`**
   - Adicionados imports do @dnd-kit
   - Criado componente `SortableAulaItem`
   - Adicionados estados: `orderedAulas`, `sensors`
   - Implementada função `handleDragEnd`
   - Atualizada função `handleSubmit` para salvar ordem
   - Atualizada função `toggleAulaSelection` para gerenciar ordem
   - Adicionada nova seção UI "Ordem das Aulas no Curso"

2. **`client/src/pages/professor/cursos.tsx`**
   - Atualizada interface `Curso`
   - Modificada função `getAulasByCurso` para ordenar aulas

3. **`client/src/pages/professor/assistir-aula.tsx`**
   - Atualizada interface `Curso`
   - Modificada função `loadCursoEAulas` para ordenar aulas

## ✨ Características da Implementação

### Experiência do Usuário:
- 🎯 **Intuitivo**: Arrastar e soltar é natural e fácil de usar
- 👁️ **Feedback Visual**: Opacidade reduzida ao arrastar, hover effects
- 🔢 **Numeração Clara**: Círculos coloridos mostram a ordem
- 💡 **Dicas Contextuais**: Banner explicativo sobre como usar
- ♿ **Acessibilidade**: Suporte a teclado através do `KeyboardSensor`

### Robustez:
- ✅ **Retrocompatibilidade**: Cursos antigos sem `aulasOrdenadas` ainda funcionam
- ✅ **Validação**: Não permite salvar curso sem aulas
- ✅ **Consistência**: Ordem preservada em todas as telas
- ✅ **Performance**: Sensores otimizados (PointerSensor, KeyboardSensor)

## 🧪 Testes Sugeridos

1. ✅ Criar novo curso e ordenar aulas
2. ✅ Editar curso existente e reordenar aulas
3. ✅ Verificar ordem na tela do professor
4. ✅ Navegar entre aulas na tela de assistir
5. ✅ Remover aula da lista ordenada
6. ✅ Adicionar nova aula ao curso existente
7. ✅ Verificar curso criado antes da atualização (sem aulasOrdenadas)

## 🚀 Próximos Passos Possíveis

- [ ] Adicionar animações mais suaves
- [ ] Implementar undo/redo de ordenação
- [ ] Adicionar pré-visualização da ordem antes de salvar
- [ ] Exportar ordem das aulas em relatórios
- [ ] Adicionar ordenação por data, nome, etc.

## 📚 Documentação @dnd-kit

- [Documentação Oficial](https://docs.dndkit.com/)
- [Exemplos](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/)
