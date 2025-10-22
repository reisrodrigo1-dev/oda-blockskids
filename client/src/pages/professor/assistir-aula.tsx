import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import ProtectedRouteProfessor from './ProtectedRoute';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  CheckCircle2, 
  Circle,
  BookOpen,
  FileText,
  Menu,
  X
} from 'lucide-react';
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

export default function AssistirAula() {
  const [, params] = useRoute('/professor/assistir/:cursoId/:aulaId?');
  const [, setLocation] = useLocation();
  const { professor } = useProfessorAuth();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [aulaAtual, setAulaAtual] = useState<Aula | null>(null);
  const [aulaIndex, setAulaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aulasCompletas, setAulasCompletas] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCursoEAulas();
  }, [params?.cursoId]);

  useEffect(() => {
    if (aulas.length > 0) {
      if (params?.aulaId) {
        const index = aulas.findIndex(a => a.id === params.aulaId);
        if (index !== -1) {
          setAulaIndex(index);
          setAulaAtual(aulas[index]);
        } else {
          setAulaAtual(aulas[0]);
          setAulaIndex(0);
        }
      } else {
        setAulaAtual(aulas[0]);
        setAulaIndex(0);
      }
    }
  }, [aulas, params?.aulaId]);

  useEffect(() => {
    if (params?.cursoId) {
      const completasStr = localStorage.getItem(`aulas_completas_${params.cursoId}`);
      if (completasStr) {
        setAulasCompletas(new Set(JSON.parse(completasStr)));
      }
    }
  }, [params?.cursoId]);

  const loadCursoEAulas = async () => {
    if (!params?.cursoId) return;

    try {
      setLoading(true);
      const cursoDoc = await getDoc(doc(db, 'cursos', params.cursoId));
      if (cursoDoc.exists()) {
        const cursoData = {
          id: cursoDoc.id,
          ...cursoDoc.data(),
          createdAt: cursoDoc.data().createdAt?.toDate()
        } as Curso;
        setCurso(cursoData);
        
        const aulasSnapshot = await getDocs(collection(db, 'aulas'));
        const todasAulas = aulasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        })) as Aula[];
        
        const aulasDoCurso = todasAulas.filter(aula => 
          cursoData.aulasIds?.includes(aula.id!)
        );
        
        // Ordenar aulas se houver ordem salva
        if (cursoData.aulasOrdenadas && cursoData.aulasOrdenadas.length > 0) {
          const aulasOrdenadas = cursoData.aulasOrdenadas
            .sort((a, b) => a.ordem - b.ordem)
            .map(ao => aulasDoCurso.find(aula => aula.id === ao.id))
            .filter(Boolean) as Aula[];
          setAulas(aulasOrdenadas);
        } else {
          setAulas(aulasDoCurso);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar curso e aulas:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const marcarComoCompleta = (aulaId: string) => {
    const novasCompletas = new Set(aulasCompletas);
    if (novasCompletas.has(aulaId)) {
      novasCompletas.delete(aulaId);
    } else {
      novasCompletas.add(aulaId);
    }
    setAulasCompletas(novasCompletas);
    
    if (params?.cursoId) {
      localStorage.setItem(
        `aulas_completas_${params.cursoId}`,
        JSON.stringify(Array.from(novasCompletas))
      );
    }
  };

  const proximaAula = () => {
    if (aulaIndex < aulas.length - 1) {
      const novoIndex = aulaIndex + 1;
      setAulaIndex(novoIndex);
      setAulaAtual(aulas[novoIndex]);
      setLocation(`/professor/assistir/${params?.cursoId}/${aulas[novoIndex].id}`);
    }
  };

  const aulaAnterior = () => {
    if (aulaIndex > 0) {
      const novoIndex = aulaIndex - 1;
      setAulaIndex(novoIndex);
      setAulaAtual(aulas[novoIndex]);
      setLocation(`/professor/assistir/${params?.cursoId}/${aulas[novoIndex].id}`);
    }
  };

  const selecionarAula = (index: number) => {
    setAulaIndex(index);
    setAulaAtual(aulas[index]);
    setLocation(`/professor/assistir/${params?.cursoId}/${aulas[index].id}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const progresso = aulas.length > 0 ? Math.round((aulasCompletas.size / aulas.length) * 100) : 0;

  if (loading) {
    return (
      <ProtectedRouteProfessor>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00979D] mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando aula...</p>
          </div>
        </div>
      </ProtectedRouteProfessor>
    );
  }

  if (!curso || !aulaAtual) {
    return (
      <ProtectedRouteProfessor>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Curso não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Não foi possível carregar o curso ou aula
              </p>
              <Button onClick={() => setLocation('/professor/cursos')}>
                Voltar para Cursos
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRouteProfessor>
    );
  }

  const videoId = extractYouTubeId(aulaAtual.linkYoutube);

  return (
    <ProtectedRouteProfessor>
      <div className="min-h-screen bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-screen-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setLocation('/professor/cursos')} className="text-white hover:bg-gray-700">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div className="hidden md:block">
                  <h1 className="text-white font-semibold text-lg">{curso.nome}</h1>
                  <p className="text-gray-400 text-sm">{aulasCompletas.size} de {aulas.length} aulas concluídas • {progresso}%</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-white hover:bg-gray-700">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex max-w-screen-2xl mx-auto">
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:mr-96' : ''}`}>
            <div className="bg-black">
              {videoId ? (
                <div className="aspect-video w-full">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} title={aulaAtual.nome} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full"></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-gray-800">
                  <p className="text-white">Vídeo não disponível</p>
                </div>
              )}
            </div>

            <div className="bg-gray-800 p-6">
              <div className="max-w-4xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">Aula {aulaIndex + 1}: {aulaAtual.nome}</h2>
                    <p className="text-gray-300">{aulaAtual.descricao}</p>
                  </div>
                  <Button onClick={() => marcarComoCompleta(aulaAtual.id!)} className={`flex-shrink-0 ml-4 ${aulasCompletas.has(aulaAtual.id!) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                    {aulasCompletas.has(aulaAtual.id!) ? (<><CheckCircle2 className="w-4 h-4 mr-2" />Concluída</>) : (<><Circle className="w-4 h-4 mr-2" />Marcar como concluída</>)}
                  </Button>
                </div>

                {(aulaAtual.pdfUrl || aulaAtual.htmlContent) && (
                  <div className="mb-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" />Material de Apoio</h3>
                    <div className="flex gap-2 flex-wrap">
                      {aulaAtual.pdfUrl && (
                        <Button onClick={() => window.open(aulaAtual.pdfUrl, '_blank')} className="bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />Baixar PDF - {aulaAtual.pdfName || 'Material da Aula'}
                        </Button>
                      )}
                      {aulaAtual.htmlContent && (
                        <AulaDocumentViewer
                          htmlContent={aulaAtual.htmlContent}
                          aulaNome={aulaAtual.nome}
                          trigger={
                            <Button className="bg-green-600 hover:bg-green-700">
                              <FileText className="w-4 h-4 mr-2" />
                              Ver Documento da Aula
                            </Button>
                          }
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                  <Button onClick={aulaAnterior} disabled={aulaIndex === 0} variant="outline" className="text-white border-gray-600 hover:bg-gray-700 disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4 mr-2" />Aula Anterior
                  </Button>
                  <span className="text-gray-400 text-sm">{aulaIndex + 1} de {aulas.length}</span>
                  <Button onClick={proximaAula} disabled={aulaIndex === aulas.length - 1} className="bg-[#00979D] hover:bg-[#007a85] disabled:opacity-50">
                    Próxima Aula<ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={`fixed md:fixed right-0 top-0 h-full w-80 md:w-96 bg-gray-800 border-l border-gray-700 transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ marginTop: '57px' }}>
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-700 bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progresso do Curso</span>
                  <span className="text-sm font-semibold text-[#00979D]">{progresso}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#00979D] h-2 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{aulasCompletas.size} de {aulas.length} aulas concluídas</p>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" />Conteúdo do Curso</h3>
                <div className="space-y-2">
                  {aulas.map((aula, index) => {
                    const isAtual = index === aulaIndex;
                    const isConcluida = aulasCompletas.has(aula.id!);
                    return (
                      <button key={aula.id} onClick={() => selecionarAula(index)} className={`w-full text-left p-3 rounded-lg transition-all ${isAtual ? 'bg-[#00979D] text-white' : isConcluida ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {isConcluida ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAtual ? 'bg-white text-[#00979D]' : 'bg-gray-600 text-gray-300'}`}>{index + 1}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm mb-1 line-clamp-2">{aula.nome}</p>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              {aula.pdfUrl && (<span className="flex items-center gap-1"><FileText className="w-3 h-3" />PDF</span>)}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRouteProfessor>
  );
}
