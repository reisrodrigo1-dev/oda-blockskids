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
  codigosTurmas: string[];
  rotasEstudo: string[];
  criadoEm: Date;
}

export default function LoginProfessor() {
  const [, setLocation] = useLocation();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigosTurmas, setCodigosTurmas] = useState("");

  // Função para validar códigos de turma e encontrar cliente
  const validarCodigosTurmas = async (codigos: string[]) => {
    try {
      const clientesSnap = await getDocs(collection(db, "clientes"));
      
      for (const clienteDoc of clientesSnap.docs) {
        const clienteData = clienteDoc.data();
        const rotasEstudo = clienteData.rotasEstudo || [];
        
        // Verifica se todos os códigos informados existem neste cliente
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
      console.error("Erro ao validar códigos:", error);
      return null;
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !telefone || !codigosTurmas) {
      setMensagem("❌ Preencha todos os campos");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      // Processar códigos de turma (separados por vírgula)
      const codigos = codigosTurmas
        .split(',')
        .map(c => c.trim().toUpperCase())
        .filter(c => c.length > 0);

      if (codigos.length === 0) {
        setMensagem("❌ Informe pelo menos um código de turma válido");
        setCarregando(false);
        return;
      }

      // Validar códigos e encontrar cliente
      const validacao = await validarCodigosTurmas(codigos);
      
      if (!validacao) {
        setMensagem("❌ Código(s) de turma inválido(s). Verifique com sua instituição.");
        setCarregando(false);
        return;
      }

      // Verificar se professor já existe
      const professoresQuery = query(
        collection(db, "professores"),
        where("email", "==", email.toLowerCase()),
        where("clienteId", "==", validacao.clienteId)
      );
      const professoresSnap = await getDocs(professoresQuery);

      if (!professoresSnap.empty) {
        setMensagem("❌ Professor já cadastrado nesta instituição com este e-mail");
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

      setMensagem("✅ Cadastro realizado com sucesso!");
      setTimeout(() => {
        setLocation('/professor/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMensagem("❌ Erro ao realizar cadastro. Tente novamente.");
    }
    
    setCarregando(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMensagem("❌ Informe o e-mail");
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
        setMensagem("❌ Professor não encontrado. Verifique o e-mail ou faça seu cadastro.");
        setCarregando(false);
        return;
      }

      const professorDoc = professoresSnap.docs[0];
      const professorData = { id: professorDoc.id, ...professorDoc.data() };

      // Salvar dados do professor no localStorage
      localStorage.setItem('professor', JSON.stringify(professorData));

      setMensagem("✅ Login realizado com sucesso!");
      setTimeout(() => {
        setLocation('/professor/dashboard');
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
            <span className="text-3xl">👨‍🏫</span>
            {modo === 'login' ? 'Login Professor' : 'Cadastro Professor'}
          </CardTitle>
          <p className="text-gray-300 text-sm">
            {modo === 'login' 
              ? 'Acesse sua conta para gerenciar suas turmas'
              : 'Crie sua conta usando o código da turma fornecido pela instituição'
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
                  Código(s) da Turma
                  <span className="text-xs text-gray-400 block mt-1">
                    Informe o(s) código(s) fornecido(s) pela instituição. Para múltiplos códigos, separe por vírgula.
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
              mensagem.includes("✅") 
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
                ? "Não tem conta? Cadastre-se aqui" 
                : "Já tem conta? Faça login"
              }
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-600">
            <button
              onClick={() => setLocation('/')}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Voltar ao início
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
