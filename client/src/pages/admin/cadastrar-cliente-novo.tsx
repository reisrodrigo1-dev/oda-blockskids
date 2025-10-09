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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Trash2, Edit, Plus, Building2, MapPin, Phone, Mail, FileText, 
  Users, CheckCircle, AlertCircle, UserPlus, GraduationCap, X, Eye 
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { Checkbox } from '../../components/ui/checkbox';

interface Professor {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cursosIds: string[];
}

interface Cliente {
  id?: string;
  tipo: 'empresa' | 'prefeitura';
  // Dados básicos
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  
  // Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  
  // Contato
  telefone: string;
  celular?: string;
  email: string;
  site?: string;
  
  // Responsável
  nomeResponsavel: string;
  cargoResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
  senhaResponsavel: string;
  
  // Professores
  professores: Professor[];
  
  // Observações
  observacoes?: string;
  
  // Logo da empresa/prefeitura
  logoBase64?: string;
  
  createdAt?: Date;
}

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
}

export default function CadastrarClienteNovo() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dados-basicos');
  
  // Form data
  const [formData, setFormData] = useState<Cliente>({
    tipo: 'empresa',
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    celular: '',
    email: '',
    site: '',
    nomeResponsavel: '',
    cargoResponsavel: '',
    emailResponsavel: '',
    telefoneResponsavel: '',
    senhaResponsavel: '',
    professores: [],
    observacoes: '',
    logoBase64: '',
  });

  // Professor form
  const [professorForm, setProfessorForm] = useState<Professor>({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cursosIds: [],
  });
  const [selectedCursos, setSelectedCursos] = useState<string[]>([]);
  const [isAddingProfessor, setIsAddingProfessor] = useState(false);
  const [editingProfessorIndex, setEditingProfessorIndex] = useState<number | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load clientes
      const clientesQuery = query(collection(db, 'clientes'), orderBy('createdAt', 'desc'));
      const clientesSnapshot = await getDocs(clientesQuery);
      const clientesData = clientesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Cliente[];
      setClientes(clientesData);

      // Load cursos
      const cursosSnapshot = await getDocs(collection(db, 'cursos'));
      const cursosData = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Curso[];
      setCursos(cursosData);
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

  // Format CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  // Format CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  // Format Phone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  // Buscar CEP
  const buscarCEP = async (cep: string) => {
    const cepNumbers = cep.replace(/\D/g, '');
    if (cepNumbers.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching CEP:', error);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.razaoSocial.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'A razão social é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    // CNPJ obrigatório apenas para empresas
    if (formData.tipo === 'empresa' && !formData.cnpj.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O CNPJ é obrigatório para empresas',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O email é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.senhaResponsavel.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'A senha do responsável é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    if (formData.senhaResponsavel.length < 6) {
      toast({
        title: 'Erro de validação',
        description: 'A senha do responsável deve ter pelo menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const clienteData = {
        ...formData,
        createdAt: new Date(),
      };

      if (editingCliente?.id) {
        await updateDoc(doc(db, 'clientes', editingCliente.id), clienteData);
        toast({
          title: 'Sucesso',
          description: 'Cliente atualizado com sucesso!',
        });
      } else {
        await addDoc(collection(db, 'clientes'), clienteData);
        toast({
          title: 'Sucesso',
          description: 'Cliente cadastrado com sucesso!',
        });
      }

      handleDialogClose();
      loadData();
    } catch (error) {
      console.error('Error saving cliente:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar cliente',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit
  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData(cliente);
    setLogoPreview(cliente.logoBase64 || '');
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await deleteDoc(doc(db, 'clientes', id));
      toast({
        title: 'Sucesso',
        description: 'Cliente excluído com sucesso!',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting cliente:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir cliente',
        variant: 'destructive',
      });
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCliente(null);
    setFormData({
      tipo: 'empresa',
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      telefone: '',
      celular: '',
      email: '',
      site: '',
      nomeResponsavel: '',
      cargoResponsavel: '',
      emailResponsavel: '',
      telefoneResponsavel: '',
      senhaResponsavel: '',
      professores: [],
      observacoes: '',
      logoBase64: '',
    });
    setLogoPreview('');
    setActiveTab('dados-basicos');
    setIsAddingProfessor(false);
    setProfessorForm({ nome: '', email: '', senha: '', telefone: '', cursosIds: [] });
    setSelectedCursos([]);
  };

  // Add/Edit professor
  const handleSaveProfessor = () => {
    if (!professorForm.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do professor é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!professorForm.email.trim()) {
      toast({
        title: 'Erro',
        description: 'Email do professor é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!professorForm.senha.trim()) {
      toast({
        title: 'Erro',
        description: 'Senha do professor é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    if (professorForm.senha.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (selectedCursos.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione pelo menos um curso',
        variant: 'destructive',
      });
      return;
    }

    const novoProfessor = {
      ...professorForm,
      cursosIds: selectedCursos,
    };

    if (editingProfessorIndex !== null) {
      // Edit existing professor
      const professoresAtualizados = [...formData.professores];
      professoresAtualizados[editingProfessorIndex] = novoProfessor;
      setFormData({ ...formData, professores: professoresAtualizados });
    } else {
      // Add new professor
      setFormData({ ...formData, professores: [...formData.professores, novoProfessor] });
    }

    // Reset professor form
    setProfessorForm({ nome: '', email: '', senha: '', telefone: '', cursosIds: [] });
    setSelectedCursos([]);
    setIsAddingProfessor(false);
    setEditingProfessorIndex(null);
  };

  // Remove professor
  const handleRemoveProfessor = (index: number) => {
    const professoresAtualizados = formData.professores.filter((_, i) => i !== index);
    setFormData({ ...formData, professores: professoresAtualizados });
  };

  // Edit professor
  const handleEditProfessor = (index: number) => {
    const professor = formData.professores[index];
    setProfessorForm({
      nome: professor.nome,
      email: professor.email,
      senha: professor.senha,
      telefone: professor.telefone,
      cursosIds: professor.cursosIds,
    });
    setSelectedCursos(professor.cursosIds);
    setEditingProfessorIndex(index);
    setIsAddingProfessor(true);
  };

  // Toggle curso selection
  const toggleCursoSelection = (cursoId: string) => {
    setSelectedCursos(prev => {
      if (prev.includes(cursoId)) {
        return prev.filter(id => id !== cursoId);
      } else {
        return [...prev, cursoId];
      }
    });
  };

  // Get curso by ID
  const getCursoById = (id: string) => {
    return cursos.find(curso => curso.id === id);
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem válida',
        variant: 'destructive',
      });
      return;
    }

    // Verificar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 2MB',
        variant: 'destructive',
      });
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

  // Remove logo
  const handleRemoveLogo = () => {
    setFormData({ ...formData, logoBase64: '' });
    setLogoPreview('');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-3xl">🏢</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cadastrar Cliente</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie empresas e prefeituras com professores e cursos associados
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🏢</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{clientes.length}</div>
            <div className="text-sm text-gray-600">Total de Clientes</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🏛️</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {clientes.filter(c => c.tipo === 'prefeitura').length}
            </div>
            <div className="text-sm text-gray-600">Prefeituras</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🏭</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {clientes.filter(c => c.tipo === 'empresa').length}
            </div>
            <div className="text-sm text-gray-600">Empresas</div>
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
            <div className="text-sm text-gray-600">Novo Cliente</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Clientes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando clientes...</p>
                </div>
              ) : clientes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar primeiro cliente
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Razão Social</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Cidade/UF</TableHead>
                      <TableHead>Professores</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cliente.tipo === 'prefeitura' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {cliente.tipo === 'prefeitura' ? '🏛️ Prefeitura' : '🏭 Empresa'}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{cliente.razaoSocial}</TableCell>
                        <TableCell>{cliente.cnpj}</TableCell>
                        <TableCell>{cliente.cidade}/{cliente.estado}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {cliente.professores?.length || 0} professores
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(cliente)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(cliente.id!)}
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
          <h3 className="text-2xl font-bold mb-3">Sistema de Gestão de Clientes</h3>
          <p className="max-w-2xl mx-auto">
            Cadastre empresas e prefeituras, gerencie professores e associe cursos de forma integrada.
          </p>
        </div>

        {/* Dialog for Create/Edit - Continued in next part due to length */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto !bg-white border-gray-200">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00979D] rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-gray-900">
                    {editingCliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingCliente ? 'Atualize as informações do cliente' : 'Preencha os dados para cadastrar um novo cliente'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="responsavel">Responsável</TabsTrigger>
                  <TabsTrigger value="professores">Professores</TabsTrigger>
                </TabsList>

                {/* Tab 1: Dados Básicos */}
                <TabsContent value="dados-basicos" className="space-y-4">
                  {/* Upload de Logo */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Logo da {formData.tipo === 'empresa' ? 'Empresa' : 'Prefeitura'}
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Esta logo será exibida nos dashboards de professores e responsáveis (máx 2MB)
                    </p>
                    
                    {logoPreview ? (
                      <div className="flex items-start gap-4">
                        <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="max-w-[200px] max-h-[100px] object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveLogo}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remover Logo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">Tipo de Cliente *</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tipo"
                            value="empresa"
                            checked={formData.tipo === 'empresa'}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'empresa' | 'prefeitura' })}
                            className="w-4 h-4 text-[#00979D]"
                          />
                          <span className="text-sm">🏭 Empresa</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tipo"
                            value="prefeitura"
                            checked={formData.tipo === 'prefeitura'}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'empresa' | 'prefeitura' })}
                            className="w-4 h-4 text-[#00979D]"
                          />
                          <span className="text-sm">🏛️ Prefeitura</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="razaoSocial">Razão Social *</Label>
                      <Input
                        id="razaoSocial"
                        value={formData.razaoSocial}
                        onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                        placeholder="Digite a razão social"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                      <Input
                        id="nomeFantasia"
                        value={formData.nomeFantasia}
                        onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                        placeholder="Digite o nome fantasia"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cnpj">
                        CNPJ {formData.tipo === 'empresa' ? '*' : '(opcional)'}
                      </Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                        placeholder="00.000.000/0000-00"
                        className="bg-white"
                        required={formData.tipo === 'empresa'}
                      />
                    </div>

                    {formData.tipo === 'empresa' && (
                      <div>
                        <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                        <Input
                          id="inscricaoEstadual"
                          value={formData.inscricaoEstadual}
                          onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                          placeholder="Digite a inscrição estadual"
                          className="bg-white"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="inscricaoMunicipal">
                        {formData.tipo === 'empresa' ? 'Inscrição Municipal' : 'Código IBGE (opcional)'}
                      </Label>
                      <Input
                        id="inscricaoMunicipal"
                        value={formData.inscricaoMunicipal}
                        onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                        placeholder={formData.tipo === 'empresa' ? 'Digite a inscrição municipal' : 'Código IBGE do município'}
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                        placeholder="(00) 00000-0000"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="celular">Celular</Label>
                      <Input
                        id="celular"
                        value={formData.celular}
                        onChange={(e) => setFormData({ ...formData, celular: formatPhone(e.target.value) })}
                        placeholder="(00) 00000-0000"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@exemplo.com"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="site">Site</Label>
                      <Input
                        id="site"
                        value={formData.site}
                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                        placeholder="www.exemplo.com"
                        className="bg-white"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Endereço */}
                <TabsContent value="endereco" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => {
                          const cep = formatCEP(e.target.value);
                          setFormData({ ...formData, cep });
                          if (cep.length === 9) buscarCEP(cep);
                        }}
                        placeholder="00000-000"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="logradouro">Logradouro *</Label>
                      <Input
                        id="logradouro"
                        value={formData.logradouro}
                        onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                        placeholder="Rua, Avenida, etc."
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                        placeholder="123"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                        placeholder="Sala, Andar, etc."
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        placeholder="Nome do bairro"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        placeholder="Nome da cidade"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                        placeholder="UF"
                        maxLength={2}
                        className="bg-white"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Responsável */}
                <TabsContent value="responsavel" className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <strong>Importante:</strong> Defina uma senha segura para o responsável. Esta senha será usada para acesso ao sistema.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
                      <Input
                        id="nomeResponsavel"
                        value={formData.nomeResponsavel}
                        onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
                        placeholder="Nome completo"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cargoResponsavel">Cargo *</Label>
                      <Input
                        id="cargoResponsavel"
                        value={formData.cargoResponsavel}
                        onChange={(e) => setFormData({ ...formData, cargoResponsavel: e.target.value })}
                        placeholder="Ex: Diretor, Coordenador"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="emailResponsavel">E-mail do Responsável *</Label>
                      <Input
                        id="emailResponsavel"
                        type="email"
                        value={formData.emailResponsavel}
                        onChange={(e) => setFormData({ ...formData, emailResponsavel: e.target.value })}
                        placeholder="email@exemplo.com"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefoneResponsavel">Telefone do Responsável *</Label>
                      <Input
                        id="telefoneResponsavel"
                        value={formData.telefoneResponsavel}
                        onChange={(e) => setFormData({ ...formData, telefoneResponsavel: formatPhone(e.target.value) })}
                        placeholder="(00) 00000-0000"
                        className="bg-white"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="senhaResponsavel" className="flex items-center gap-2">
                        Senha de Acesso *
                        <span className="text-xs text-gray-500 font-normal">(Mínimo 6 caracteres)</span>
                      </Label>
                      <Input
                        id="senhaResponsavel"
                        type="password"
                        value={formData.senhaResponsavel}
                        onChange={(e) => setFormData({ ...formData, senhaResponsavel: e.target.value })}
                        placeholder="Digite uma senha segura"
                        className="bg-white"
                        minLength={6}
                        required
                      />
                      {formData.senhaResponsavel && formData.senhaResponsavel.length < 6 && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          A senha deve ter pelo menos 6 caracteres
                        </p>
                      )}
                      {formData.senhaResponsavel && formData.senhaResponsavel.length >= 6 && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Senha válida
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        placeholder="Informações adicionais sobre o cliente"
                        rows={4}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Professores */}
                <TabsContent value="professores" className="space-y-4">
                  {/* List of Professores */}
                  {formData.professores.length > 0 && (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 mb-4">
                      {formData.professores.map((professor, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#00979D]" />
                                <span className="font-medium text-gray-900">{professor.nome}</span>
                              </div>
                              <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  {professor.email}
                                </div>
                                {professor.telefone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    {professor.telefone}
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Eye className="w-3 h-3" />
                                  <span className="text-xs text-gray-500">Senha: ••••••</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {professor.cursosIds.map(cursoId => {
                                    const curso = getCursoById(cursoId);
                                    return curso ? (
                                      <span key={cursoId} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        {curso.nome}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProfessor(index)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveProfessor(index)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Professor Form */}
                  {!isAddingProfessor ? (
                    <Button
                      type="button"
                      onClick={() => setIsAddingProfessor(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar Professor
                    </Button>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">
                          {editingProfessorIndex !== null ? 'Editar Professor' : 'Novo Professor'}
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsAddingProfessor(false);
                            setProfessorForm({ nome: '', email: '', senha: '', telefone: '', cursosIds: [] });
                            setSelectedCursos([]);
                            setEditingProfessorIndex(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="professorNome">Nome *</Label>
                          <Input
                            id="professorNome"
                            value={professorForm.nome}
                            onChange={(e) => setProfessorForm({ ...professorForm, nome: e.target.value })}
                            placeholder="Nome do professor"
                            className="bg-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="professorEmail">E-mail *</Label>
                          <Input
                            id="professorEmail"
                            type="email"
                            value={professorForm.email}
                            onChange={(e) => setProfessorForm({ ...professorForm, email: e.target.value })}
                            placeholder="email@exemplo.com"
                            className="bg-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="professorSenha">Senha *</Label>
                          <Input
                            id="professorSenha"
                            type="password"
                            value={professorForm.senha}
                            onChange={(e) => setProfessorForm({ ...professorForm, senha: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                            className="bg-white"
                            minLength={6}
                          />
                        </div>

                        <div>
                          <Label htmlFor="professorTelefone">Telefone</Label>
                          <Input
                            id="professorTelefone"
                            value={professorForm.telefone}
                            onChange={(e) => setProfessorForm({ ...professorForm, telefone: formatPhone(e.target.value) })}
                            placeholder="(00) 00000-0000"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      {/* Cursos Selection */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Cursos do Professor * ({selectedCursos.length} selecionados)
                        </Label>
                        {cursos.length === 0 ? (
                          <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                            <p className="text-sm text-yellow-700">
                              Nenhum curso cadastrado. Cadastre cursos primeiro.
                            </p>
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto bg-white">
                            {cursos.map((curso) => (
                              <div
                                key={curso.id}
                                className={`p-3 hover:bg-gray-50 transition-colors ${
                                  selectedCursos.includes(curso.id!)
                                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                    : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={`curso-${curso.id}`}
                                    checked={selectedCursos.includes(curso.id!)}
                                    onCheckedChange={() => toggleCursoSelection(curso.id!)}
                                    className="mt-1"
                                  />
                                  <label
                                    htmlFor={`curso-${curso.id}`}
                                    className="flex-1 cursor-pointer"
                                  >
                                    <div className="font-medium text-sm text-gray-900">{curso.nome}</div>
                                    <div className="text-xs text-gray-600 mt-1">{curso.descricao}</div>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddingProfessor(false);
                            setProfessorForm({ nome: '', email: '', senha: '', telefone: '', cursosIds: [] });
                            setSelectedCursos([]);
                            setEditingProfessorIndex(null);
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSaveProfessor}
                          className="bg-[#00979D] hover:bg-[#007a85]"
                        >
                          {editingProfessorIndex !== null ? 'Atualizar' : 'Adicionar'}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

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
                  disabled={saving}
                  className="bg-[#00979D] hover:bg-[#007a85]"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      {editingCliente ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingCliente ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
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
