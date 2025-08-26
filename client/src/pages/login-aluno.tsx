import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
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

export default function LoginAluno() {
  const [, setLocation] = useLocation();
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMensagem("❌ Informe o e-mail");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // Buscar aluno pelo e-mail
      const alunosQuery = query(
        collection(db, "alunos"),
        where("email", "==", email.toLowerCase()),
        where("ativo", "==", true)
      );
      const alunosSnap = await getDocs(alunosQuery);

      if (alunosSnap.empty) {
        setMensagem("❌ Aluno não encontrado. Verifique o e-mail ou entre em contato com seu professor.");
        setCarregando(false);
        return;
      }

      const alunoDoc = alunosSnap.docs[0];
      const alunoData = { id: alunoDoc.id, ...alunoDoc.data() } as Aluno;

      // Atualizar último acesso
      // TODO: Implementar update do último acesso

      // Salvar dados do aluno no localStorage
      localStorage.setItem('aluno', JSON.stringify(alunoData));

      setMensagem("✅ Login realizado com sucesso!");
      setTimeout(() => {
        setLocation('/aluno/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Erro no login:", error);
      setMensagem("❌ Erro ao fazer login. Tente novamente.");
    }
    
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <span className="text-3xl">👨‍🎓</span>
            Login Aluno
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Acesse sua conta para começar seus projetos incríveis!
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="seu@email.com"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Use o e-mail que seu professor cadastrou para você
              </p>
            </div>

            <Button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 font-semibold rounded-lg"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {mensagem && (
            <div className={`p-3 rounded-lg text-center text-sm font-medium ${
              mensagem.includes("✅") 
                ? "bg-green-600/20 text-green-400 border border-green-600" 
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {mensagem}
            </div>
          )}

          <div className="text-center pt-4 border-t border-gray-600">
            <button
              onClick={() => setLocation('/')}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Voltar ao início
            </button>
          </div>

          {/* Ajuda */}
          <Card className="bg-blue-600/20 border-blue-600">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🆘</span>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Precisa de ajuda?</h3>
                  <p className="text-blue-200 text-xs">
                    Se você não conseguir fazer login, peça ajuda ao seu professor. 
                    Ele tem o seu e-mail de cadastro.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
