import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ProtectedRouteProfessor from './ProtectedRoute';
import ProfessorDashboardLayout from './DashboardLayout';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { BookOpen, Video, FileText, ExternalLink, Download, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import AulaDocumentViewer from '../../components/AulaDocumentViewer';

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
  aulasOrdenadas?: Array<{ id: string; ordem: number }>;
  createdAt?: Date;
}

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

export default function ProfessorCursos() {
  const { professor } = useProfessorAuth();
  const [, setLocation] = useLocation();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [todasAulas, setTodasAulas] = useState<Aula[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Função para abrir PDF (Base64 ou URL)
  const handleOpenPdf = (pdfUrl: string, pdfName: string) => {
    if (pdfUrl.startsWith('data:')) {
      // É um arquivo Base64, criar um blob e abrir
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = pdfName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // É uma URL normal do Firebase Storage
      window.open(pdfUrl, '_blank');
    }
  };

  useEffect(() => {
    loadData();
  }, [professor]);

  const loadData = async () => {
    if (!professor?.cursosIds) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Carregar todos os cursos
      const cursosSnapshot = await getDocs(collection(db, 'cursos'));
      const todosCursos = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Curso[];
      
      // Filtrar cursos do professor
      const cursosDoProfessor = todosCursos.filter(curso => 
        professor.cursosIds.includes(curso.id!)
      );
      setCursos(cursosDoProfessor);
      
      // Carregar todas as aulas
      const aulasSnapshot = await getDocs(collection(db, 'aulas'));
      const aulas = aulasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Aula[];
      setTodasAulas(aulas);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAulasByCurso = (curso: Curso): Aula[] => {
    const aulasNaoCurso = todasAulas.filter(aula => curso.aulasIds?.includes(aula.id!));
    
    // Se tem ordenação salva, usa ela
    if (curso.aulasOrdenadas && curso.aulasOrdenadas.length > 0) {
      return curso.aulasOrdenadas
        .sort((a, b) => a.ordem - b.ordem)
        .map(ao => aulasNaoCurso.find(aula => aula.id === ao.id))
        .filter(Boolean) as Aula[];
    }
    
    // Se não tem ordenação, retorna na ordem original
    return aulasNaoCurso;
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleVerCurso = (curso: Curso) => {
    setCursoSelecionado(curso);
    setDialogOpen(true);
  };

  return (
    <ProtectedRouteProfessor>
      <ProfessorDashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Projetos</h1>
            <p className="text-gray-600">
              Acesse as aulas e materiais dos projetos que você ministra
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00979D] mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando projetos...</p>
            </div>
          ) : cursos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum curso atribuído
                </h3>
                <p className="text-gray-600">
                  Entre em contato com o administrador para ter cursos atribuídos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {cursos.map((curso) => {
                const aulas = getAulasByCurso(curso);
                
                return (
                  <Card key={curso.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#00979D] to-[#007a85] text-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{curso.nome}</CardTitle>
                          <p className="text-white/90">{curso.descricao}</p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span>{aulas.length} aulas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{aulas.filter(a => a.pdfUrl).length} PDFs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{aulas.filter(a => a.htmlContent).length} Documentos</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Aulas do Projeto</h3>
                          <Button
                            onClick={() => setLocation(`/professor/assistir/${curso.id}`)}
                            className="bg-[#00979D] hover:bg-[#007a85]"
                          >
                            Acessar Projeto
                          </Button>
                        </div>

                        {aulas.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">Nenhuma aula cadastrada ainda</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aulas.slice(0, 4).map((aula, index) => (
                              <button
                                key={aula.id}
                                onClick={() => setLocation(`/professor/assistir/${curso.id}/${aula.id}`)}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[#00979D] transition-all text-left"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-[#00979D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Play className="w-5 h-5 text-[#00979D]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 mb-1">{aula.nome}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                      {aula.descricao}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs text-gray-500">Aula {index + 1}</span>
                                      {aula.pdfUrl && (
                                        <span className="text-xs flex items-center gap-1 text-blue-600">
                                          <FileText className="w-3 h-3" />
                                          PDF
                                        </span>
                                      )}
                                      {aula.htmlContent && (
                                        <span className="text-xs flex items-center gap-1 text-green-600">
                                          <BookOpen className="w-3 h-3" />
                                          Documento
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {aulas.length > 4 && (
                          <div className="text-center pt-2">
                            <Button
                              variant="outline"
                              onClick={() => setLocation(`/professor/assistir/${curso.id}`)}
                            >
                              Ver mais {aulas.length - 4} aulas
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Dialog - Detalhes do Curso */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {cursoSelecionado?.nome}
                </DialogTitle>
                <p className="text-gray-600 mt-2">{cursoSelecionado?.descricao}</p>
              </DialogHeader>

              {cursoSelecionado && (
                <div className="space-y-4 mt-4">
                  {getAulasByCurso(cursoSelecionado).map((aula, index) => {
                    const videoId = extractYouTubeId(aula.linkYoutube);
                    
                    return (
                      <div key={aula.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 bg-[#00979D] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">{aula.nome}</h4>
                            <p className="text-sm text-gray-600 mt-1">{aula.descricao}</p>
                          </div>
                        </div>

                        {videoId && (
                          <div className="mb-3">
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={aula.nome}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {aula.linkYoutube && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(aula.linkYoutube, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Abrir no YouTube
                            </Button>
                          )}
                          {aula.pdfUrl && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleOpenPdf(aula.pdfUrl!, aula.pdfName || 'material.pdf')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Baixar PDF
                            </Button>
                          )}
                          {aula.htmlContent && (
                            <AulaDocumentViewer
                              htmlContent={aula.htmlContent}
                              aulaNome={aula.nome}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </ProfessorDashboardLayout>
    </ProtectedRouteProfessor>
  );
}
