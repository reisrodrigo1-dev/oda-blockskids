import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

function gerarCodigo(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function AssociarRotasClientes() {

  interface RotaEstudoAssociada {
    rotaId: string;
    codigo: string;
  }
  interface Cliente {
    id: string;
    nome: string;
    rotasEstudo?: RotaEstudoAssociada[];
    [key: string]: any;
  }
  interface RotaEstudo {
    id: string;
    nome: string;
    [key: string]: any;
  }

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rotas, setRotas] = useState<RotaEstudo[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [rotaSelecionada, setRotaSelecionada] = useState("");
  const [rotasSelecionadas, setRotasSelecionadas] = useState<string[]>([]);
  const [associando, setAssociando] = useState(false);
  const [msg, setMsg] = useState("");
  const [associacoes, setAssociacoes] = useState<RotaEstudoAssociada[]>([]);
  const [modoMultiplo, setModoMultiplo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const clientesSnap = await getDocs(collection(db, "clientes"));
        
        const clientesData = clientesSnap.docs.map(doc => {
          const data = doc.data();
          // Usar razaoSocial ou nomeFantasia como nome principal
          const nome = data.razaoSocial || data.nomeFantasia || data.nome || "(sem nome)";
          return { id: doc.id, nome, ...data };
        });
        
        setClientes(clientesData);
        
        const rotasSnap = await getDocs(collection(db, "rotas-estudos"));
        
        const rotasData = rotasSnap.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, nome: data.nome || data.titulo || "(sem nome)", ...data };
        });
        
        setRotas(rotasData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setMsg("❌ Erro ao carregar dados do Firebase.");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchAssociacoes() {
      if (!clienteSelecionado) return setAssociacoes([]);
      const cliente = clientes.find(c => c.id === clienteSelecionado);
      setAssociacoes(cliente?.rotasEstudo || []);
    }
    fetchAssociacoes();
  }, [clienteSelecionado, clientes]);

  const associarRota = async () => {
    if (!clienteSelecionado || !rotaSelecionada) return;
    setAssociando(true);
    setMsg("");
    const codigo = gerarCodigo();
    try {
      const clienteRef = doc(db, "clientes", clienteSelecionado);
      await updateDoc(clienteRef, {
        rotasEstudo: arrayUnion({ rotaId: rotaSelecionada, codigo })
      });
      setMsg("✅ Associação realizada!");
      setRotaSelecionada("");
      // Atualiza lista local
      setClientes(clientes => clientes.map(c => c.id === clienteSelecionado ? {
        ...c,
        rotasEstudo: [...(c.rotasEstudo || []), { rotaId: rotaSelecionada, codigo }]
      } : c));
    } catch (e) {
      setMsg("❌ Erro ao associar rota.");
    }
    setAssociando(false);
  };

  // Função para associar múltiplas rotas
  const associarRotasMultiplas = async () => {
    if (!clienteSelecionado || rotasSelecionadas.length === 0) return;
    setAssociando(true);
    setMsg("");
    
    try {
      const clienteRef = doc(db, "clientes", clienteSelecionado);
      const novasAssociacoes = rotasSelecionadas.map(rotaId => ({
        rotaId,
        codigo: gerarCodigo()
      }));
      
      // Adiciona todas as rotas de uma vez
      await updateDoc(clienteRef, {
        rotasEstudo: arrayUnion(...novasAssociacoes)
      });
      
      setMsg(`✅ ${rotasSelecionadas.length} rota(s) associada(s) com sucesso!`);
      setRotasSelecionadas([]);
      
      // Atualiza lista local
      setClientes(clientes => clientes.map(c => c.id === clienteSelecionado ? {
        ...c,
        rotasEstudo: [...(c.rotasEstudo || []), ...novasAssociacoes]
      } : c));
    } catch (e) {
      setMsg("❌ Erro ao associar rotas.");
    }
    setAssociando(false);
  };

  // Função para alternar seleção de rota
  const toggleRotaSelecionada = (rotaId: string) => {
    setRotasSelecionadas(prev => 
      prev.includes(rotaId) 
        ? prev.filter(id => id !== rotaId)
        : [...prev, rotaId]
    );
  };

  // Função para selecionar/deselecionar todas as rotas
  const toggleTodasRotas = () => {
    if (rotasSelecionadas.length === rotas.length) {
      setRotasSelecionadas([]);
    } else {
      // Filtra rotas que não estão já associadas
      const rotasJaAssociadas = associacoes.map(a => a.rotaId);
      const rotasDisponiveis = rotas.filter(r => !rotasJaAssociadas.includes(r.id));
      setRotasSelecionadas(rotasDisponiveis.map(r => r.id));
    }
  };

  // Função para remover associação
  const removerAssociacao = async (rotaId: string, codigo: string) => {
    if (!clienteSelecionado) return;
    setAssociando(true);
    setMsg("");
    try {
      const clienteRef = doc(db, "clientes", clienteSelecionado);
      // Remove do array local e do Firestore
      const assocToRemove = { rotaId, codigo };
      await updateDoc(clienteRef, {
        rotasEstudo: (associacoes.filter(a => !(a.rotaId === rotaId && a.codigo === codigo)))
      });
      setMsg("✅ Associação removida!");
      setClientes(clientes => clientes.map(c => c.id === clienteSelecionado ? {
        ...c,
        rotasEstudo: (c.rotasEstudo || []).filter(a => !(a.rotaId === rotaId && a.codigo === codigo))
      } : c));
    } catch (e) {
      setMsg("❌ Erro ao remover associação.");
    }
    setAssociando(false);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-2xl mx-auto py-12 px-4">
            <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Associar Rotas de Estudos a Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
                  <select
                    className="w-full bg-gray-700 border-gray-600 text-white p-2 rounded"
                    value={clienteSelecionado}
                    onChange={e => {
                      setClienteSelecionado(e.target.value);
                      setRotasSelecionadas([]);
                      setRotaSelecionada("");
                    }}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => {
                      // Criar uma exibição mais completa do cliente
                      let displayName = "";
                      if (cliente.razaoSocial && cliente.nomeFantasia) {
                        displayName = `${cliente.razaoSocial} (${cliente.nomeFantasia})`;
                      } else if (cliente.razaoSocial) {
                        displayName = cliente.razaoSocial;
                      } else if (cliente.nomeFantasia) {
                        displayName = cliente.nomeFantasia;
                      } else {
                        displayName = cliente.nome || "(sem nome)";
                      }
                      
                      return (
                        <option key={cliente.id} value={cliente.id}>{displayName}</option>
                      );
                    })}
                  </select>
                </div>

                {/* Toggle entre modo simples e múltiplo */}
                {clienteSelecionado && (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={modoMultiplo}
                        onChange={e => {
                          setModoMultiplo(e.target.checked);
                          setRotasSelecionadas([]);
                          setRotaSelecionada("");
                        }}
                        className="rounded"
                      />
                      Modo seleção múltipla
                    </label>
                  </div>
                )}

                {clienteSelecionado && !modoMultiplo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rota de Estudos</label>
                    <select
                      className="w-full bg-gray-700 border-gray-600 text-white p-2 rounded"
                      value={rotaSelecionada}
                      onChange={e => setRotaSelecionada(e.target.value)}
                    >
                      <option value="">Selecione uma rota</option>
                      {rotas.filter(rota => !associacoes.some(a => a.rotaId === rota.id)).map(rota => (
                        <option key={rota.id} value={rota.id}>{rota.nome}</option>
                      ))}
                    </select>
                  </div>
                )}

                {clienteSelecionado && modoMultiplo && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">Rotas de Estudos</label>
                      <button
                        type="button"
                        onClick={toggleTodasRotas}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        {rotasSelecionadas.length === rotas.filter(r => !associacoes.some(a => a.rotaId === r.id)).length 
                          ? "Desmarcar todas" 
                          : "Selecionar todas"}
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 bg-gray-800 rounded p-3">
                      {rotas.filter(rota => !associacoes.some(a => a.rotaId === rota.id)).map(rota => (
                        <label key={rota.id} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rotasSelecionadas.includes(rota.id)}
                            onChange={() => toggleRotaSelecionada(rota.id)}
                            className="rounded"
                          />
                          <span className="text-white">{rota.nome}</span>
                        </label>
                      ))}
                      {rotas.filter(rota => !associacoes.some(a => a.rotaId === rota.id)).length === 0 && (
                        <p className="text-gray-400 text-center py-4">Todas as rotas já estão associadas a este cliente</p>
                      )}
                    </div>
                    {rotasSelecionadas.length > 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        {rotasSelecionadas.length} rota(s) selecionada(s)
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={modoMultiplo ? associarRotasMultiplas : associarRota}
                  disabled={associando || !clienteSelecionado || (modoMultiplo ? rotasSelecionadas.length === 0 : !rotaSelecionada)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  {associando 
                    ? "Associando..." 
                    : modoMultiplo 
                      ? `Associar ${rotasSelecionadas.length} Rota(s) ao Cliente`
                      : "Associar Rota ao Cliente"}
                </Button>
                {msg && (
                  <div className={`p-3 rounded-lg text-center font-semibold ${msg.includes("✅") ? "bg-green-600/20 text-green-400 border border-green-600" : "bg-red-600/20 text-red-400 border border-red-600"}`}>{msg}</div>
                )}
              </CardContent>
            </Card>
            {/* Lista de rotas associadas ao cliente */}
            {associacoes.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Rotas Associadas ao Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {associacoes.map((assoc, idx) => {
                      const rota = rotas.find(r => r.id === assoc.rotaId);
                      return (
                        <li key={idx} className="flex items-center gap-4 bg-gray-700/50 p-3 rounded-lg border border-gray-600 text-white">
                          <span className="font-bold">{rota?.nome || assoc.rotaId}</span>
                          <span className="ml-auto text-xs bg-gray-900 px-2 py-1 rounded">Código: <b>{assoc.codigo}</b></span>
                          <Button
                            onClick={() => removerAssociacao(assoc.rotaId, assoc.codigo)}
                            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            disabled={associando}
                          >
                            Remover
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
