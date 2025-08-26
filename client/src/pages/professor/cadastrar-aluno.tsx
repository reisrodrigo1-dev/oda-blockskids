import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";

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
}

interface RotaEstudo {
  id: string;
  titulo: string;
  codigo: string;
  descricao: string;
}

export default function CadastrarAluno() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/professor/cadastrar-aluno/:codigoTurma");
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [rotaEstudo, setRotaEstudo] = useState<RotaEstudo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  
  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");

  useEffect(() => {
    // Verificar se professor está logado
    const professorData = localStorage.getItem('professor');
    if (!professorData) {
      setLocation('/login-professor');
      return;
    }

    const prof = JSON.parse(professorData);
    setProfessor(prof);

    if (params?.codigoTurma) {
      carregarRotaEstudo(prof, params.codigoTurma);
    }
  }, [params?.codigoTurma]);

  const carregarRotaEstudo = async (prof: Professor, codigoTurma: string) => {
    try {
      // Verificar se o professor tem acesso a esta turma
      if (!prof.codigosTurmas.includes(codigoTurma)) {
        setMensagem("❌ Você não tem acesso a esta turma");
        return;
      }

      // Buscar rota de estudo
      const rotasQuery = query(
        collection(db, "rotasEstudo"),
        where("clienteId", "==", prof.clienteId),
        where("codigo", "==", codigoTurma)
      );
      const rotasSnap = await getDocs(rotasQuery);

      if (!rotasSnap.empty) {
        const rotaDoc = rotasSnap.docs[0];
        setRotaEstudo({ id: rotaDoc.id, ...rotaDoc.data() } as RotaEstudo);
      } else {
        setMensagem("❌ Turma não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar rota:", error);
      setMensagem("❌ Erro ao carregar dados da turma");
    }
  };

  const handleCadastrarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !idade || !professor || !rotaEstudo) {
      setMensagem("❌ Preencha todos os campos");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // Verificar se aluno já existe nesta turma
      const alunosQuery = query(
        collection(db, "alunos"),
        where("email", "==", email.toLowerCase()),
        where("codigoTurma", "==", rotaEstudo.codigo),
        where("professorId", "==", professor.id)
      );
      const alunosSnap = await getDocs(alunosQuery);

      if (!alunosSnap.empty) {
        setMensagem("❌ Aluno já cadastrado nesta turma");
        setCarregando(false);
        return;
      }

      // Criar novo aluno
      const novoAluno = {
        nome,
        email: email.toLowerCase(),
        idade: parseInt(idade),
        professorId: professor.id,
        professorNome: professor.nome,
        clienteId: professor.clienteId,
        rotaEstudoId: rotaEstudo.id,
        rotaEstudoTitulo: rotaEstudo.titulo,
        codigoTurma: rotaEstudo.codigo,
        criadoEm: new Date(),
        ativo: true,
        progresso: {
          projetosCompletados: 0,
          ultimoAcesso: null,
          nivelAtual: 1
        }
      };

      await addDoc(collection(db, "alunos"), novoAluno);

      setMensagem("✅ Aluno cadastrado com sucesso!");
      
      // Limpar formulário
      setNome("");
      setEmail("");
      setIdade("");

      setTimeout(() => {
        setMensagem("");
      }, 3000);

    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      setMensagem("❌ Erro ao cadastrar aluno. Tente novamente.");
    }
    
    setCarregando(false);
  };

  if (!professor || !rotaEstudo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">👨‍🎓</span>
                Cadastrar Aluno
              </h1>
              <p className="text-gray-300 mt-2">
                Turma: <strong>{rotaEstudo.titulo}</strong>
              </p>
            </div>
            <Button
              onClick={() => setLocation('/professor/dashboard')}
              variant="outline"
              className="text-white border-gray-600"
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Informações da turma */}
        <Card className="bg-gray-800/90 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">📖</span>
              {rotaEstudo.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Código: {rotaEstudo.codigo}</Badge>
                <Badge className="bg-blue-600">Professor: {professor.nome}</Badge>
              </div>
              <p className="text-gray-300">{rotaEstudo.descricao}</p>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de cadastro */}
        <Card className="bg-gray-800/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Dados do Aluno</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleCadastrarAluno} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <Input
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Nome completo do aluno"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="email@exemplo.com"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  O aluno usará este e-mail para fazer login na plataforma
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Idade
                </label>
                <Input
                  type="number"
                  min="6"
                  max="18"
                  value={idade}
                  onChange={e => setIdade(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Idade do aluno"
                  required
                />
              </div>

              {mensagem && (
                <div className={`p-4 rounded-lg text-center font-medium ${
                  mensagem.includes("✅") 
                    ? "bg-green-600/20 text-green-400 border border-green-600" 
                    : "bg-red-600/20 text-red-400 border border-red-600"
                }`}>
                  {mensagem}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-white border-gray-600"
                  onClick={() => setLocation('/professor/dashboard')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={carregando}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {carregando ? "Cadastrando..." : "Cadastrar Aluno"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="bg-blue-600/20 border-blue-600 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Dicas importantes:</h3>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• O e-mail será usado pelo aluno para fazer login</li>
                  <li>• Certifique-se de que o e-mail está correto</li>
                  <li>• O aluno receberá instruções de acesso automaticamente</li>
                  <li>• Você pode cadastrar quantos alunos precisar para esta turma</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
