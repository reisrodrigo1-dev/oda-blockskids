import React, { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './DashboardLayout';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Trash2, Edit, Plus, Upload, FileText, BookOpen, Youtube, File, X, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

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

export default function CadastroAulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [formData, setFormData] = useState<Aula>({
    nome: '',
    linkYoutube: '',
    descricao: '',
    htmlContent: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load aulas from Firebase
  const loadAulas = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'aulas'));
      const aulasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Aula[];
      setAulas(aulasData);
    } catch (error) {
      console.error('Error loading aulas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar aulas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAulas();
  }, []);

  // Handle PDF upload
  const handlePdfUpload = async (file: File): Promise<{ url: string; name: string }> => {
    const storageRef = ref(storage, `aulas/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, name: file.name };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.nome.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome da aula é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.descricao.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'A descrição da aula é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    // YouTube link is optional. If provided, validate format.
    if (formData.linkYoutube && formData.linkYoutube.trim()) {
      if (!isValidYouTubeUrl(formData.linkYoutube)) {
        toast({
          title: 'Erro de validação',
          description: 'O link do YouTube não é válido',
          variant: 'destructive',
        });
        return;
      }
    }

    if (pdfFile && pdfFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'Erro de validação',
        description: 'O arquivo PDF deve ter no máximo 10MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      let pdfData = {};

      if (pdfFile) {
        const { url, name } = await handlePdfUpload(pdfFile);
        pdfData = { pdfUrl: url, pdfName: name };
      }

      const aulaData = {
        ...formData,
        ...pdfData,
        createdAt: new Date(),
      };

      if (editingAula?.id) {
        // Update existing aula
        await updateDoc(doc(db, 'aulas', editingAula.id), aulaData);
        toast({
          title: 'Sucesso',
          description: 'Aula atualizada com sucesso!',
        });
      } else {
        // Create new aula
        await addDoc(collection(db, 'aulas'), aulaData);
        toast({
          title: 'Sucesso',
          description: 'Aula criada com sucesso!',
        });
      }

      // Reset form and reload data
      setFormData({ nome: '', linkYoutube: '', descricao: '', htmlContent: '' });
      setPdfFile(null);
      setIsDialogOpen(false);
      setEditingAula(null);
      loadAulas();
    } catch (error) {
      console.error('Error saving aula:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar aula',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle edit
  const handleEdit = (aula: Aula) => {
    setEditingAula(aula);
    setFormData({
      nome: aula.nome,
      linkYoutube: aula.linkYoutube,
      descricao: aula.descricao,
      htmlContent: aula.htmlContent || '',
    });
    setPdfFile(null); // Clear file input when editing
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string, pdfUrl?: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

    try {
      await deleteDoc(doc(db, 'aulas', id));

      // Delete PDF from storage if exists
      if (pdfUrl) {
        const pdfRef = ref(storage, pdfUrl);
        await deleteObject(pdfRef);
      }

      toast({
        title: 'Sucesso',
        description: 'Aula excluída com sucesso!',
      });
      loadAulas();
    } catch (error) {
      console.error('Error deleting aula:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir aula',
        variant: 'destructive',
      });
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAula(null);
    setFormData({ nome: '', linkYoutube: '', descricao: '', htmlContent: '' });
    setPdfFile(null);
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    return extractYouTubeId(url) !== null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-3xl">🎓</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cadastro de Aulas</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie as aulas da plataforma Oficina do Amanhã - Blocks Kids
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📚</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{aulas.length}</div>
            <div className="text-sm text-gray-600">Total de Aulas</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📄</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{aulas.filter(aula => aula.pdfUrl).length}</div>
            <div className="text-sm text-gray-600">Com PDF</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎥</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{aulas.filter(aula => aula.linkYoutube).length}</div>
            <div className="text-sm text-gray-600">Com Vídeo</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{aulas.filter(aula => aula.htmlContent).length}</div>
            <div className="text-sm text-gray-600">Com Documento</div>
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
            <div className="text-sm text-gray-600">Nova Aula</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Aulas Table */}
          <Card>
            <CardHeader>
              <CardTitle>Aulas Cadastradas</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando aulas...</p>
                </div>
              ) : aulas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma aula cadastrada ainda.</p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar primeira aula
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Link YouTube</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>PDF</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aulas.map((aula) => (
                      <TableRow key={aula.id}>
                        <TableCell className="font-medium">{aula.nome}</TableCell>
                        <TableCell>
                          <a
                            href={aula.linkYoutube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver vídeo
                          </a>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{aula.descricao}</TableCell>
                        <TableCell>
                          {aula.pdfUrl ? (
                            <a
                              href={aula.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              {aula.pdfName}
                            </a>
                          ) : (
                            <span className="text-gray-400">Nenhum</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {aula.htmlContent ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Sim
                            </span>
                          ) : (
                            <span className="text-gray-400">Nenhum</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(aula)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(aula.id!, aula.pdfUrl)}
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
          <h3 className="text-2xl font-bold mb-3">Sistema de Gestão de Aulas</h3>
          <p className="max-w-2xl mx-auto">
            Cadastre e gerencie aulas com vídeos do YouTube e materiais em PDF para enriquecer o aprendizado dos alunos.
          </p>
        </div>

        {/* Dialog for Create/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-white border-gray-200">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00979D] rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-gray-900">
                    {editingAula ? 'Editar Aula' : 'Criar Nova Aula'}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingAula ? 'Atualize as informações da aula' : 'Preencha os dados para criar uma nova aula'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white">
              {/* Basic Information Section */}
              <div className="space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="w-4 h-4 text-[#00979D]" />
                  <h3 className="font-semibold text-gray-900">Informações Básicas</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 bg-white">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                      Nome da Aula *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Digite o nome da aula"
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
                      placeholder="Descreva o conteúdo da aula"
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

              {/* YouTube Video Section */}
              <div className="space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <h3 className="font-semibold text-gray-900">Vídeo do YouTube</h3>
                </div>

                <div>
                  <Label htmlFor="linkYoutube" className="text-sm font-medium text-gray-700">
                    Link do YouTube *
                  </Label>
                  <Input
                    id="linkYoutube"
                    type="url"
                    value={formData.linkYoutube}
                    onChange={(e) => setFormData({ ...formData, linkYoutube: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1 bg-white"
                  />
                  {formData.linkYoutube && (
                    <div className="mt-2 flex items-center gap-2">
                      {isValidYouTubeUrl(formData.linkYoutube) ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Link válido</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(formData.linkYoutube, '_blank')}
                            className="ml-auto"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver vídeo
                          </Button>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Link inválido</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* YouTube Preview */}
                {formData.linkYoutube && isValidYouTubeUrl(formData.linkYoutube) && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview do Vídeo</h4>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(formData.linkYoutube)}`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube Video Preview"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* HTML Document Section */}
              <div className="space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="w-4 h-4 text-green-500" />
                  <h3 className="font-semibold text-gray-900">Documento da Aula (HTML - Opcional)</h3>
                </div>

                <div>
                  <Label htmlFor="htmlContent" className="text-sm font-medium text-gray-700">
                    Conteúdo HTML da Aula
                  </Label>
                  <Textarea
                    id="htmlContent"
                    value={formData.htmlContent || ''}
                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                    placeholder="Cole ou digite o HTML do documento da aula aqui..."
                    rows={8}
                    className="mt-1 bg-white font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este documento aparecerá como material de apoio para o professor durante a aula.
                  </p>
                  {formData.htmlContent && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Preview do Documento:</h4>
                      <div 
                        className="prose prose-sm max-w-none bg-white p-3 border rounded overflow-auto max-h-40"
                        dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* PDF Material Section */}
              <div className="space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <File className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Material PDF (Opcional)</h3>
                </div>

                <div>
                  <Label htmlFor="pdf" className="text-sm font-medium text-gray-700">
                    Arquivo PDF
                  </Label>
                  <div className="mt-1">
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        pdfFile
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-[#00979D] hover:bg-[#00979D]/5'
                      }`}
                    >
                      <input
                        id="pdf"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="pdf" className="cursor-pointer">
                        {pdfFile ? (
                          <div className="flex flex-col items-center">
                            <FileText className="w-12 h-12 text-green-500 mb-2" />
                            <p className="text-sm font-medium text-green-700">{pdfFile.name}</p>
                            <p className="text-xs text-green-600">
                              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setPdfFile(null);
                                const input = document.getElementById('pdf') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                              className="mt-2"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700">Clique para selecionar ou arraste um PDF</p>
                            <p className="text-xs text-gray-500 mt-1">PDF até 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {editingAula?.pdfName && !pdfFile && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-700">Arquivo atual: {editingAula.pdfName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={Boolean(
                    uploading ||
                    !formData.nome ||
                    !formData.descricao ||
                    (formData.linkYoutube && formData.linkYoutube.trim() && !isValidYouTubeUrl(formData.linkYoutube))
                  )}
                  className="bg-[#00979D] hover:bg-[#007a85]"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      {editingAula ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingAula ? 'Atualizar Aula' : 'Criar Aula'}
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