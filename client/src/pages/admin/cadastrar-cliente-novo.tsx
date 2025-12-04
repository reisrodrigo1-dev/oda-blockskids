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
  Users, CheckCircle, AlertCircle, UserPlus, GraduationCap, X, Eye, Download 
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { Checkbox } from '../../components/ui/checkbox';
import * as XLSX from 'xlsx';

interface Professor {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cursosIds: string[];
}

interface Aluno {
  id?: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  turmasIds: string[]; // Lista de turmas em que o aluno está matriculado
  clienteId?: string; // Referência ao cliente (empresa/prefeitura)
  // Dados do responsável
  nomeResponsavel: string;
  emailResponsavel: string;
  whatsappResponsavel: string;
  senha: string; // Gerada automaticamente baseada no CPF
  createdAt?: Date;
}

interface Turma {
  id?: string;
  nome: string;
  codigo: string; // Código único para identificação da turma
  descricao: string;
  clienteId: string; // Referência ao cliente
  professorId: string; // Professor responsável pela turma
  cursoId: string; // Curso da turma
  alunosIds: string[]; // Lista de alunos matriculados
  anoLetivo: string; // Ex: "2024"
  semestre: string; // Ex: "1" ou "2"
  status: 'ativa' | 'inativa' | 'concluida';
  createdAt?: Date;
}

interface Matricula {
  id?: string;
  alunoId: string;
  turmaId: string;
  status: 'ativa' | 'inativa' | 'concluida' | 'trancada';
  dataMatricula: Date;
  dataConclusao?: Date;
  createdAt?: Date;
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
  
  // Estados para alunos
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isAlunoDialogOpen, setIsAlunoDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [savingAluno, setSavingAluno] = useState(false);
  const [selectedClienteForAlunos, setSelectedClienteForAlunos] = useState<string>('');
  const [alunoFormData, setAlunoFormData] = useState<Aluno>({
    nome: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    turmasIds: [],
    nomeResponsavel: '',
    emailResponsavel: '',
    whatsappResponsavel: '',
    senha: '',
  });
  const [selectedCursosAluno, setSelectedCursosAluno] = useState<string[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  
  // Estados para turmas
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isTurmaDialogOpen, setIsTurmaDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [savingTurma, setSavingTurma] = useState(false);
  const [selectedClienteForTurmas, setSelectedClienteForTurmas] = useState<string>('');
  const [turmaFormData, setTurmaFormData] = useState<Turma>({
    nome: '',
    codigo: '',
    descricao: '',
    clienteId: '',
    professorId: '',
    cursoId: '',
    alunosIds: [],
    anoLetivo: new Date().getFullYear().toString(),
    semestre: '1',
    status: 'ativa',
  });
  const [selectedAlunosTurma, setSelectedAlunosTurma] = useState<string[]>([]);
  
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

      // Load alunos
      const alunosQuery = query(collection(db, 'alunos'), orderBy('createdAt', 'desc'));
      const alunosSnapshot = await getDocs(alunosQuery);
      const alunosData = alunosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Aluno[];
      setAlunos(alunosData);

      // Load turmas
      const turmasQuery = query(collection(db, 'turmas'), orderBy('createdAt', 'desc'));
      const turmasSnapshot = await getDocs(turmasQuery);
      const turmasData = turmasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Turma[];
      setTurmas(turmasData);
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

  // Format CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  // Validate CPF
  const isValidCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(numbers)) return false;
    
    // Calculate verification digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(numbers[9])) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(numbers[10])) return false;
    
    return true;
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

  // Toggle curso selection for alunos
  const toggleCursoSelectionAluno = (cursoId: string) => {
    setSelectedCursosAluno(prev => {
      if (prev.includes(cursoId)) {
        return prev.filter(id => id !== cursoId);
      } else {
        return [...prev, cursoId];
      }
    });
  };

  // Toggle curso selection for professores
  const toggleCursoSelection = (cursoId: string) => {
    setSelectedCursos(prev => {
      if (prev.includes(cursoId)) {
        return prev.filter(id => id !== cursoId);
      } else {
        return [...prev, cursoId];
      }
    });
  };

  // Handle aluno form submission
  const handleSubmitAluno = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!alunoFormData.nome.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome do aluno é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!alunoFormData.email.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O email do aluno é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!alunoFormData.cpf.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O CPF do aluno é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidCPF(alunoFormData.cpf)) {
      toast({
        title: 'Erro de validação',
        description: 'CPF inválido',
        variant: 'destructive',
      });
      return;
    }

    if (!alunoFormData.dataNascimento) {
      toast({
        title: 'Erro de validação',
        description: 'A data de nascimento é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    if (!alunoFormData.nomeResponsavel.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome do responsável é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!alunoFormData.emailResponsavel.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O email do responsável é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!alunoFormData.whatsappResponsavel.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O WhatsApp do responsável é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (selectedCursosAluno.length === 0) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione pelo menos uma turma',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedClienteForAlunos) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione um cliente',
        variant: 'destructive',
      });
      return;
    }

    setSavingAluno(true);

    try {
      // Gerar senha baseada no CPF (apenas números)
      const senhaGerada = alunoFormData.cpf.replace(/\D/g, '');
      
      const alunoData = {
        ...alunoFormData,
        turmasIds: selectedCursosAluno,
        clienteId: selectedClienteForAlunos,
        senha: senhaGerada,
        createdAt: new Date(),
      };

      if (editingAluno?.id) {
        await updateDoc(doc(db, 'alunos', editingAluno.id), alunoData);
        toast({
          title: 'Sucesso',
          description: 'Aluno atualizado com sucesso!',
        });
      } else {
        await addDoc(collection(db, 'alunos'), alunoData);
        toast({
          title: 'Sucesso',
          description: 'Aluno cadastrado com sucesso!',
        });
      }

      handleCloseAlunoDialog();
      loadData();
    } catch (error) {
      console.error('Error saving aluno:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar aluno',
        variant: 'destructive',
      });
    } finally {
      setSavingAluno(false);
    }
  };

  // Handle edit aluno
  const handleEditAluno = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setAlunoFormData(aluno);
    setSelectedCursosAluno(aluno.turmasIds);
    setSelectedClienteForAlunos(aluno.clienteId || '');
    setIsAlunoDialogOpen(true);
  };

  // Handle delete aluno
  const handleDeleteAluno = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

    try {
      await deleteDoc(doc(db, 'alunos', id));
      toast({
        title: 'Sucesso',
        description: 'Aluno excluído com sucesso!',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting aluno:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir aluno',
        variant: 'destructive',
      });
    }
  };

  // Handle close aluno dialog
  const handleCloseAlunoDialog = () => {
    setIsAlunoDialogOpen(false);
    setEditingAluno(null);
    setAlunoFormData({
      nome: '',
      email: '',
      cpf: '',
      dataNascimento: '',
      turmasIds: [],
      nomeResponsavel: '',
      emailResponsavel: '',
      whatsappResponsavel: '',
      senha: '',
    });
    setSelectedCursosAluno([]);
    setSelectedClienteForAlunos('');
  };

  // Handle Excel upload
  const handleExcelUpload = async (file: File) => {
    if (!selectedClienteForAlunos) {
      toast({
        title: 'Erro',
        description: 'Selecione um cliente primeiro',
        variant: 'destructive',
      });
      return;
    }

    setUploadingExcel(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const alunosData = [];
          const skippedAlunos = [];
          
          // Pular cabeçalho e processar dados
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row.length >= 7) {
              const [nome, email, cpf, dataNascimento, nomeResponsavel, emailResponsavel, whatsappResponsavel, codigoTurma] = row;

              if (nome && email && cpf && dataNascimento && nomeResponsavel && emailResponsavel && whatsappResponsavel) {
                // Gerar senha baseada no CPF
                const senhaGerada = cpf.toString().replace(/\D/g, '');

                // Array de turmas para este aluno
                let turmasIds: string[] = [];

                // Se foi fornecido um código de turma, tentar encontrá-la
                if (codigoTurma && codigoTurma.toString().trim() !== '') {
                  const turmaEncontrada = turmas.find(t => 
                    t.codigo && t.codigo.toUpperCase() === codigoTurma.toString().toUpperCase() && 
                    t.clienteId === selectedClienteForAlunos
                  );
                  
                  if (turmaEncontrada && turmaEncontrada.id) {
                    turmasIds = [turmaEncontrada.id];
                  } else {
                    console.warn(`Turma com código ${codigoTurma} não encontrada para o aluno ${nome}`);
                  }
                }

                alunosData.push({
                  nome: nome.toString().trim(),
                  email: email.toString().trim(),
                  cpf: cpf.toString().trim(),
                  dataNascimento: dataNascimento.toString().trim(),
                  nomeResponsavel: nomeResponsavel.toString().trim(),
                  emailResponsavel: emailResponsavel.toString().trim(),
                  whatsappResponsavel: whatsappResponsavel.toString().trim(),
                  senha: senhaGerada,
                  turmasIds: turmasIds,
                  clienteId: selectedClienteForAlunos,
                  createdAt: new Date(),
                });
              } else {
                console.warn(`Linha ${i + 1} incompleta, pulando...`);
                skippedAlunos.push({ linha: i + 1, motivo: 'Campos obrigatórios faltando' });
              }
            }
          }

          // Salvar alunos no Firestore
          const savedCount = [];
          for (const aluno of alunosData) {
            try {
              const docRef = await addDoc(collection(db, 'alunos'), aluno);
              savedCount.push(aluno);
              
              // Se o aluno foi associado a uma turma, atualizar a turma também
              if (aluno.turmasIds.length > 0) {
                for (const turmaId of aluno.turmasIds) {
                  const turmaRef = doc(db, 'turmas', turmaId);
                  const turmaDoc = await getDocs(query(collection(db, 'turmas')));
                  const turmaData = turmaDoc.docs.find(d => d.id === turmaId)?.data();
                  
                  if (turmaData) {
                    const alunosIdsAtualizados = [...(turmaData.alunosIds || []), docRef.id];
                    await updateDoc(turmaRef, { alunosIds: alunosIdsAtualizados });
                  }
                }
              }
            } catch (error) {
              console.error('Erro ao salvar aluno:', aluno, error);
              skippedAlunos.push({ nome: aluno.nome, motivo: 'Erro ao salvar no banco' });
            }
          }

          // Mensagem de sucesso com detalhes
          let message = `${savedCount.length} alunos importados com sucesso!`;
          if (skippedAlunos.length > 0) {
            message += ` ${skippedAlunos.length} registros foram pulados.`;
          }

          toast({
            title: 'Sucesso',
            description: message,
          });

          setExcelFile(null);
          loadData();

        } catch (error) {
          console.error('Erro ao processar Excel:', error);
          toast({
            title: 'Erro',
            description: 'Erro ao processar arquivo Excel',
            variant: 'destructive',
          });
        } finally {
          setUploadingExcel(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Erro ao fazer upload do Excel:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload do Excel',
        variant: 'destructive',
      });
      setUploadingExcel(false);
    }
  };

  // Download Excel template
  const downloadExcelTemplate = () => {
    const templateData = [
      ['Nome', 'Email', 'CPF', 'Data Nascimento (YYYY-MM-DD)', 'Nome Responsável', 'Email Responsável', 'WhatsApp Responsável', 'Código Turma (Opcional)'],
      ['João Silva Santos', 'joao.silva@email.com', '123.456.789-00', '2010-05-15', 'Maria Silva Santos', 'maria.silva@email.com', '(11) 99999-9999', 'TURMA001'],
      ['Ana Carolina Oliveira', 'ana.oliveira@email.com', '987.654.321-00', '2011-03-22', 'José Oliveira', 'jose.oliveira@email.com', '(11) 88888-8888', 'ROBOTICA-A'],
      ['Pedro Henrique Lima', 'pedro.lima@email.com', '456.789.123-00', '2009-12-10', 'Carla Lima', 'carla.lima@email.com', '(11) 77777-7777', ''],
      ['Sofia Martins Costa', 'sofia.costa@email.com', '321.654.987-00', '2012-08-30', 'Roberto Costa', 'roberto.costa@email.com', '(11) 66666-6666', ''],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alunos');

    // Ajustar largura das colunas
    worksheet['!cols'] = [
      { wch: 25 }, // Nome
      { wch: 30 }, // Email
      { wch: 18 }, // CPF
      { wch: 28 }, // Data Nascimento
      { wch: 25 }, // Nome Responsável
      { wch: 30 }, // Email Responsável
      { wch: 20 }, // WhatsApp
      { wch: 25 }, // Código Turma
    ];

    XLSX.writeFile(workbook, 'template_importacao_alunos.xlsx');

    toast({
      title: 'Template baixado',
      description: 'O arquivo template_importacao_alunos.xlsx foi baixado com exemplos de preenchimento!',
    });
  };

  // Handle turma form submission
  const handleSubmitTurma = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!turmaFormData.nome.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome da turma é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!turmaFormData.codigo.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O código da turma é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    // Verificar se o código já existe (exceto para a turma sendo editada)
    const codigoExistente = turmas.find(t => 
      t.codigo && t.codigo.toUpperCase() === turmaFormData.codigo.toUpperCase() && 
      (!editingTurma || t.id !== editingTurma.id)
    );
    if (codigoExistente) {
      toast({
        title: 'Erro de validação',
        description: 'Este código de turma já existe. Escolha um código único.',
        variant: 'destructive',
      });
      return;
    }

    if (!turmaFormData.clienteId) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione um cliente',
        variant: 'destructive',
      });
      return;
    }

    if (!turmaFormData.professorId) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione um professor',
        variant: 'destructive',
      });
      return;
    }

    if (!turmaFormData.cursoId) {
      toast({
        title: 'Erro de validação',
        description: 'Selecione um curso',
        variant: 'destructive',
      });
      return;
    }

    setSavingTurma(true);

    try {
      const turmaData = {
        ...turmaFormData,
        alunosIds: selectedAlunosTurma,
        createdAt: new Date(),
      };

      if (editingTurma?.id) {
        await updateDoc(doc(db, 'turmas', editingTurma.id), turmaData);
        toast({
          title: 'Sucesso',
          description: 'Turma atualizada com sucesso!',
        });
      } else {
        await addDoc(collection(db, 'turmas'), turmaData);
        toast({
          title: 'Sucesso',
          description: 'Turma cadastrada com sucesso!',
        });
      }

      handleCloseTurmaDialog();
      loadData();
    } catch (error) {
      console.error('Error saving turma:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar turma',
        variant: 'destructive',
      });
    } finally {
      setSavingTurma(false);
    }
  };

  // Handle edit turma
  const handleEditTurma = (turma: Turma) => {
    setEditingTurma(turma);
    setTurmaFormData({
      ...turma,
      codigo: turma.codigo || '', // Garantir que código nunca seja undefined
      descricao: turma.descricao || '',
    });
    setSelectedAlunosTurma(turma.alunosIds || []);
    setSelectedClienteForTurmas(turma.clienteId);
    setIsTurmaDialogOpen(true);
  };

  // Handle delete turma
  const handleDeleteTurma = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return;

    try {
      await deleteDoc(doc(db, 'turmas', id));
      toast({
        title: 'Sucesso',
        description: 'Turma excluída com sucesso!',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting turma:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir turma',
        variant: 'destructive',
      });
    }
  };

  // Handle close turma dialog
  const handleCloseTurmaDialog = () => {
    setIsTurmaDialogOpen(false);
    setEditingTurma(null);
    setTurmaFormData({
      nome: '',
      codigo: '',
      descricao: '',
      clienteId: '',
      professorId: '',
      cursoId: '',
      alunosIds: [],
      anoLetivo: new Date().getFullYear().toString(),
      semestre: '1',
      status: 'ativa',
    });
    setSelectedAlunosTurma([]);
    setSelectedClienteForTurmas('');
  };

  // Toggle aluno selection for turma
  const toggleAlunoSelectionTurma = (alunoId: string) => {
    setSelectedAlunosTurma(prev => {
      if (prev.includes(alunoId)) {
        return prev.filter(id => id !== alunoId);
      } else {
        return [...prev, alunoId];
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gestão de Clientes e Alunos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie empresas, prefeituras, professores e mantenha a base completa de alunos
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
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
            <div className="text-4xl mb-3">👨‍🎓</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{alunos.length}</div>
            <div className="text-sm text-gray-600">Alunos</div>
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
        <Tabs defaultValue="clientes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="alunos">Base de Alunos</TabsTrigger>
            <TabsTrigger value="turmas">Turmas</TabsTrigger>
          </TabsList>

          {/* Tab Clientes */}
          <TabsContent value="clientes" className="space-y-6">
            {/* Quick Stats Clientes */}
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
          </TabsContent>

          {/* Tab Alunos */}
          <TabsContent value="alunos" className="space-y-6">
            {/* Quick Stats Alunos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">👨‍🎓</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{alunos.length}</div>
                <div className="text-sm text-gray-600">Total de Alunos</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">📚</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {alunos.reduce((acc, aluno) => acc + aluno.turmasIds.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Matrículas</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">🏢</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {new Set(alunos.map(a => a.clienteId)).size}
                </div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">➕</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  <Button
                    size="sm"
                    onClick={() => setIsAlunoDialogOpen(true)}
                    className="bg-[#00979D] hover:bg-[#007a85]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">Novo Aluno</div>
              </div>
            </div>

            {/* Filtros e Upload Excel */}
            <Card className="mb-6 border-2 border-blue-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  📚 Filtros e Importação de Alunos
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Filtre por cliente ou importe múltiplos alunos de uma vez via Excel
                </p>
              </CardHeader>
              <CardContent>
                {/* Filtro por Cliente */}
                <div className="mb-6">
                  <Label htmlFor="clienteFilter" className="text-sm font-bold text-gray-700">Filtrar por Cliente</Label>
                  <select
                    id="clienteFilter"
                    value={selectedClienteForAlunos}
                    onChange={(e) => setSelectedClienteForAlunos(e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-md mt-2"
                  >
                    <option value="">Todos os clientes</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.razaoSocial}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instruções de Formato Excel - SEMPRE VISÍVEL */}
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg">
                  <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                    📋 Formato Obrigatório do Excel para Importação
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna A:</strong> <span className="text-gray-700">Nome completo do aluno</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna B:</strong> <span className="text-gray-700">Email do aluno</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna C:</strong> <span className="text-gray-700">CPF (123.456.789-00)</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna D:</strong> <span className="text-gray-700">Data Nascimento (YYYY-MM-DD)</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna E:</strong> <span className="text-gray-700">Nome do Responsável</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna F:</strong> <span className="text-gray-700">Email do Responsável</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna G:</strong> <span className="text-gray-700">WhatsApp ((11) 99999-9999)</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-200">
                      <strong className="text-blue-800">Coluna H (Opcional):</strong> <span className="text-gray-700">Código Turma</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-400 rounded text-xs">
                    <strong className="text-yellow-900">💡 Dicas Importantes:</strong>
                    <ul className="list-disc list-inside mt-2 text-yellow-800 space-y-1">
                      <li>A primeira linha deve conter os cabeçalhos exatamente como acima</li>
                      <li>Colunas A-G são obrigatórias para importação bem-sucedida</li>
                      <li>A senha será gerada automaticamente baseada no CPF (11 dígitos)</li>
                      <li>Coluna H é opcional - se informada, o aluno será associado automaticamente à turma</li>
                    </ul>
                  </div>
                </div>

                {/* Códigos das Turmas - quando cliente selecionado */}
                {selectedClienteForAlunos && turmas.filter(t => t.clienteId === selectedClienteForAlunos).length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
                    <h3 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                      🎯 Códigos das Turmas Disponíveis para este Cliente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {turmas
                        .filter(t => t.clienteId === selectedClienteForAlunos)
                        .map(turma => (
                          <div key={turma.id} className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all">
                            <div className="flex-1">
                              <span className="font-bold text-gray-900 block">{turma.nome}</span>
                              <div className="text-xs text-gray-600 mt-1">
                                👥 {turma.alunosIds?.length || 0} alunos matriculados
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <div className="text-xs text-gray-500 mb-1">Copie este código →</div>
                              <span className="text-green-700 font-mono bg-green-100 px-3 py-2 rounded font-bold text-sm border-2 border-green-300">
                                {turma.codigo || 'SEM CÓDIGO'}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-300 rounded text-xs text-blue-800">
                      <strong>ℹ️ INFO:</strong> Copie um dos códigos acima para a <strong>Coluna H</strong> do Excel se quiser associar o aluno automaticamente a uma turma durante a importação.
                    </div>
                  </div>
                )}

                {!selectedClienteForAlunos && (
                  <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertCircle className="w-5 h-5" />
                      <strong>Selecione um cliente primeiro!</strong>
                    </div>
                    <p className="text-sm text-orange-700 mt-2">
                      Use o filtro "Filtrar por Cliente" acima para selecionar um cliente antes de importar alunos.
                    </p>
                  </div>
                )}

                {/* Upload de Arquivo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-bold text-gray-700">1. Baixe o template de exemplo</Label>
                    <Button
                      onClick={downloadExcelTemplate}
                      variant="outline"
                      className="w-full border-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-semibold mt-2"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template Excel
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm font-bold text-gray-700">2. Escolha o arquivo Excel preenchido</Label>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="flex-1 p-2 border-2 border-gray-300 rounded-md text-sm w-full mt-2"
                      disabled={!selectedClienteForAlunos}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold text-gray-700">3. Importe os dados</Label>
                    <Button
                      onClick={() => excelFile && handleExcelUpload(excelFile)}
                      disabled={!excelFile || !selectedClienteForAlunos || uploadingExcel}
                      className="bg-green-600 hover:bg-green-700 font-semibold mt-2"
                    >
                      {uploadingExcel ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Importando...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Importar Alunos
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alunos Table */}
            <Card>
              <CardHeader>
                <CardTitle>Alunos Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando alunos...</p>
                  </div>
                ) : alunos.filter(aluno => !selectedClienteForAlunos || aluno.clienteId === selectedClienteForAlunos).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {selectedClienteForAlunos ? 'Nenhum aluno cadastrado para este cliente.' : 'Nenhum aluno cadastrado ainda.'}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsAlunoDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar primeiro aluno
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Data Nascimento</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Contato Responsável</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Turmas</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alunos
                        .filter(aluno => !selectedClienteForAlunos || aluno.clienteId === selectedClienteForAlunos)
                        .map((aluno) => (
                        <TableRow key={aluno.id}>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell>{aluno.email}</TableCell>
                          <TableCell>{aluno.cpf}</TableCell>
                          <TableCell>
                            {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{aluno.nomeResponsavel}</div>
                              <div className="text-gray-500">{aluno.emailResponsavel}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {aluno.whatsappResponsavel}
                            </div>
                          </TableCell>
                          <TableCell>
                            {clientes.find(c => c.id === aluno.clienteId)?.razaoSocial || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(() => {
                                // Filtrar apenas turmas que realmente existem
                                const turmasValidas = aluno.turmasIds.filter(turmaId => 
                                  turmas.some(t => t.id === turmaId)
                                );
                                
                                if (turmasValidas.length === 0) {
                                  return <span className="text-gray-400 text-sm">Sem turma</span>;
                                }
                                
                                return (
                                  <>
                                    {turmasValidas.slice(0, 2).map(turmaId => {
                                      const turma = turmas.find(t => t.id === turmaId);
                                      const codigo = turma?.codigo || 'N/A';
                                      return (
                                        <span key={turmaId} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                          {codigo}
                                        </span>
                                      );
                                    })}
                                    {turmasValidas.length > 2 && (
                                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                        +{turmasValidas.length - 2}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAluno(aluno)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAluno(aluno.id!)}
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
          </TabsContent>

          {/* Tab Turmas */}
          <TabsContent value="turmas" className="space-y-6">
            {/* Quick Stats Turmas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">📚</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{turmas.length}</div>
                <div className="text-sm text-gray-600">Total de Turmas</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">👨‍🎓</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {turmas.reduce((acc, turma) => acc + turma.alunosIds.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Alunos Matriculados</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">🏢</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {new Set(turmas.map(t => t.clienteId)).size}
                </div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">➕</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  <Button
                    size="sm"
                    onClick={() => setIsTurmaDialogOpen(true)}
                    className="bg-[#00979D] hover:bg-[#007a85]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">Nova Turma</div>
              </div>
            </div>

            {/* Filtros Turmas */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clienteTurmaFilter">Filtrar por Cliente</Label>
                    <select
                      id="clienteTurmaFilter"
                      value={selectedClienteForTurmas}
                      onChange={(e) => setSelectedClienteForTurmas(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Todas as turmas</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.razaoSocial}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Turmas Table */}
            <Card>
              <CardHeader>
                <CardTitle>Turmas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando turmas...</p>
                  </div>
                ) : turmas.filter(turma => !selectedClienteForTurmas || turma.clienteId === selectedClienteForTurmas).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {selectedClienteForTurmas ? 'Nenhuma turma cadastrada para este cliente.' : 'Nenhuma turma cadastrada ainda.'}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsTurmaDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar primeira turma
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome da Turma</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Professor</TableHead>
                        <TableHead>Ano/Semestre</TableHead>
                        <TableHead>Alunos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {turmas
                        .filter(turma => !selectedClienteForTurmas || turma.clienteId === selectedClienteForTurmas)
                        .map((turma) => (
                        <TableRow key={turma.id}>
                          <TableCell className="font-medium">{turma.nome}</TableCell>
                          <TableCell>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {turma.codigo}
                            </span>
                          </TableCell>
                          <TableCell>
                            {cursos.find(c => c.id === turma.cursoId)?.nome || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const cliente = clientes.find(c => c.id === turma.clienteId);
                              const professor = cliente?.professores.find(p => p.email === turma.professorId);
                              return professor?.nome || 'N/A';
                            })()}
                          </TableCell>
                          <TableCell>{turma.anoLetivo}/{turma.semestre}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {turma.alunosIds.length} alunos
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              turma.status === 'ativa' 
                                ? 'bg-green-100 text-green-800' 
                                : turma.status === 'inativa'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {turma.status === 'ativa' ? 'Ativa' : turma.status === 'inativa' ? 'Inativa' : 'Concluída'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {clientes.find(c => c.id === turma.clienteId)?.razaoSocial || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTurma(turma)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTurma(turma.id!)}
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
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <div className="mt-12 bg-[#00979D] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Sistema de Gestão de Clientes e Alunos</h3>
          <p className="max-w-2xl mx-auto">
            Cadastre empresas e prefeituras com professores, e gerencie a base completa de alunos com matrículas em cursos.
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

        {/* Dialog for Aluno Create/Edit */}
        <Dialog open={isAlunoDialogOpen} onOpenChange={setIsAlunoDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-white border-gray-200">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00979D] rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-gray-900">
                    {editingAluno ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingAluno ? 'Atualize as informações do aluno' : 'Preencha os dados para cadastrar um novo aluno'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmitAluno} className="space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="alunoNome">Nome Completo *</Label>
                  <Input
                    id="alunoNome"
                    value={alunoFormData.nome}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, nome: e.target.value })}
                    placeholder="Nome completo do aluno"
                    className="bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alunoEmail">E-mail *</Label>
                  <Input
                    id="alunoEmail"
                    type="email"
                    value={alunoFormData.email}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alunoCPF">CPF *</Label>
                  <Input
                    id="alunoCPF"
                    value={alunoFormData.cpf}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, cpf: formatCPF(e.target.value) })}
                    placeholder="000.000.000-00"
                    className="bg-white"
                    required
                  />
                  {alunoFormData.cpf && !isValidCPF(alunoFormData.cpf) && alunoFormData.cpf.length === 14 && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      CPF inválido
                    </p>
                  )}
                  {alunoFormData.cpf && isValidCPF(alunoFormData.cpf) && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      CPF válido
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="alunoDataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="alunoDataNascimento"
                    type="date"
                    value={alunoFormData.dataNascimento}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, dataNascimento: e.target.value })}
                    className="bg-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="alunoNomeResponsavel">Nome do Responsável *</Label>
                  <Input
                    id="alunoNomeResponsavel"
                    value={alunoFormData.nomeResponsavel}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, nomeResponsavel: e.target.value })}
                    placeholder="Nome completo do responsável"
                    className="bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alunoEmailResponsavel">E-mail do Responsável *</Label>
                  <Input
                    id="alunoEmailResponsavel"
                    type="email"
                    value={alunoFormData.emailResponsavel}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, emailResponsavel: e.target.value })}
                    placeholder="email.responsavel@exemplo.com"
                    className="bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alunoWhatsappResponsavel">WhatsApp do Responsável *</Label>
                  <Input
                    id="alunoWhatsappResponsavel"
                    value={alunoFormData.whatsappResponsavel}
                    onChange={(e) => setAlunoFormData({ ...alunoFormData, whatsappResponsavel: formatPhone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    className="bg-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Senha de Acesso</Label>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Senha gerada automaticamente:</span>
                      <span className="font-mono text-lg font-bold text-[#00979D]">
                        {alunoFormData.cpf ? alunoFormData.cpf.replace(/\D/g, '') : 'Digite o CPF primeiro'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      A senha será os números do CPF (11 dígitos)
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="clienteSelect">Cliente/Instituição *</Label>
                  <select
                    id="clienteSelect"
                    value={selectedClienteForAlunos}
                    onChange={(e) => setSelectedClienteForAlunos(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.razaoSocial} ({cliente.tipo === 'prefeitura' ? 'Prefeitura' : 'Empresa'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Turmas Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Turmas do Aluno * ({selectedCursosAluno.length} selecionadas)
                </Label>
                {turmas.filter(turma => !selectedClienteForAlunos || turma.clienteId === selectedClienteForAlunos).length === 0 ? (
                  <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700">
                      {selectedClienteForAlunos ? 'Nenhuma turma cadastrada para este cliente.' : 'Selecione um cliente primeiro.'}
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto bg-white">
                    {turmas
                      .filter(turma => !selectedClienteForAlunos || turma.clienteId === selectedClienteForAlunos)
                      .map((turma) => (
                      <div
                        key={turma.id}
                        className={`p-3 hover:bg-gray-50 transition-colors ${
                          selectedCursosAluno.includes(turma.id!)
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`turma-aluno-${turma.id}`}
                            checked={selectedCursosAluno.includes(turma.id!)}
                            onCheckedChange={() => toggleCursoSelectionAluno(turma.id!)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`turma-aluno-${turma.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-sm text-gray-900">{turma.nome}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {cursos.find(c => c.id === turma.cursoId)?.nome} • {turma.anoLetivo}/{turma.semestre}
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseAlunoDialog}
                  disabled={savingAluno}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingAluno || !selectedClienteForAlunos || selectedCursosAluno.length === 0}
                  className="bg-[#00979D] hover:bg-[#007a85]"
                >
                  {savingAluno ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      {editingAluno ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingAluno ? 'Atualizar Aluno' : 'Cadastrar Aluno'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for Turma Create/Edit */}
        <Dialog open={isTurmaDialogOpen} onOpenChange={setIsTurmaDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-white border-gray-200" aria-describedby="turma-dialog-description">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00979D] rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-gray-900">
                    {editingTurma ? 'Editar Turma' : 'Cadastrar Nova Turma'}
                  </DialogTitle>
                  <p id="turma-dialog-description" className="text-sm text-gray-600 mt-1">
                    {editingTurma ? 'Atualize as informações da turma' : 'Preencha os dados para cadastrar uma nova turma'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmitTurma} className="space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="turmaNome">Nome da Turma *</Label>
                  <Input
                    id="turmaNome"
                    value={turmaFormData.nome}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, nome: e.target.value })}
                    placeholder="Ex: 1º Ano A, Robótica Básica"
                    className="bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="turmaCodigo">Código da Turma *</Label>
                  <Input
                    id="turmaCodigo"
                    value={turmaFormData.codigo}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ex: TURMA001, ROBOTICA-A"
                    className="bg-white"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Código único usado para associações em lote via Excel
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="turmaDescricao">Descrição</Label>
                  <Textarea
                    id="turmaDescricao"
                    value={turmaFormData.descricao}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, descricao: e.target.value })}
                    placeholder="Descrição opcional da turma"
                    rows={3}
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="clienteTurmaSelect">Cliente/Instituição *</Label>
                  <select
                    id="clienteTurmaSelect"
                    value={turmaFormData.clienteId}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, clienteId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.razaoSocial} ({cliente.tipo === 'prefeitura' ? 'Prefeitura' : 'Empresa'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="cursoTurmaSelect">Curso *</Label>
                  <select
                    id="cursoTurmaSelect"
                    value={turmaFormData.cursoId}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, cursoId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione um curso</option>
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="professorTurmaSelect">Professor *</Label>
                  <select
                    id="professorTurmaSelect"
                    value={turmaFormData.professorId}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, professorId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione um professor</option>
                    {clientes.find(c => c.id === turmaFormData.clienteId)?.professores.map(professor => (
                      <option key={professor.email} value={professor.email}>
                        {professor.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="anoLetivo">Ano Letivo *</Label>
                  <Input
                    id="anoLetivo"
                    value={turmaFormData.anoLetivo}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, anoLetivo: e.target.value })}
                    placeholder="2024"
                    className="bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="semestre">Semestre *</Label>
                  <select
                    id="semestre"
                    value={turmaFormData.semestre}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, semestre: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="1">1º Semestre</option>
                    <option value="2">2º Semestre</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="statusTurma">Status *</Label>
                  <select
                    id="statusTurma"
                    value={turmaFormData.status}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, status: e.target.value as 'ativa' | 'inativa' | 'concluida' })}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    required
                  >
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>

              {/* Alunos Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Alunos Matriculados ({selectedAlunosTurma.length} selecionados)
                </Label>
                {alunos.filter(aluno => !turmaFormData.clienteId || aluno.clienteId === turmaFormData.clienteId).length === 0 ? (
                  <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700">
                      {turmaFormData.clienteId ? 'Nenhum aluno cadastrado para este cliente.' : 'Selecione um cliente primeiro.'}
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto bg-white">
                    {alunos
                      .filter(aluno => !turmaFormData.clienteId || aluno.clienteId === turmaFormData.clienteId)
                      .map((aluno) => (
                      <div
                        key={aluno.id}
                        className={`p-3 hover:bg-gray-50 transition-colors ${
                          selectedAlunosTurma.includes(aluno.id!)
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`aluno-turma-${aluno.id}`}
                            checked={selectedAlunosTurma.includes(aluno.id!)}
                            onCheckedChange={() => toggleAlunoSelectionTurma(aluno.id!)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`aluno-turma-${aluno.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-sm text-gray-900">{aluno.nome}</div>
                            <div className="text-xs text-gray-600 mt-1">{aluno.email}</div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseTurmaDialog}
                  disabled={savingTurma}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingTurma || !turmaFormData.clienteId || !turmaFormData.cursoId || !turmaFormData.professorId}
                  className="bg-[#00979D] hover:bg-[#007a85]"
                >
                  {savingTurma ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      {editingTurma ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingTurma ? 'Atualizar Turma' : 'Cadastrar Turma'}
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
