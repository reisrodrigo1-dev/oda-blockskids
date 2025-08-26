import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";

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

interface Cliente {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj?: string;
  email: string;
  telefone?: string;
  endereco?: any;
  ativo: boolean;
  criadoEm: Date;
}

export default function GerenciarClientes() {
  const [, setLocation] = useLocation();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensagem, setMensagem] = useState("");
  
  // Estados do formulário
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const clientesQuery = query(
        collection(db, "clientes"),
        orderBy("razaoSocial")
      );
      const clientesSnap = await getDocs(clientesQuery);
      const clientesData = clientesSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Cliente));
      setClientes(clientesData);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setMensagem("❌ Erro ao carregar clientes");
    }
    setCarregando(false);
  };

  const handleCriarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial || !email) {
      setMensagem("❌ Preencha pelo menos Razão Social e E-mail");
      return;
    }

    try {
      const novoCliente = {
        razaoSocial,
        nomeFantasia: nomeFantasia || null,
        cnpj: cnpj || null,
        email: email.toLowerCase(),
        telefone: telefone || null,
        endereco: null,
        ativo: true,
        criadoEm: new Date()
      };

      await addDoc(collection(db, "clientes"), novoCliente);
      
      setMensagem("✅ Cliente criado com sucesso!");
      setMostrarFormulario(false);
      
      // Limpar formulário
      setRazaoSocial("");
      setNomeFantasia("");
      setCnpj("");
      setEmail("");
      setTelefone("");
      
      // Recarregar lista
      carregarClientes();
      
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      setMensagem("❌ Erro ao criar cliente");
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🏢</span>
                Gerenciar Clientes
              </h1>
              <p className="text-gray-300 mt-2">
                Administração de instituições de ensino cadastradas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="bg-green-600 hover:bg-green-700"
              >
                {mostrarFormulario ? "Cancelar" : "Novo Cliente"}
              </Button>
              <Button
                onClick={() => setLocation('/admin/dashboard')}
                variant="outline"
                className="text-white border-gray-600"
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            mensagem.includes("✅") 
              ? "bg-green-600/20 text-green-400 border border-green-600" 
              : "bg-red-600/20 text-red-400 border border-red-600"
          }`}>
            {mensagem}
          </div>
        )}

        {/* Formulário de novo cliente */}
        {mostrarFormulario && (
          <Card className="bg-gray-800/90 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Novo Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCriarCliente} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Razão Social *
                    </label>
                    <Input
                      value={razaoSocial}
                      onChange={e => setRazaoSocial(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Nome oficial da instituição"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Fantasia
                    </label>
                    <Input
                      value={nomeFantasia}
                      onChange={e => setNomeFantasia(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Nome popular da instituição"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-mail *
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="contato@instituicao.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone
                    </label>
                    <Input
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CNPJ
                  </label>
                  <Input
                    value={cnpj}
                    onChange={e => setCnpj(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-white border-gray-600"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Criar Cliente
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map(cliente => (
            <Card key={cliente.id} className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏢</span>
                      {cliente.nomeFantasia || cliente.razaoSocial}
                    </div>
                    {cliente.nomeFantasia && (
                      <div className="text-sm text-gray-400 mt-1">
                        {cliente.razaoSocial}
                      </div>
                    )}
                  </div>
                  <Badge className={cliente.ativo ? "bg-green-600" : "bg-red-600"}>
                    {cliente.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>📧</span>
                    {cliente.email}
                  </div>
                  {cliente.telefone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>📞</span>
                      {cliente.telefone}
                    </div>
                  )}
                  {cliente.cnpj && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>📄</span>
                      {cliente.cnpj}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>📅</span>
                    Criado em {new Date(cliente.criadoEm).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setLocation(`/admin/cliente/${cliente.id}/rotas`)}
                  >
                    Ver Rotas
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => setLocation(`/admin/cliente/${cliente.id}/nova-rota`)}
                  >
                    Nova Rota
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clientes.length === 0 && (
          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl text-white mb-2">Nenhum cliente cadastrado</h3>
              <p className="text-gray-400 mb-4">
                Comece criando seu primeiro cliente (instituição de ensino).
              </p>
              <Button
                onClick={() => setMostrarFormulario(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Criar Primeiro Cliente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
