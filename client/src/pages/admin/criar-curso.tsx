import React, { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './DashboardLayout';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Trash2, Edit, Plus, BookOpen, GraduationCap, ListChecks, AlertCircle, CheckCircle, GripVertical } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Aula {
  id?: string;
  nome: string;
  linkYoutube: string;
  descricao: string;
  pdfUrl?: string;
  pdfName?: string;
  htmlContent?: string;
  createdAt?: Date;
}

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
  aulasOrdenadas?: Array<{ id: string; ordem: number }>;
  createdAt?: Date;
}

// Componente para cada aula arrastável
function SortableAulaItem({ aula, index, onRemove }: { aula: Aula; index: number; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: aula.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg p-4 bg-white hover:border-[#00979D] transition-colors ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Ícone de arrastar */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded transition-colors"
          title="Arrastar para reordenar"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>

        {/* Número da ordem */}
        <div className="flex-shrink-0 w-10 h-10 bg-[#00979D] text-white rounded-full flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>

        {/* Informações da aula */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{aula.nome}</h4>
          <p className="text-sm text-gray-600 truncate">{aula.descricao}</p>
          <div className="flex gap-2 mt-1">
            {aula.linkYoutube && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                📹 Vídeo
              </span>
            )}
            {aula.pdfUrl && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                📄 PDF
              </span>
            )}
          </div>
        </div>

        {/* Botão de remover */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function CriarCurso() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<Curso>({
    nome: '',
    descricao: '',
    aulasIds: [],
    aulasOrdenadas: [],
  });
  const [selectedAulas, setSelectedAulas] = useState<string[]>([]);
  const [orderedAulas, setOrderedAulas] = useState<Aula[]>([]);
  const [saving, setSaving] = useState(false);

  // Sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedAulas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Load cursos and aulas from Firebase
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load cursos
      const cursosQuery = query(collection(db, 'cursos'), orderBy('createdAt', 'desc'));
      const cursosSnapshot = await getDocs(cursosQuery);
      const cursosData = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Curso[];
      setCursos(cursosData);

      // Load aulas
      const aulasSnapshot = await getDocs(collection(db, 'aulas'));
      const aulasData = aulasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Aula[];
      setAulas(aulasData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome do curso é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.descricao.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'A descrição do curso é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    if (orderedAulas.length === 0) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione pelo menos uma aula para o curso',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Criar array com a ordem das aulas
      const aulasOrdenadas = orderedAulas.map((aula, index) => ({
        id: aula.id!,
        ordem: index + 1
      }));

      const cursoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        aulasIds: orderedAulas.map(a => a.id!),
        aulasOrdenadas: aulasOrdenadas,
        createdAt: new Date(),
      };

      if (editingCurso?.id) {
        // Update existing curso
        await updateDoc(doc(db, 'cursos', editingCurso.id), cursoData);
        toast({
          title: 'Sucesso',
          description: 'Curso atualizado com sucesso!',
        });
      } else {
        // Create new curso
        await addDoc(collection(db, 'cursos'), cursoData);
        toast({
          title: 'Sucesso',
          description: 'Curso criado com sucesso!',
        });
      }

      // Reset form and reload data
      setFormData({ nome: '', descricao: '', aulasIds: [], aulasOrdenadas: [] });
      setSelectedAulas([]);
      setOrderedAulas([]);
      setIsDialogOpen(false);
      setEditingCurso(null);
      loadData();
    } catch (error) {
      console.error('Error saving curso:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar curso',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit
  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setFormData({
      nome: curso.nome,
      descricao: curso.descricao,
      aulasIds: curso.aulasIds || [],
      aulasOrdenadas: curso.aulasOrdenadas || [],
    });
    setSelectedAulas(curso.aulasIds || []);
    
    // Reordenar aulas conforme salvo
    if (curso.aulasOrdenadas && curso.aulasOrdenadas.length > 0) {
      const aulasOrdenadas = curso.aulasOrdenadas
        .sort((a, b) => a.ordem - b.ordem)
        .map(ao => aulas.find(aula => aula.id === ao.id))
        .filter(Boolean) as Aula[];
      setOrderedAulas(aulasOrdenadas);
    } else {
      const aulasDosCurso = aulas.filter(aula => curso.aulasIds?.includes(aula.id!));
      setOrderedAulas(aulasDosCurso);
    }
    
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      await deleteDoc(doc(db, 'cursos', id));
      toast({
        title: 'Sucesso',
        description: 'Curso excluído com sucesso!',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting curso:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir curso',
        variant: 'destructive',
      });
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCurso(null);
    setFormData({ nome: '', descricao: '', aulasIds: [], aulasOrdenadas: [] });
    setSelectedAulas([]);
    setOrderedAulas([]);
  };

  // Toggle aula selection
  const toggleAulaSelection = (aulaId: string) => {
    const aula = aulas.find(a => a.id === aulaId);
    if (!aula) return;

    setSelectedAulas(prev => {
      if (prev.includes(aulaId)) {
        // Remove da seleção e da lista ordenada
        setOrderedAulas(current => current.filter(a => a.id !== aulaId));
        return prev.filter(id => id !== aulaId);
      } else {
        // Adiciona à seleção e à lista ordenada
        setOrderedAulas(current => [...current, aula]);
        return [...prev, aulaId];
      }
    });
  };

  // Remove aula da lista ordenada
  const removeAulaFromOrdered = (aulaId: string) => {
    setOrderedAulas(current => current.filter(a => a.id !== aulaId));
    setSelectedAulas(prev => prev.filter(id => id !== aulaId));
  };

  // Get aula by ID
  const getAulaById = (id: string) => {
    return aulas.find(aula => aula.id === id);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-3xl">📖</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Criar Projeto (Professor)</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie e gerencie projetos compostos por aulas da plataforma
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{cursos.length}</div>
            <div className="text-sm text-gray-600">Total de Projetos</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎓</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{aulas.length}</div>
            <div className="text-sm text-gray-600">Aulas Disponíveis</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📚</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {cursos.reduce((acc, curso) => acc + (curso.aulasIds?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Aulas em Projetos</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">➕</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <Button
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#00979D] hover:bg-[#007a85]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">Novo Curso</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Cursos Table */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando projetos...</p>
                </div>
              ) : cursos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum projeto cadastrado ainda.</p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeiro curso
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Curso</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Nº de Aulas</TableHead>
                      <TableHead>Aulas</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cursos.map((curso) => (
                      <TableRow key={curso.id}>
                        <TableCell className="font-medium">{curso.nome}</TableCell>
                        <TableCell className="max-w-xs truncate">{curso.descricao}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {curso.aulasIds?.length || 0} aulas
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {curso.aulasIds?.slice(0, 2).map(aulaId => {
                              const aula = getAulaById(aulaId);
                              return aula ? (
                                <span key={aulaId} className="text-xs text-gray-600">
                                  • {aula.nome}
                                </span>
                              ) : null;
                            })}
                            {curso.aulasIds && curso.aulasIds.length > 2 && (
                              <span className="text-xs text-gray-500">
                                + {curso.aulasIds.length - 2} mais
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(curso)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(curso.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-[#00979D] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Sistema de Gestão de Projetos</h3>
          <p className="max-w-2xl mx-auto">
            Crie projetos personalizados para professores combinando múltiplas aulas em sequências de aprendizado estruturadas.
          </p>
        </div>

        {/* Dialog for Create/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-white border-gray-200">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00979D] rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-gray-900">
                    {editingCurso ? 'Editar Curso' : 'Criar Novo Curso'}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingCurso ? 'Atualize as informações do curso' : 'Preencha os dados para criar um novo curso'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white">
              {/* Basic Information Section */}
              <div className="space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <BookOpen className="w-4 h-4 text-[#00979D]" />
                  <h3 className="font-semibold text-gray-900">Informações do Curso</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 bg-white">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                      Nome do Curso *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Digite o nome do curso"
                      className="mt-1 bg-white"
                      required
                    />
                    {formData.nome && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Nome válido
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
                      Descrição *
                    </Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Descreva o objetivo e conteúdo do curso"
                      rows={3}
                      className="mt-1 bg-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.descricao.length}/500 caracteres
                    </p>
                  </div>
                </div>
              </div>

              {/* Aulas Selection Section */}
              <div className="space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <ListChecks className="w-4 h-4 text-[#00979D]" />
                  <h3 className="font-semibold text-gray-900">Selecione as Aulas do Curso *</h3>
                  <span className="ml-auto text-sm text-gray-600">
                    {selectedAulas.length} {selectedAulas.length === 1 ? 'aula selecionada' : 'aulas selecionadas'}
                  </span>
                </div>

                {aulas.length === 0 ? (
                  <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-sm text-yellow-700">
                      Nenhuma aula cadastrada. Cadastre aulas primeiro em "Cadastro de Aulas".
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {aulas.map((aula) => (
                      <div
                        key={aula.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          selectedAulas.includes(aula.id!)
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`aula-${aula.id}`}
                            checked={selectedAulas.includes(aula.id!)}
                            onCheckedChange={() => toggleAulaSelection(aula.id!)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`aula-${aula.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-gray-900">{aula.nome}</div>
                            <div className="text-sm text-gray-600 mt-1">{aula.descricao}</div>
                            <div className="flex gap-2 mt-2">
                              {aula.linkYoutube && (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                  📹 Vídeo
                                </span>
                              )}
                              {aula.pdfUrl && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  📄 PDF
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedAulas.length === 0 && aulas.length > 0 && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Selecione pelo menos uma aula para o curso
                  </p>
                )}
              </div>

              {/* Ordem das Aulas Section */}
              {orderedAulas.length > 0 && (
                <div className="space-y-4 bg-white">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <GripVertical className="w-4 h-4 text-[#00979D]" />
                    <h3 className="font-semibold text-gray-900">Ordem das Aulas no Curso</h3>
                    <span className="ml-auto text-sm text-gray-500">
                      Arraste para reordenar
                    </span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <GripVertical className="w-4 h-4" />
                      <strong>Dica:</strong> Clique e arraste as aulas usando o ícone de linhas para alterar a ordem em que aparecerão para os professores.
                    </p>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={orderedAulas.map(a => a.id!)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {orderedAulas.map((aula, index) => (
                          <SortableAulaItem
                            key={aula.id}
                            aula={aula}
                            index={index}
                            onRemove={() => removeAulaFromOrdered(aula.id!)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.nome || !formData.descricao || orderedAulas.length === 0}
                  className="bg-[#00979D] hover:bg-[#007a85]"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      {editingCurso ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingCurso ? 'Atualizar Curso' : 'Criar Curso'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
