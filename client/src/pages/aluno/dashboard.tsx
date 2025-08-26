import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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

interface Aluno {
  id: string;
  nome: string;
  email: string;
  idade: number;
  professorId: string;
  professorNome: string;
  clienteId: string;
  rotaEstudoId: string;
  rotaEstudoTitulo: string;
  codigoTurma: string;
  progresso: {
    projetosCompletados: number;
    ultimoAcesso: Date | null;
    nivelAtual: number;
  };
}

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tipo: string;
  blocos: any[];
  concluido?: boolean;
}

export default function DashboardAluno() {
  const [, setLocation] = useLocation();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verificar se aluno está logado
    const alunoData = localStorage.getItem('aluno');
    if (!alunoData) {
      setLocation('/login-aluno');
      return;
    }

    const alunoObj = JSON.parse(alunoData);
    setAluno(alunoObj);
    carregarProjetos(alunoObj);
  }, []);

  const carregarProjetos = async (alunoData: Aluno) => {
    try {
      setCarregando(true);

      // Buscar rota de estudo do aluno
      const rotasQuery = query(
        collection(db, "rotasEstudo"),
        where("clienteId", "==", alunoData.clienteId)
      );
      const rotasSnap = await getDocs(rotasQuery);
      
      let projetosDisponiveis: Projeto[] = [];
      
      rotasSnap.docs.forEach(doc => {
        const rotaData = doc.data();
        if (doc.id === alunoData.rotaEstudoId && rotaData.projetos) {
          projetosDisponiveis = rotaData.projetos.map((projeto: any, index: number) => ({
            ...projeto,
            id: `${doc.id}_${index}`,
            concluido: false // TODO: Verificar se aluno já completou
          }));
        }
      });

      setProjetos(projetosDisponiveis);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
    
    setCarregando(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('aluno');
    setLocation('/');
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'bg-green-600';
      case 'medio': return 'bg-yellow-600';
      case 'dificil': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getDificuldadeText = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return '🟢 Fácil';
      case 'medio': return '🟡 Médio';
      case 'dificil': return '🔴 Difícil';
      default: return '⚪ Desconhecido';
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando seus projetos...</div>
      </div>
    );
  }

  if (!aluno) {
    return null;
  }

  const progressoTotal = projetos.length > 0 ? (aluno.progresso.projetosCompletados / projetos.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🚀</span>
                Olá, {aluno.nome.split(' ')[0]}!
              </h1>
              <p className="text-gray-300 mt-2">
                Turma: <strong>{aluno.rotaEstudoTitulo}</strong> | 
                Professor: <strong>{aluno.professorNome}</strong>
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="text-white border-gray-600">
              Sair
            </Button>
          </div>
        </div>

        {/* Progresso */}
        <Card className="bg-gray-800/90 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Seu Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">
                  Projetos Completados: {aluno.progresso.projetosCompletados} de {projetos.length}
                </span>
                <Badge className="bg-blue-600">
                  Nível {aluno.progresso.nivelAtual}
                </Badge>
              </div>
              <Progress value={progressoTotal} className="h-3" />
              <div className="text-center text-gray-400 text-sm">
                {progressoTotal.toFixed(0)}% concluído
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-green-400 mb-2">✅</div>
              <div className="text-2xl font-bold text-white">{aluno.progresso.projetosCompletados}</div>
              <div className="text-gray-400">Projetos Concluídos</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-blue-400 mb-2">📚</div>
              <div className="text-2xl font-bold text-white">{projetos.length}</div>
              <div className="text-gray-400">Projetos Disponíveis</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl text-purple-400 mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">{aluno.progresso.nivelAtual}</div>
              <div className="text-gray-400">Nível Atual</div>
            </CardContent>
          </Card>
        </div>

        {/* Projetos */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-3xl">🛠️</span>
            Seus Projetos
          </h2>

          {projetos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetos.map((projeto, index) => (
                <Card key={projeto.id} className="bg-gray-800/90 border-gray-700 hover:border-blue-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {projeto.concluido ? '✅' : index + 1}
                        </span>
                        <span className="text-sm">{projeto.titulo}</span>
                      </div>
                      {projeto.concluido && <Badge className="bg-green-600">Concluído</Badge>}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {projeto.descricao}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge className={getDificuldadeColor(projeto.dificuldade)}>
                          {getDificuldadeText(projeto.dificuldade)}
                        </Badge>
                        <Badge variant="outline" className="text-gray-400">
                          {projeto.tipo}
                        </Badge>
                      </div>

                      <Button
                        className={`w-full ${
                          projeto.concluido 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={() => setLocation(`/aluno/projeto/${projeto.id}`)}
                      >
                        {projeto.concluido ? 'Revisar Projeto' : 'Começar Projeto'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/90 border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl text-white mb-2">Nenhum projeto disponível</h3>
                <p className="text-gray-400">
                  Seu professor ainda não adicionou projetos para sua turma. 
                  Que tal perguntar quando os projetos ficarão disponíveis?
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Menu rápido */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/aluno/projetos')}
          >
            <span className="text-2xl mb-1">🛠️</span>
            <span className="text-sm">Meus Projetos</span>
          </Button>
          
          <Button
            className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/aluno/conquistas')}
          >
            <span className="text-2xl mb-1">🏆</span>
            <span className="text-sm">Conquistas</span>
          </Button>
          
          <Button
            className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/aluno/perfil')}
          >
            <span className="text-2xl mb-1">👤</span>
            <span className="text-sm">Meu Perfil</span>
          </Button>
          
          <Button
            className="h-16 bg-yellow-600 hover:bg-yellow-700 flex flex-col items-center justify-center"
            onClick={() => setLocation('/aluno/ajuda')}
          >
            <span className="text-2xl mb-1">🆘</span>
            <span className="text-sm">Ajuda</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
