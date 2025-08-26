import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";

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
  telefone: string;
  clienteId: string;
  clienteNome: string;
  codigosTurmas: string[];
  rotasEstudo: string[];
  criadoEm: Date;
  ativo: boolean;
}

interface Aluno {
  id: string;
  nome: string;
  email: string;
  professorId: string;
  rotaEstudoId: string;
  codigoTurma: string;
  criadoEm: Date;
  projetos: number;
}

interface RotaEstudo {
  id: string;
  titulo: string;
  codigo: string;
  descricao: string;
  projetos: any[];
}

export default function DashboardProfessor() {
  const [, setLocation] = useLocation();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [rotasEstudo, setRotasEstudo] = useState<RotaEstudo[]>([]);
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
    carregarDados(prof);
  }, []);

  const carregarDados = async (prof: Professor) => {
    try {
      setCarregando(true);

      // Carregar rotas de estudo específicas do professor (apenas as que ele tem acesso)
      const rotasQuery = query(
        collection(db, "rotasEstudo"),
        where("clienteId", "==", prof.clienteId)
      );
      const rotasSnap = await getDocs(rotasQuery);
      const rotasData = rotasSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as RotaEstudo))
        .filter(rota => prof.codigosTurmas.includes(rota.codigo));

      console.log(`Professor tem acesso a ${rotasData.length} rotas:`, rotasData.map(r => r.codigo));
      setRotasEstudo(rotasData);

      // Carregar alunos das turmas do professor
      const alunosQuery = query(
        collection(db, "alunos"),
        where("professorId", "==", prof.id),
        orderBy("nome")
      );
      const alunosSnap = await getDocs(alunosQuery);

      // Contar projetos concluídos por aluno
      const projetosAlunosQuery = query(
        collection(db, "projetosAlunos"),
        where("concluido", "==", true)
      );
      const projetosAlunosSnap = await getDocs(projetosAlunosQuery);
      const projetosAlunos = projetosAlunosSnap.docs.map(doc => doc.data());

      const alunosData = alunosSnap.docs.map(doc => {
        const alunoData = doc.data();
        const projetosConcluidos = projetosAlunos.filter(p => p.alunoId === doc.id).length;
        
        return { 
          id: doc.id, 
          ...alunoData,
          projetos: projetosConcluidos
        } as Aluno;
      });

      setAlunos(alunosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    
    setCarregando(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('professor');
    setLocation('/');
  };

  const alunosPorTurma = (codigo: string) => {
    return alunos.filter(aluno => aluno.codigoTurma === codigo);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!professor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">👨‍🏫</span>
                Dashboard Professor
              </h1>
              <p className="text-gray-300 mt-2">
                Olá, <strong>{professor.nome}</strong> | 
                <span className="text-blue-400 ml-2">{professor.clienteNome}</span>
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="text-white border-gray-600">
              Sair
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-blue-400 mb-2">📚</div>
              <div className="text-2xl font-bold text-white">{rotasEstudo.length}</div>
              <div className="text-gray-400">Turmas</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-green-400 mb-2">👥</div>
              <div className="text-2xl font-bold text-white">{alunos.length}</div>
              <div className="text-gray-400">Alunos</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-purple-400 mb-2">🚀</div>
              <div className="text-2xl font-bold text-white">
                {rotasEstudo.reduce((total, rota) => total + (rota.projetos?.length || 0), 0)}
              </div>
              <div className="text-gray-400">Projetos Disponíveis</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-yellow-400 mb-2">⚡</div>
              <div className="text-2xl font-bold text-white">
                {alunos.reduce((total, aluno) => total + aluno.projetos, 0)}
              </div>
              <div className="text-gray-400">Projetos Concluídos</div>
            </CardContent>
          </Card>
        </div>

        {/* Turmas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rotasEstudo.map(rota => {
            const alunosTurma = alunosPorTurma(rota.codigo);
            
            return (
              <Card key={rota.id} className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        {rota.titulo}
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Código: {rota.codigo}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">
                        {alunosTurma.length}
                      </div>
                      <div className="text-sm text-gray-400">alunos</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 mb-4">{rota.descricao}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Projetos disponíveis:</span>
                      <Badge className="bg-purple-600">
                        {rota.projetos?.length || 0} projetos
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setLocation(`/professor/turma/${rota.id}`)}
                      >
                        Ver Turma
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => setLocation(`/professor/cadastrar-aluno/${rota.codigo}`)}
                      >
                        Cadastrar Aluno
                      </Button>
                    </div>
                  </div>

                  {alunosTurma.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-sm text-gray-400 mb-2">Últimos alunos:</div>
                      <div className="space-y-1">
                        {alunosTurma.slice(0, 3).map(aluno => (
                          <div key={aluno.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{aluno.nome}</span>
                            <Badge variant="outline" className="text-xs">
                              {aluno.projetos} projetos
                            </Badge>
                          </div>
                        ))}
                        {alunosTurma.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{alunosTurma.length - 3} outros alunos
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {rotasEstudo.length === 0 && (
          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl text-white mb-2">Nenhuma turma encontrada</h3>
              <p className="text-gray-400">
                Verifique se os códigos de turma informados estão corretos ou entre em contato com a administração.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Menu rápido */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/professor/alunos')}
          >
            <span className="text-2xl mb-1">👥</span>
            <span className="text-sm">Todos os Alunos</span>
          </Button>
          
          <Button
            className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/professor/projetos')}
          >
            <span className="text-2xl mb-1">🚀</span>
            <span className="text-sm">Todos os Projetos</span>
          </Button>
          
          <Button
            className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/professor/relatorios')}
          >
            <span className="text-2xl mb-1">📊</span>
            <span className="text-sm">Relatórios</span>
          </Button>
          
          <Button
            className="h-16 bg-gray-600 hover:bg-gray-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/professor/perfil')}
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-sm">Configurações</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
