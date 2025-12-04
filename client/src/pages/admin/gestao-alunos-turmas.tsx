import React, { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './DashboardLayout';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, where, addDoc } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Users, GraduationCap, CheckCircle, AlertCircle, Search, Filter, UserPlus, UserMinus, FileText, Download } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import * as XLSX from 'xlsx';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  whatsappResponsavel: string;
  senha: string;
  turmasIds: string[]; // Array de IDs de turmas
  clienteId: string;
  createdAt: Date;
}

interface Turma {
  id: string;
  nome: string;
  codigo: string; // Código único para identificação da turma
  descricao: string;
  clienteId: string;
  professorId: string;
  cursoId: string;
  alunosIds: string[];
  anoLetivo: string;
  semestre: string;
  status: 'ativa' | 'inativa' | 'concluida';
  createdAt: Date;
}

interface Cliente {
  id: string;
  razaoSocial: string;
  tipo: 'empresa' | 'prefeitura';
}

export default function GestaoAlunosTurmas() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState<string>('all');
  const [selectedCliente, setSelectedCliente] = useState<string>('all');
  const [selectedAlunos, setSelectedAlunos] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'add' | 'remove'>('add');
  const [targetTurma, setTargetTurma] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  // Carregar alunos, turmas e clientes
  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar alunos
      const alunosSnapshot = await getDocs(collection(db, 'alunos'));
      const alunosData = alunosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Aluno[];
      setAlunos(alunosData);

      // Carregar turmas
      const turmasSnapshot = await getDocs(collection(db, 'turmas'));
      const turmasData = turmasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Turma[];
      setTurmas(turmasData);

      // Carregar clientes
      const clientesSnapshot = await getDocs(collection(db, 'clientes'));
      const clientesData = clientesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      setClientes(clientesData);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  // Limpar turmas inválidas dos alunos
  const limparTurmasInvalidas = async () => {
    try {
      setProcessing(true);
      const turmaIdsValidos = turmas.map(t => t.id);
      let alunosAtualizados = 0;

      for (const aluno of alunos) {
        // Filtrar apenas turmas que realmente existem
        const turmasValidas = aluno.turmasIds.filter(turmaId => turmaIdsValidos.includes(turmaId));
        
        // Se houver turmas inválidas, atualizar o aluno
        if (turmasValidas.length !== aluno.turmasIds.length) {
          const alunoRef = doc(db, 'alunos', aluno.id);
          await updateDoc(alunoRef, { turmasIds: turmasValidas });
          alunosAtualizados++;
        }
      }

      toast({
        title: 'Sucesso',
        description: `${alunosAtualizados} alunos foram atualizados (turmas inválidas removidas)`,
      });

      // Recarregar dados
      await loadData();
    } catch (error) {
      console.error('Erro ao limpar turmas inválidas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao limpar turmas inválidas',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Filtrar alunos
  const filteredAlunos = alunos.filter(aluno => {
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aluno.cpf.includes(searchTerm);
    const matchesTurma = selectedTurma === 'all' || selectedTurma === '' || aluno.turmasIds.includes(selectedTurma);
    const matchesCliente = selectedCliente === 'all' || selectedCliente === '' || aluno.clienteId === selectedCliente;
    return matchesSearch && matchesTurma && matchesCliente;
  });

  // Selecionar/deselecionar alunos
  const toggleAlunoSelection = (alunoId: string) => {
    setSelectedAlunos(prev =>
      prev.includes(alunoId)
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };

  const selectAllAlunos = () => {
    setSelectedAlunos(filteredAlunos.map(aluno => aluno.id));
  };

  const clearSelection = () => {
    setSelectedAlunos([]);
  };

  // Ação em massa: adicionar/remover alunos de turma
  const executeBulkAction = async () => {
    if (!targetTurma || selectedAlunos.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione alunos e uma turma',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      const updates = selectedAlunos.map(async (alunoId) => {
        const aluno = alunos.find(a => a.id === alunoId);
        if (!aluno) return;

        let newTurmas: string[];
        if (bulkAction === 'add') {
          newTurmas = Array.from(new Set([...aluno.turmasIds, targetTurma]));
        } else {
          newTurmas = aluno.turmasIds.filter(t => t !== targetTurma);
        }

        await updateDoc(doc(db, 'alunos', alunoId), { turmasIds: newTurmas });

        // Atualizar lista de alunos na turma
        await updateTurmaAlunos(targetTurma);
      });

      await Promise.all(updates);

      toast({
        title: 'Sucesso',
        description: `${selectedAlunos.length} alunos ${bulkAction === 'add' ? 'adicionados à' : 'removidos da'} turma`,
      });

      setShowBulkModal(false);
      setSelectedAlunos([]);
      loadData(); // Recarregar dados

    } catch (error) {
      console.error('Erro na ação em massa:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao executar ação em massa',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Atualizar lista de alunos na turma
  const updateTurmaAlunos = async (turmaId: string) => {
    try {
      const alunosInTurma = alunos.filter(aluno => aluno.turmasIds.includes(turmaId)).map(a => a.id);
      await updateDoc(doc(db, 'turmas', turmaId), { alunosIds: alunosInTurma });
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
    }
  };

  // Processar upload do Excel
  const handleExcelUpload = async (file: File) => {
    if (!selectedCliente || selectedCliente === 'all') {
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

          // Pular cabeçalho e processar dados
          const alunosData = [];
          const skippedAlunos = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row.length >= 8) {
              const [nome, email, cpf, dataNascimento, nomeResponsavel, emailResponsavel, whatsappResponsavel, codigoTurma] = row;

              if (nome && email && cpf && dataNascimento && nomeResponsavel && emailResponsavel && whatsappResponsavel && codigoTurma) {
                // Gerar senha baseada no CPF
                const senhaGerada = cpf.replace(/\D/g, '');

                // Encontrar turma pelo código (obrigatório)
                const turmaEncontrada = turmas.find(t => t.codigo.toUpperCase() === codigoTurma.toString().toUpperCase());
                if (!turmaEncontrada) {
                  skippedAlunos.push({ nome: nome.toString(), codigoTurma: codigoTurma.toString() });
                  continue; // Pular este aluno se a turma não for encontrada
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
                  turmasIds: [turmaEncontrada.id!], // Associar diretamente à turma
                  clienteId: selectedCliente,
                  createdAt: new Date(),
                });
              } else {
                console.warn(`Linha ${i + 1} incompleta, pulando...`);
              }
            }
          }

          // Salvar alunos no Firestore
          const savedCount = [];
          for (const aluno of alunosData) {
            try {
              await addDoc(collection(db, 'alunos'), aluno);
              savedCount.push(aluno);
            } catch (error) {
              console.error('Erro ao salvar aluno:', aluno, error);
            }
          }

          // Mensagem de sucesso com detalhes
          let message = `${savedCount.length} alunos importados com sucesso!`;
          if (skippedAlunos.length > 0) {
            message += ` ${skippedAlunos.length} alunos foram pulados por turmas não encontradas: ${skippedAlunos.map(a => `${a.nome} (${a.codigoTurma})`).join(', ')}`;
          }

          toast({
            title: 'Sucesso',
            description: message,
          });

          setExcelFile(null);
          loadData(); // Recarregar dados

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

  // Baixar template do Excel
  const downloadExcelTemplate = () => {
    const templateData = [
      ['Nome', 'Email', 'CPF', 'Data Nascimento (YYYY-MM-DD)', 'Nome Responsável', 'Email Responsável', 'WhatsApp Responsável', 'Código Turma'],
      ['João Silva Santos', 'joao.silva@email.com', '123.456.789-00', '2010-05-15', 'Maria Silva Santos', 'maria.silva@email.com', '(11) 99999-9999', 'TURMA001'],
      ['Ana Carolina Oliveira', 'ana.oliveira@email.com', '987.654.321-00', '2011-03-22', 'José Oliveira', 'jose.oliveira@email.com', '(11) 88888-8888', 'ROBOTICA-A'],
      ['Pedro Henrique Lima', 'pedro.lima@email.com', '456.789.123-00', '2009-12-10', 'Carla Lima', 'carla.lima@email.com', '(11) 77777-7777', 'ELETRONICA-B'],
      ['Sofia Martins Costa', 'sofia.costa@email.com', '321.654.987-00', '2012-08-30', 'Roberto Costa', 'roberto.costa@email.com', '(11) 66666-6666', 'PROGRAMACAO-1'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alunos');

    // Ajustar largura das colunas
    worksheet['!cols'] = [
      { wch: 25 }, // Nome
      { wch: 30 }, // Email
      { wch: 18 }, // CPF
      { wch: 25 }, // Data Nascimento
      { wch: 25 }, // Nome Responsável
      { wch: 30 }, // Email Responsável
      { wch: 20 }, // WhatsApp
      { wch: 15 }, // Código Turma
    ];

    XLSX.writeFile(workbook, 'template_alunos.xlsx');

    toast({
      title: 'Template baixado',
      description: 'O arquivo template_alunos.xlsx foi baixado com exemplos de preenchimento!',
    });
  };

  // Obter nome da turma por ID
  const getTurmaNome = (turmaId: string) => {
    return turmas.find(t => t.id === turmaId)?.nome || 'Turma não encontrada';
  };

  // Obter código da turma por ID
  const getTurmaCodigo = (turmaId: string) => {
    const turma = turmas.find(t => t.id === turmaId);
    return turma?.codigo || 'N/A';
  };

  // Obter nome do cliente por ID
  const getClienteNome = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.razaoSocial || 'Cliente não encontrado';
  };

  // Filtrar turmas por cliente selecionado
  const filteredTurmas = turmas.filter(turma =>
    !selectedCliente || selectedCliente === 'all' || turma.clienteId === selectedCliente
  );

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-3xl">
              <Users className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Alunos e Turmas</h1>
          <p className="text-lg text-gray-600 mb-4">
            Associe alunos a turmas de forma eficiente
          </p>
          
          {/* Instruções de Uso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Como associar alunos a turmas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">1️⃣</span>
                <span>Use os checkboxes para selecionar os alunos desejados</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">2️⃣</span>
                <span>Clique em "Associar a Turmas" para abrir o modal de ações</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">3️⃣</span>
                <span>Escolha adicionar ou remover da turma selecionada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{alunos.length}</div>
              <div className="text-sm text-gray-600">Total de Alunos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{turmas.length}</div>
              <div className="text-sm text-gray-600">Total de Turmas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{selectedAlunos.length}</div>
              <div className="text-sm text-gray-600">Alunos Selecionados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">
                {alunos.filter(a => a.turmasIds.length === 0).length}
              </div>
              <div className="text-sm text-gray-600">Sem Turma</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Busca */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome, email ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro por Cliente */}
              <div className="w-full lg:w-48">
                <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os clientes</SelectItem>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.razaoSocial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Turma */}
              <div className="w-full lg:w-48">
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    {filteredTurmas.map(turma => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ações em Massa */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllAlunos}
                  disabled={filteredAlunos.length === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Selecionar Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  disabled={selectedAlunos.length === 0}
                >
                  Limpar Seleção
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowBulkModal(true)}
                  disabled={selectedAlunos.length === 0}
                  className="bg-[#00979D] hover:bg-[#007a85] font-medium"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Associar a Turmas ({selectedAlunos.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Excel */}
        <Card className="mb-6 border-2 border-blue-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-6 h-6 text-blue-600" />
              📚 Importar Alunos via Excel e Associar a Turmas
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Use esta seção para importar múltiplos alunos de uma vez e associá-los automaticamente às turmas usando códigos únicos.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Instruções de Formato Excel - SEMPRE VISÍVEL */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg">
              <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                📋 Formato Obrigatório do Excel
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
                <div className="bg-white p-2 rounded border border-green-300 border-2">
                  <strong className="text-green-800">Coluna H:</strong> <span className="text-green-700 font-bold">Código Turma ⚠️ OBRIGATÓRIO</span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-400 rounded text-xs">
                <strong className="text-yellow-900">💡 Dicas Importantes:</strong>
                <ul className="list-disc list-inside mt-2 text-yellow-800 space-y-1">
                  <li>A primeira linha deve conter os cabeçalhos exatamente como acima</li>
                  <li>Todos os campos são obrigatórios para importação bem-sucedida</li>
                  <li>A senha será gerada automaticamente baseada no CPF (11 dígitos)</li>
                  <li><strong>Use os códigos das turmas disponíveis abaixo na Coluna H</strong></li>
                </ul>
              </div>
            </div>

            {/* Códigos das Turmas - SEMPRE VISÍVEL quando cliente selecionado */}
            {selectedCliente && selectedCliente !== 'all' && filteredTurmas.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
                <h3 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                  🎯 Códigos das Turmas Disponíveis para este Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTurmas.map(turma => (
                    <div key={turma.id} className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all">
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block">{turma.nome}</span>
                        <div className="text-xs text-gray-600 mt-1">
                          👥 {turma.alunosIds.length} alunos matriculados
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-xs text-gray-500 mb-1">Copie este código →</div>
                        <span className="text-green-700 font-mono bg-green-100 px-3 py-2 rounded font-bold text-sm border-2 border-green-300">
                          {turma.codigo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-red-50 border-2 border-red-300 rounded text-xs text-red-800">
                  <strong>⚠️ ATENÇÃO:</strong> Copie exatamente um dos códigos acima para a <strong>Coluna H</strong> do seu Excel. 
                  Alunos com códigos de turma inválidos ou inexistentes serão <strong>ignorados</strong> durante a importação!
                </div>
              </div>
            )}

            {selectedCliente && selectedCliente !== 'all' && filteredTurmas.length === 0 && (
              <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="w-5 h-5" />
                  <strong>Nenhuma turma cadastrada para este cliente!</strong>
                </div>
                <p className="text-sm text-orange-700 mt-2">
                  Você precisa cadastrar pelo menos uma turma antes de importar alunos. 
                  Vá para a página de <strong>Gestão de Clientes e Alunos</strong> e crie turmas primeiro.
                </p>
              </div>
            )}

            {!selectedCliente || selectedCliente === 'all' && (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                  className="mt-2 border-2"
                  disabled={!selectedCliente || selectedCliente === 'all'}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-bold text-gray-700">3. Importe os dados</Label>
                <Button
                  onClick={() => excelFile && handleExcelUpload(excelFile)}
                  disabled={!excelFile || !selectedCliente || selectedCliente === 'all' || uploadingExcel}
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

        {/* Tabela de Alunos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alunos Cadastrados ({filteredAlunos.length})</CardTitle>
              {selectedAlunos.length > 0 && (
                <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {selectedAlunos.length} aluno{selectedAlunos.length !== 1 ? 's' : ''} selecionado{selectedAlunos.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            {selectedAlunos.length > 0 && (
              <div className="text-sm text-gray-600 mt-2">
                💡 Use os checkboxes para selecionar alunos e clique em "Ação em Massa" para associá-los a turmas
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00979D] mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando alunos...</p>
              </div>
            ) : filteredAlunos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || selectedTurma || selectedCliente
                    ? 'Nenhum aluno encontrado com os filtros aplicados.'
                    : 'Nenhum aluno cadastrado ainda.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Checkbox
                          checked={selectedAlunos.length === filteredAlunos.length && filteredAlunos.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) selectAllAlunos();
                            else clearSelection();
                          }}
                        />
                        <span className="text-xs text-gray-500 ml-1">Selecionar</span>
                      </div>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Turmas</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlunos.map((aluno) => (
                    <TableRow 
                      key={aluno.id} 
                      className={selectedAlunos.includes(aluno.id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedAlunos.includes(aluno.id)}
                          onCheckedChange={() => toggleAlunoSelection(aluno.id)}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{aluno.nome}</TableCell>
                      <TableCell>{aluno.email}</TableCell>
                      <TableCell>{aluno.cpf}</TableCell>
                      <TableCell>{getClienteNome(aluno.clienteId)}</TableCell>
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
                                {turmasValidas.slice(0, 3).map(turmaId => {
                                  const codigo = getTurmaCodigo(turmaId);
                                  return (
                                    <span
                                      key={turmaId}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                    >
                                      {codigo}
                                    </span>
                                  );
                                })}
                                {turmasValidas.length > 3 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    +{turmasValidas.length - 3}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{aluno.nomeResponsavel}</div>
                          <div className="text-gray-500">{aluno.whatsappResponsavel}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de Ação em Massa */}
        <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Associar Alunos a Turmas em Massa</DialogTitle>
              <p className="text-sm text-gray-600">
                Selecione uma ação e uma turma para aplicar a todos os alunos selecionados
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Ação:</Label>
                <Select value={bulkAction} onValueChange={(value: 'add' | 'remove') => setBulkAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Adicionar à turma
                      </div>
                    </SelectItem>
                    <SelectItem value="remove">
                      <div className="flex items-center gap-2">
                        <UserMinus className="w-4 h-4" />
                        Remover da turma
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Turma:</Label>
                <Select value={targetTurma} onValueChange={setTargetTurma}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTurmas.map(turma => (
                      <SelectItem key={turma.id} value={turma.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{turma.nome}</span>
                          <span className="text-xs text-gray-500">
                            Código: {turma.codigo} • {turma.alunosIds.length} alunos
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded">
                <div className="font-medium mb-1 text-blue-800">
                  📋 {selectedAlunos.length} alunos selecionados
                </div>
                <div className="text-blue-700">
                  Ação: {bulkAction === 'add' ? 'Adicionar à' : 'Remover da'} turma selecionada
                </div>
                {targetTurma && (
                  <div className="text-blue-700 mt-1">
                    Turma: {getTurmaNome(targetTurma)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={executeBulkAction}
                disabled={processing || !targetTurma}
                className="flex-1 bg-[#00979D] hover:bg-[#007a85]"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Executar Ação
                  </>
                )}
              </Button>
              <Button onClick={() => setShowBulkModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}