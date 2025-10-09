import React, { useState, useEffect } from 'react';
import ProtectedRouteCliente from './ProtectedRoute';
import ClienteDashboardLayout from './DashboardLayout';
import { useClienteAuth } from '../../contexts/ClienteAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { GraduationCap, Mail, Phone, BookOpen } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
}

export default function ClienteProfessores() {
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

  const getCursoById = (id: string) => {
    return cursos.find(c => c.id === id);
  };

  if (!cliente) return null;

  const professores = cliente.professores || [];

  return (
    <ProtectedRouteCliente>
      <ClienteDashboardLayout>
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professores</h1>
          <p className="text-gray-600">
            Lista completa de professores cadastrados na sua conta
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Professores</p>
                  <p className="text-2xl font-bold text-gray-900">{professores.length}</p>
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
                  <p className="text-sm text-gray-600">Cursos Diferentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(professores.flatMap(p => p.cursosIds || [])).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Média de Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {professores.length > 0
                      ? (professores.reduce((acc, p) => acc + (p.cursosIds?.length || 0), 0) / professores.length).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professores List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00979D] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando professores...</p>
          </div>
        ) : professores.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum professor cadastrado
              </h3>
              <p className="text-gray-600">
                Entre em contato com o administrador para adicionar professores à sua conta
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professores.map((professor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl font-bold">
                        {professor.nome.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl truncate">{professor.nome}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Professor</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Contato */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{professor.email}</span>
                    </div>
                    {professor.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{professor.telefone}</span>
                      </div>
                    )}
                  </div>

                  {/* Cursos */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-[#00979D]" />
                      <span className="text-sm font-semibold text-gray-900">
                        Cursos ({professor.cursosIds?.length || 0})
                      </span>
                    </div>
                    {professor.cursosIds && professor.cursosIds.length > 0 ? (
                      <div className="space-y-2">
                        {professor.cursosIds.map(cursoId => {
                          const curso = getCursoById(cursoId);
                          return curso ? (
                            <div key={cursoId} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-blue-900 truncate">
                                    {curso.nome}
                                  </p>
                                  <p className="text-xs text-blue-700 mt-1 line-clamp-2">
                                    {curso.descricao}
                                  </p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded flex-shrink-0">
                                  {curso.aulasIds?.length || 0} aulas
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div key={cursoId} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-sm text-gray-600">Curso não encontrado</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum curso atribuído</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Gerenciamento de Professores</h4>
              <p className="text-sm text-blue-800">
                Para adicionar, remover ou editar professores, entre em contato com o administrador do sistema. 
                Apenas o administrador pode gerenciar os professores da sua conta.
              </p>
            </div>
          </div>
        </div>
      </ClienteDashboardLayout>
    </ProtectedRouteCliente>
  );
}
