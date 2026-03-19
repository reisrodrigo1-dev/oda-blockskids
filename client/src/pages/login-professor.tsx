import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWRarkiBugYjwdmrwocbLT5K301iSbwP8",
  authDomain: "oda-blockskids.firebaseapp.com",
  projectId: "oda-blockskids",
  storageBucket: "oda-blockskids.firebasestorage.app",
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
  codigosTurmas: string[];
  rotasEstudo: string[];
  criadoEm: Date;
}

export default function LoginProfessor() {
  const [, setLocation] = useLocation();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  
  // Estados do formulÃ¡rio
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigosTurmas, setCodigosTurmas] = useState("");

  // FunÃ§Ã£o para validar cÃ³digos de turma e encontrar cliente
  const validarCodigosTurmas = async (codigos: string[]) => {
    try {
      const clientesSnap = await getDocs(collection(db, "clientes"));
      
      for (const clienteDoc of clientesSnap.docs) {
        const clienteData = clienteDoc.data();
        const rotasEstudo = clienteData.rotasEstudo || [];
        
        // Verifica se todos os cÃ³digos informados existem neste cliente
        const codigosValidos = codigos.every(codigo => 
          rotasEstudo.some((rota: any) => rota.codigo === codigo)
        );
        
        if (codigosValidos && codigos.length > 0) {
          // Retorna dados do cliente e rotas correspondentes
          const rotasCorrespondentes = rotasEstudo.filter((rota: any) => 
            codigos.includes(rota.codigo)
          );
          
          return {
            clienteId: clienteDoc.id,
            clienteNome: clienteData.razaoSocial || clienteData.nomeFantasia || "Cliente",
            rotasEstudo: rotasCorrespondentes
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao validar cÃ³digos:", error);
      return null;
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !telefone || !codigosTurmas) {
      setMensagem("âŒ Preencha todos os campos");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // Processar cÃ³digos de turma (separados por vÃ­rgula)
      const codigos = codigosTurmas
        .split(',')
        .map(c => c.trim().toUpperCase())
        .filter(c => c.length > 0);

      if (codigos.length === 0) {
        setMensagem("âŒ Informe pelo menos um cÃ³digo de turma vÃ¡lido");
        setCarregando(false);
        return;
      }

      // Validar cÃ³digos e encontrar cliente
      const validacao = await validarCodigosTurmas(codigos);
      
      if (!validacao) {
        setMensagem("âŒ CÃ³digo(s) de turma invÃ¡lido(s). Verifique com sua instituiÃ§Ã£o.");
        setCarregando(false);
        return;
      }

      // Verificar se professor jÃ¡ existe
      const professoresQuery = query(
        collection(db, "professores"),
        where("email", "==", email.toLowerCase()),
        where("clienteId", "==", validacao.clienteId)
      );
      const professoresSnap = await getDocs(professoresQuery);

      if (!professoresSnap.empty) {
        setMensagem("âŒ Professor jÃ¡ cadastrado nesta instituiÃ§Ã£o com este e-mail");
        setCarregando(false);
        return;
      }

      // Criar novo professor
      const novoProfessor = {
        nome,
        email: email.toLowerCase(),
        telefone,
        clienteId: validacao.clienteId,
        clienteNome: validacao.clienteNome,
        codigosTurmas: codigos,
        rotasEstudo: validacao.rotasEstudo.map((r: any) => r.rotaId),
        criadoEm: new Date(),
        ativo: true
      };

      const docRef = await addDoc(collection(db, "professores"), novoProfessor);
      
      // Salvar dados do professor no localStorage
      localStorage.setItem('professor', JSON.stringify({
        ...novoProfessor,
        id: docRef.id
      }));

      setMensagem("âœ… Cadastro realizado com sucesso!");
      setTimeout(() => {
        setLocation('/professor/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMensagem("âŒ Erro ao realizar cadastro. Tente novamente.");
    }
    
    setCarregando(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMensagem("âŒ Informe o e-mail");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // Buscar professor pelo e-mail
      const professoresQuery = query(
        collection(db, "professores"),
        where("email", "==", email.toLowerCase())
      );
      const professoresSnap = await getDocs(professoresQuery);

      if (professoresSnap.empty) {
        setMensagem("âŒ Professor nÃ£o encontrado. Verifique o e-mail ou faÃ§a seu cadastro.");
        setCarregando(false);
        return;
      }

      const professorDoc = professoresSnap.docs[0];
      const professorData = { id: professorDoc.id, ...professorDoc.data() };

      // Salvar dados do professor no localStorage
      localStorage.setItem('professor', JSON.stringify(professorData));

      setMensagem("âœ… Login realizado com sucesso!");
      setTimeout(() => {
        setLocation('/professor/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Erro no login:", error);
      setMensagem("âŒ Erro ao fazer login. Tente novamente.");
    }
    
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <span className="text-3xl">ðŸ‘¨â€ðŸ«</span>
            {modo === 'login' ? 'Login Professor' : 'Cadastro Professor'}
          </CardTitle>
          <p className="text-gray-300 text-sm">
            {modo === 'login' 
              ? 'Acesse sua conta para gerenciar suas turmas'
              : 'Crie sua conta usando o cÃ³digo da turma fornecido pela instituiÃ§Ã£o'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {modo === 'login' ? (
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
              </div>

              <Button
                type="submit"
                disabled={carregando}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 font-semibold rounded-lg"
              >
                {carregando ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <Input
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                <Input
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CÃ³digo(s) da Turma
                  <span className="text-xs text-gray-200 block mt-1">
                    Informe o(s) cÃ³digo(s) fornecido(s) pela instituiÃ§Ã£o. Para mÃºltiplos cÃ³digos, separe por vÃ­rgula.
                  </span>
                </label>
                <Input
                  value={codigosTurmas}
                  onChange={e => setCodigosTurmas(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="ABC123, DEF456"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={carregando}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 font-semibold rounded-lg"
              >
                {carregando ? "Cadastrando..." : "Criar Conta"}
              </Button>
            </form>
          )}

          {mensagem && (
            <div className={`p-3 rounded-lg text-center text-sm font-medium ${
              mensagem.includes("âœ…") 
                ? "bg-green-600/20 text-green-400 border border-green-600" 
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {mensagem}
            </div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setModo(modo === 'login' ? 'cadastro' : 'login');
                setMensagem("");
                setEmail("");
                setSenha("");
                setNome("");
                setTelefone("");
                setCodigosTurmas("");
              }}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {modo === 'login' 
                ? "NÃ£o tem conta? Cadastre-se aqui" 
                : "JÃ¡ tem conta? FaÃ§a login"
              }
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-600">
            <button
              onClick={() => setLocation('/')}
              className="text-white hover:text-gray-200 text-sm"
            >
              â† Voltar ao inÃ­cio
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

