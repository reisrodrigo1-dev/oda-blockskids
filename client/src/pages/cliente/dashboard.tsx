import React, { useState, useEffect } from 'react';
import ProtectedRouteCliente from './ProtectedRoute';
import ClienteDashboardLayout from './DashboardLayout';
import { useClienteAuth } from '../../contexts/ClienteAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Building2, Users, GraduationCap, BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
}

export default function ClienteDashboard() {
  const { cliente } = useClienteAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    try {
      setLoading(true);
      const cursosSnapshot = await getDocs(collection(db, 'cursos'));
      const cursosData = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Curso[];
      setCursos(cursosData);
    } catch (error) {
      console.error('Error loading cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all cursos from all professores
  const getCursosUnicos = () => {
    if (!cliente?.professores) return [];
    const cursosIds = new Set<string>();
    cliente.professores.forEach(prof => {
      prof.cursosIds.forEach(id => cursosIds.add(id));
    });
    return Array.from(cursosIds);
  };

  const totalAulas = getCursosUnicos().reduce((acc, cursoId) => {
    const curso = cursos.find(c => c.id === cursoId);
    return acc + (curso?.aulasIds?.length || 0);
  }, 0);

  if (!cliente) return null;

  return (
    <ProtectedRouteCliente>
      <ClienteDashboardLayout>
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo, {cliente.nomeResponsavel}!
              </h1>
              <p className="text-gray-600">
                Gerencie as informações da sua conta e acompanhe seus professores
              </p>
            </div>
            {cliente.logoBase64 && (
              <div className="border-2 border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <img 
                  src={cliente.logoBase64} 
                  alt="Logo da empresa" 
                  className="max-h-16 max-w-[150px] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Professores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cliente.professores?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getCursosUnicos().length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aulas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalAulas}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  cliente.tipo === 'prefeitura' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    cliente.tipo === 'prefeitura' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="text-lg font-bold text-gray-900">
                    {cliente.tipo === 'prefeitura' ? 'Prefeitura' : 'Empresa'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00979D]" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Razão Social</p>
                <p className="font-semibold text-gray-900">{cliente.razaoSocial}</p>
              </div>
              
              {cliente.nomeFantasia && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nome Fantasia</p>
                  <p className="font-semibold text-gray-900">{cliente.nomeFantasia}</p>
                </div>
              )}

              {cliente.cnpj && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">CNPJ</p>
                  <p className="font-semibold text-gray-900">{cliente.cnpj}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{cliente.email}</span>
                </div>
                {cliente.telefone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>{cliente.telefone}</span>
                  </div>
                )}
                {cliente.cidade && cliente.estado && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{cliente.cidade}/{cliente.estado}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Responsável */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00979D]" />
                Dados do Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nome</p>
                <p className="font-semibold text-gray-900">{cliente.nomeResponsavel}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Cargo</p>
                <p className="font-semibold text-gray-900">{cliente.cargoResponsavel}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{cliente.emailResponsavel}</span>
                </div>
                {cliente.telefoneResponsavel && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{cliente.telefoneResponsavel}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professores Resumo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00979D]" />
                Professores Cadastrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cliente.professores && cliente.professores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cliente.professores.slice(0, 4).map((professor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#00979D] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#00979D] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {professor.nome.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{professor.nome}</p>
                          <p className="text-sm text-gray-600 truncate">{professor.email}</p>
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {professor.cursosIds?.length || 0} cursos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhum professor cadastrado ainda</p>
                </div>
              )}
              
              {cliente.professores && cliente.professores.length > 4 && (
                <div className="mt-4 text-center">
                  <a href="/cliente/professores" className="text-[#00979D] hover:underline text-sm font-medium">
                    Ver todos os {cliente.professores.length} professores →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-[#00979D] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Área do Cliente - Oficina do Amanhã</h3>
          <p className="max-w-2xl mx-auto">
            Acompanhe seus professores, cursos e aulas. Tenha controle total sobre sua conta educacional.
          </p>
        </div>
      </ClienteDashboardLayout>
    </ProtectedRouteCliente>
  );
}
