import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, Link, Download, Eye } from 'lucide-react';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './DashboardLayout';

interface Documento {
  id?: string;
  nome: string;
  linkDocumento?: string;
  pdfBase64?: string;
  pdfNome?: string;
  ativo: boolean;
  createdAt?: Date;
}

export default function DocumentosImportantes() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<Documento | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    linkDocumento: '',
    ativo: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      const q = query(collection(db, 'documentos-importantes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Documento[];
      setDocumentos(docs);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os documentos.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Erro',
          description: 'Apenas arquivos PDF são permitidos.',
          variant: 'destructive'
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: 'Erro',
          description: 'O arquivo deve ter no máximo 10MB.',
          variant: 'destructive'
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome do documento é obrigatório.',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.linkDocumento.trim() && !selectedFile) {
      toast({
        title: 'Erro',
        description: 'Você deve fornecer um link ou fazer upload de um PDF.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.linkDocumento.trim() && selectedFile) {
      toast({
        title: 'Erro',
        description: 'Escolha apenas uma opção: link ou upload de PDF.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let documentoData: Omit<Documento, 'id'> = {
        nome: formData.nome.trim(),
        linkDocumento: formData.linkDocumento.trim() || undefined,
        ativo: formData.ativo,
        createdAt: new Date()
      };

      if (selectedFile) {
        const base64 = await convertFileToBase64(selectedFile);
        documentoData.pdfBase64 = base64;
        documentoData.pdfNome = selectedFile.name;
      }

      if (editingDocumento?.id) {
        await updateDoc(doc(db, 'documentos-importantes', editingDocumento.id), documentoData);
        toast({
          title: 'Sucesso',
          description: 'Documento atualizado com sucesso!'
        });
      } else {
        await addDoc(collection(db, 'documentos-importantes'), documentoData);
        toast({
          title: 'Sucesso',
          description: 'Documento criado com sucesso!'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadDocumentos();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o documento.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documentos-importantes', id));
      toast({
        title: 'Sucesso',
        description: 'Documento excluído com sucesso!'
      });
      loadDocumentos();
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o documento.',
        variant: 'destructive'
      });
    }
  };

  const handleToggleStatus = async (id: string, ativo: boolean) => {
    try {
      await updateDoc(doc(db, 'documentos-importantes', id), { ativo: !ativo });
      toast({
        title: 'Sucesso',
        description: `Documento ${!ativo ? 'ativado' : 'desativado'} com sucesso!`
      });
      loadDocumentos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do documento.',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      linkDocumento: '',
      ativo: true
    });
    setSelectedFile(null);
    setEditingDocumento(null);
  };

  const openEditDialog = (documento: Documento) => {
    setEditingDocumento(documento);
    setFormData({
      nome: documento.nome,
      linkDocumento: documento.linkDocumento || '',
      ativo: documento.ativo
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const downloadPDF = (base64: string, nome: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && documentos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documentos Importantes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDocumento ? 'Editar Documento' : 'Novo Documento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Documento *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome do documento"
                  required
                />
              </div>

              <div>
                <Label htmlFor="link">Link do Documento</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.linkDocumento}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkDocumento: e.target.value }))}
                  placeholder="https://exemplo.com/documento"
                />
                <p className="text-sm text-gray-500 mt-1">Ou faça upload de um PDF abaixo</p>
              </div>

              <div>
                <Label htmlFor="pdf">Upload de PDF</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Arquivo selecionado: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                />
                <Label htmlFor="ativo">Documento ativo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : (editingDocumento ? 'Atualizar' : 'Criar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documentos.map((documento) => (
          <Card key={documento.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{documento.nome}</CardTitle>
                <Badge variant={documento.ativo ? 'default' : 'secondary'}>
                  {documento.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documento.linkDocumento && (
                  <div className="flex items-center space-x-2">
                    <Link className="w-4 h-4 text-blue-500" />
                    <a
                      href={documento.linkDocumento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm truncate"
                    >
                      {documento.linkDocumento}
                    </a>
                  </div>
                )}

                {documento.pdfBase64 && (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">{documento.pdfNome}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPDF(documento.pdfBase64!, documento.pdfNome!)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(documento)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o documento "{documento.nome}"?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => documento.id && handleDelete(documento.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <Switch
                    checked={documento.ativo}
                    onCheckedChange={() => documento.id && handleToggleStatus(documento.id, documento.ativo)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {documentos.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
          <p className="text-gray-500">Comece criando seu primeiro documento importante.</p>
        </div>
      )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}