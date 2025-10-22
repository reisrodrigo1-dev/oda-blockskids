import React, { useState, useEffect } from 'react';
import ProtectedRouteCliente from './ProtectedRoute';
import ClienteDashboardLayout from './DashboardLayout';
import { useClienteAuth } from '../../contexts/ClienteAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, GraduationCap, Video, FileText, Users } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
  aulasOrdenadas?: Array<{ id: string; ordem: number }>;
}

interface Aula {
  id?: string;
  nome: string;
  linkYoutube: string;
  descricao: string;
  pdfUrl?: string;
  pdfName?: string;
  htmlContent?: string;
}

export default function ClienteProjetosAulas() {
  const { cliente } = useClienteAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load cursos
      const cursosSnapshot = await getDocs(collection(db, 'cursos'));
      const cursosData = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Curso[];
      setCursos(cursosData);

      // Load aulas
      const aulasSnapshot = await getDocs(collection(db, 'aulas'));
      const aulasData = aulasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Aula[];
      setAulas(aulasData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!cliente) return null;

  // Get all unique cursos from all professores
  const getCursosCliente = () => {
    if (!cliente.professores) return [];
    const cursosIds = new Set<string>();
    cliente.professores.forEach(prof => {
      prof.cursosIds?.forEach(id => cursosIds.add(id));
    });
    return cursos.filter(c => cursosIds.has(c.id!));
  };

  const cursosCliente = getCursosCliente();

  // Get aulas by curso
  const getAulasByCurso = (curso: Curso): Aula[] => {
    const aulasNoCurso = aulas.filter(aula => curso.aulasIds?.includes(aula.id!));
    
    // Se tem ordenação salva, usa ela
    if (curso.aulasOrdenadas && curso.aulasOrdenadas.length > 0) {
      return curso.aulasOrdenadas
        .sort((a, b) => a.ordem - b.ordem)
        .map(ao => aulasNoCurso.find(aula => aula.id === ao.id))
        .filter(Boolean) as Aula[];
    }
    
    return aulasNoCurso;
  };

  // Get professores que ministram um curso
  const getProfessoresByCurso = (cursoId: string) => {
    if (!cliente.professores) return [];
    return cliente.professores.filter(prof => prof.cursosIds?.includes(cursoId));
  };

  const totalAulas = cursosCliente.reduce((acc, curso) => 
    acc + (curso.aulasIds?.length || 0), 0
  );

  return (
    <ProtectedRouteCliente>
      <ClienteDashboardLayout>
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projetos e Aulas</h1>
          <p className="text-gray-600">
            Veja todos os cursos e aulas disponíveis para seus professores
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">{cursosCliente.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Aulas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAulas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Professores</p>
                  <p className="text-2xl font-bold text-gray-900">{cliente.professores?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Média Aulas/Curso</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cursosCliente.length > 0 ? (totalAulas / cursosCliente.length).toFixed(1) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cursos List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00979D] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando cursos e aulas...</p>
          </div>
        ) : cursosCliente.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum curso disponível
              </h3>
              <p className="text-gray-600">
                Seus professores ainda não possuem cursos atribuídos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {cursosCliente.map((curso) => {
              const aulasData = getAulasByCurso(curso);
              const professoresData = getProfessoresByCurso(curso.id!);
              const isExpanded = selectedCurso?.id === curso.id;

              return (
                <Card key={curso.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#00979D] to-[#007a85] text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{curso.nome}</CardTitle>
                        <p className="text-white/90 mb-4">{curso.descricao}</p>
                        <div className="flex items-center gap-4 text-sm text-white/80">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span>{aulasData.length} aulas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{professoresData.length} {professoresData.length === 1 ? 'professor' : 'professores'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{aulasData.filter(a => a.pdfUrl).length} PDFs</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Professores */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#00979D]" />
                        Professores que ministram este curso
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {professoresData.map((prof, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {prof.nome}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Toggle Aulas */}
                    <div>
                      <button
                        onClick={() => setSelectedCurso(isExpanded ? null : curso)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="font-semibold text-gray-900">
                          Ver todas as {aulasData.length} aulas
                        </span>
                        <span className="text-gray-600">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </button>

                      {/* Aulas List */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {aulasData.map((aula, index) => (
                            <div key={aula.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#00979D] transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#00979D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 mb-1">{aula.nome}</h5>
                                  <p className="text-sm text-gray-600 mb-2">{aula.descricao}</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {aula.linkYoutube && (
                                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1">
                                        <Video className="w-3 h-3" />
                                        Vídeo
                                      </span>
                                    )}
                                    {aula.pdfUrl && (
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        PDF: {aula.pdfName || 'Material'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-[#00979D] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Conteúdo Educacional</h3>
          <p className="max-w-2xl mx-auto">
            Aqui você visualiza todos os cursos e aulas que seus professores têm acesso. 
            O conteúdo é organizado e sequenciado para melhor aprendizado.
          </p>
        </div>
      </ClienteDashboardLayout>
    </ProtectedRouteCliente>
  );
}
