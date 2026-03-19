import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, query, where } from "firebase/firestore";

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

interface Cliente {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  email: string;
}

interface RotaEstudo {
  id: string;
  titulo: string;
  descricao: string;
  codigo: string;
  projetos: any[];
}

export default function NovaRotaEstudo() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/cliente/:clienteId/nova-rota");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [rotasExistentes, setRotasExistentes] = useState<RotaEstudo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  
  // Estados do formulÃ¡rio
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    if (params?.clienteId) {
      carregarDados(params.clienteId);
    }
  }, [params?.clienteId]);

  const carregarDados = async (clienteId: string) => {
    try {
      setCarregando(true);

      // Carregar dados do cliente
      const clienteDoc = await getDoc(doc(db, "clientes", clienteId));
      if (clienteDoc.exists()) {
        setCliente({ id: clienteDoc.id, ...clienteDoc.data() } as Cliente);
      } else {
        setMensagem("âŒ Cliente nÃ£o encontrado");
        return;
      }

      // Carregar rotas existentes do cliente
      const rotasQuery = query(
        collection(db, "rotasEstudo"),
        where("clienteId", "==", clienteId)
      );
      const rotasSnap = await getDocs(rotasQuery);
      const rotasData = rotasSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as RotaEstudo));
      setRotasExistentes(rotasData);

      // Gerar cÃ³digo automÃ¡tico
      const proximoNumero = rotasData.length + 1;
      const codigoSugerido = `${clienteDoc.data()?.razaoSocial?.substring(0, 3).toUpperCase() || 'CLI'}${proximoNumero.toString().padStart(3, '0')}`;
      setCodigo(codigoSugerido);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setMensagem("âŒ Erro ao carregar dados");
    }
    setCarregando(false);
  };

  const verificarCodigoUnico = async (codigoTeste: string) => {
    if (!params?.clienteId) return false;
    
    const rotasQuery = query(
      collection(db, "rotasEstudo"),
      where("clienteId", "==", params.clienteId),
      where("codigo", "==", codigoTeste.toUpperCase())
    );
    const rotasSnap = await getDocs(rotasQuery);
    return rotasSnap.empty;
  };

  const handleCriarRota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !codigo || !params?.clienteId || !cliente) {
      setMensagem("âŒ Preencha todos os campos obrigatÃ³rios");
      return;
    }

    setSalvando(true);
    setMensagem("");

    try {
      // Verificar se cÃ³digo Ã© Ãºnico para este cliente
      const codigoUnico = await verificarCodigoUnico(codigo);
      if (!codigoUnico) {
        setMensagem("âŒ Este cÃ³digo jÃ¡ existe para este cliente. Escolha outro cÃ³digo.");
        setSalvando(false);
        return;
      }

      const novaRota = {
        clienteId: params.clienteId,
        titulo,
        descricao: descricao || "",
        codigo: codigo.toUpperCase(),
        projetos: [],
        ativo: true,
        criadoEm: new Date()
      };

      await addDoc(collection(db, "rotasEstudo"), novaRota);
      
      setMensagem("âœ… Rota de estudo criada com sucesso!");
      
      // Limpar formulÃ¡rio
      setTitulo("");
      setDescricao("");
      
      // Gerar novo cÃ³digo
      const proximoNumero = rotasExistentes.length + 2;
      const novoCodigoSugerido = `${cliente.razaoSocial.substring(0, 3).toUpperCase()}${proximoNumero.toString().padStart(3, '0')}`;
      setCodigo(novoCodigoSugerido);
      
      // Recarregar rotas
      carregarDados(params.clienteId);
      
      setTimeout(() => setMensagem(""), 3000);

    } catch (error) {
      console.error("Erro ao criar rota:", error);
      setMensagem("âŒ Erro ao criar rota de estudo");
    }
    
    setSalvando(false);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 flex items-center justify-center">
        <div className="text-white text-xl">Cliente nÃ£o encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">ðŸ“š</span>
                Nova Rota de Estudo
              </h1>
              <p className="text-gray-300 mt-2">
                Cliente: <strong>{cliente.nomeFantasia || cliente.razaoSocial}</strong>
              </p>
            </div>
            <Button
              onClick={() => setLocation('/admin/gerenciar-clientes')}
              variant="outline"
              className="text-white border-gray-600"
            >
              Voltar
            </Button>
          </div>
        </div>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            mensagem.includes("âœ…") 
              ? "bg-green-600/20 text-green-400 border border-green-600" 
              : "bg-red-600/20 text-red-400 border border-red-600"
          }`}>
            {mensagem}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FormulÃ¡rio */}
          <Card className="bg-gray-800/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Criar Nova Rota</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCriarRota} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    TÃ­tulo da Rota *
                  </label>
                  <Input
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Ex: ProgramaÃ§Ã£o BÃ¡sica Arduino - 6Âº Ano"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CÃ³digo da Turma *
                  </label>
                  <Input
                    value={codigo}
                    onChange={e => setCodigo(e.target.value.toUpperCase())}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Ex: ESC001"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Este cÃ³digo serÃ¡ usado pelos professores para se cadastrarem
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    DescriÃ§Ã£o
                  </label>
                  <Textarea
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Descreva os objetivos e conteÃºdo desta rota de estudo..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={salvando}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {salvando ? "Criando..." : "Criar Rota de Estudo"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Rotas existentes */}
          <Card className="bg-gray-800/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Rotas Existentes ({rotasExistentes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rotasExistentes.length > 0 ? (
                <div className="space-y-4">
                  {rotasExistentes.map(rota => (
                    <div key={rota.id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">{rota.titulo}</h3>
                        <Badge className="bg-blue-600">{rota.codigo}</Badge>
                      </div>
                      {rota.descricao && (
                        <p className="text-gray-400 text-sm mb-2">{rota.descricao}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {rota.projetos?.length || 0} projetos
                        </span>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setLocation(`/admin/rota/${rota.id}/projetos`)}
                        >
                          Gerenciar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">ðŸ“š</div>
                  <p className="text-gray-400">
                    Nenhuma rota de estudo criada ainda.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dicas */}
        <Card className="bg-blue-600/20 border-blue-600 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ðŸ’¡</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Dicas importantes:</h3>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>â€¢ O cÃ³digo da turma deve ser Ãºnico para cada cliente</li>
                  <li>â€¢ Professores usarÃ£o este cÃ³digo para se cadastrar</li>
                  <li>â€¢ ApÃ³s criar a rota, vocÃª pode adicionar projetos especÃ­ficos</li>
                  <li>â€¢ Use nomes descritivos que identifiquem sÃ©rie, modalidade ou perÃ­odo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

