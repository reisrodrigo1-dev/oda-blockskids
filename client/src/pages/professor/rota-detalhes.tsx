import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWRarkiBugYjwdmrwocbLT5K301iSbwP8",
  authDomain: "oda-blockskids.firebaseapp.com",
  projectId: "oda-blockskids",
  storageBucket: "oda-blockskids.appspot.com",
  messagingSenderId: "567014936342",
  appId: "1:567014936342:web:88c733b99cb5b1d62e0a37",
  measurementId: "G-TCMP1KJK0H"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Professor {
  id: string;
  nome: string;
  email: string;
  clienteId: string;
  clienteNome: string;
  codigosTurmas: string[];
  rotasEstudo: string[];
}

interface RotaEstudo {
  id: string;
  titulo: string;
  descricao: string;
  codigo: string;
  projetos: Projeto[];
  clienteId: string;
}

interface Projeto {
  titulo: string;
  descricao: string;
  dificuldade: string;
  categoria: string;
  blocos?: any[];
  codigo?: string;
}

interface ProjetoAluno {
  id: string;
  alunoId: string;
  alunoNome: string;
  projetoTitulo: string;
  concluido: boolean;
  progresso: number;
  criadoEm: string;
}

export default function RotaDetalhes() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/professor/rota/:rotaId");
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [rota, setRota] = useState<RotaEstudo | null>(null);
  const [projetosAlunos, setProjetosAlunos] = useState<ProjetoAluno[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verificar se professor está logado
    const professorData = localStorage.getItem('professor');
    if (!professorData) {
      setLocation('/login-professor');
      return;
    }

    const prof = JSON.parse(professorData);
    setProfessor(prof);

    if (params?.rotaId) {
      carregarDados(prof, params.rotaId);
    }
  }, [params?.rotaId]);

  const carregarDados = async (prof: Professor, rotaId: string) => {
    try {
      setCarregando(true);

      // Verificar se o professor tem acesso a esta rota
      if (!prof.rotasEstudo.includes(rotaId)) {
        setLocation('/professor/projetos');
        return;
      }

      // Carregar dados da rota
      const rotaDoc = await getDoc(doc(db, "rotasEstudo", rotaId));
      if (rotaDoc.exists()) {
        const rotaData = { id: rotaDoc.id, ...rotaDoc.data() } as RotaEstudo;
        setRota(rotaData);

        // Buscar projetos dos alunos para esta rota
        const alunosQuery = query(
          collection(db, "alunos"),
          where("professorId", "==", prof.id),
          where("codigoTurma", "==", rotaData.codigo)
        );
        const alunosSnap = await getDocs(alunosQuery);
        const alunosIds = alunosSnap.docs.map(doc => doc.id);

        if (alunosIds.length > 0) {
          const projetosAlunosQuery = query(
            collection(db, "projetosAlunos"),
            where("alunoId", "in", alunosIds)
          );
          const projetosAlunosSnap = await getDocs(projetosAlunosQuery);
          
          const projetosAlunosData = projetosAlunosSnap.docs.map(doc => {
            const data = doc.data();
            const alunoDoc = alunosSnap.docs.find(a => a.id === data.alunoId);
            return {
              id: doc.id,
              ...data,
              alunoNome: alunoDoc?.data().nome || "Aluno desconhecido"
            } as ProjetoAluno;
          });
          
          setProjetosAlunos(projetosAlunosData);
        }
      } else {
        setLocation('/professor/projetos');
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setCarregando(false);
  };

  const obterEstatisticasProjeto = (projeto: Projeto) => {
    const projetosEspecificos = projetosAlunos.filter(p => p.projetoTitulo === projeto.titulo);
    const concluidos = projetosEspecificos.filter(p => p.concluido).length;
    const emAndamento = projetosEspecificos.length - concluidos;
    
    return {
      total: projetosEspecificos.length,
      concluidos,
      emAndamento,
      percentualConclusao: projetosEspecificos.length > 0 ? Math.round((concluidos / projetosEspecificos.length) * 100) : 0
    };
  };

  const obterCorDificuldade = (dificuldade: string) => {
    switch (dificuldade?.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return 'bg-green-600';
      case 'médio':
      case 'medio':
        return 'bg-yellow-600';
      case 'difícil':
      case 'dificil':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!rota) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Rota não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">📚</span>
                {rota.titulo}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-600">{rota.codigo}</Badge>
                <p className="text-gray-300">
                  {rota.projetos?.length || 0} aulas disponíveis
                </p>
              </div>
              {rota.descricao && (
                <p className="text-gray-400 mt-2">{rota.descricao}</p>
              )}
            </div>
            <Button
              onClick={() => setLocation('/professor/projetos')}
              variant="outline"
              className="text-white border-gray-600"
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-blue-400 mb-2">📖</div>
              <div className="text-2xl font-bold text-white">{rota.projetos?.length || 0}</div>
              <div className="text-gray-400">Aulas Total</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-green-400 mb-2">✅</div>
              <div className="text-2xl font-bold text-white">
                {projetosAlunos.filter(p => p.concluido).length}
              </div>
              <div className="text-gray-400">Projetos Concluídos</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-yellow-400 mb-2">⏳</div>
              <div className="text-2xl font-bold text-white">
                {projetosAlunos.filter(p => !p.concluido).length}
              </div>
              <div className="text-gray-400">Em Andamento</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-purple-400 mb-2">👥</div>
              <div className="text-2xl font-bold text-white">
                {new Set(projetosAlunos.map(p => p.alunoId)).size}
              </div>
              <div className="text-gray-400">Alunos Ativos</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de aulas/projetos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Aulas da Rota</h2>
          
          {rota.projetos && rota.projetos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rota.projetos.map((projeto, index) => {
                const stats = obterEstatisticasProjeto(projeto);
                
                return (
                  <Card key={index} className="bg-gray-800/90 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg">
                            Aula {index + 1}: {projeto.titulo}
                          </CardTitle>
                          <p className="text-gray-400 text-sm mt-1">
                            {projeto.descricao}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Badge className={obterCorDificuldade(projeto.dificuldade)}>
                            {projeto.dificuldade || 'N/A'}
                          </Badge>
                          {projeto.categoria && (
                            <Badge variant="outline" className="text-gray-300 border-gray-600">
                              {projeto.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Estatísticas do projeto */}
                      <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                        <h4 className="text-white font-semibold mb-3">Progresso dos Alunos</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-400">{stats.total}</div>
                            <div className="text-xs text-gray-400">Total</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-400">{stats.concluidos}</div>
                            <div className="text-xs text-gray-400">Concluídos</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-400">{stats.emAndamento}</div>
                            <div className="text-xs text-gray-400">Em Andamento</div>
                          </div>
                        </div>
                        
                        {stats.total > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Taxa de Conclusão</span>
                              <span>{stats.percentualConclusao}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stats.percentualConclusao}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                          onClick={() => {
                            // Redireciona para a visualização do projeto do professor
                            if ((projeto as any).id) {
                              setLocation(`/professor/projeto/${(projeto as any).id}`);
                            } else {
                              alert('Projeto sem ID.');
                            }
                          }}
                        >
                          Ver Projeto
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => {
                            // Aqui você pode implementar a visualização dos trabalhos dos alunos
                            console.log('Ver trabalhos dos alunos para:', projeto.titulo);
                          }}
                        >
                          Trabalhos ({stats.total})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gray-800/90 border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  Nenhuma aula configurada ainda
                </h3>
                <p className="text-gray-400">
                  Esta rota de estudo ainda não possui aulas/projetos configurados.
                  Entre em contato com o administrador para adicionar conteúdo.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
