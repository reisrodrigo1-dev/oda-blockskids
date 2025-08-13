import { useState, useEffect } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebase config
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

// Paleta de gradientes predefinidos
const gradientes = [
  { nome: "Vermelho Espacial", classe: "from-red-900 via-red-700 to-orange-600", preview: "🚀" },
  { nome: "Azul Profundo", classe: "from-blue-900 via-purple-800 to-indigo-900", preview: "🌌" },
  { nome: "Verde Tecnológico", classe: "from-green-800 via-teal-700 to-cyan-600", preview: "💻" },
  { nome: "Cinza Industrial", classe: "from-gray-800 via-gray-600 to-blue-700", preview: "🔧" },
  { nome: "Laranja Marciano", classe: "from-red-800 via-orange-700 to-yellow-600", preview: "🪐" },
  { nome: "Roxo Galáxia", classe: "from-purple-900 via-pink-800 to-indigo-900", preview: "✨" },
  { nome: "Verde Floresta", classe: "from-emerald-900 via-green-700 to-teal-600", preview: "🌲" },
  { nome: "Azul Oceano", classe: "from-blue-800 via-cyan-700 to-teal-600", preview: "🌊" },
];

// Lista de ícones disponíveis para etapas
const icones = [
  "🚀", "🛸", "🧑‍🚀", "👩‍🔬", "🤖", "👨‍💻", "🛰️", "🌟", "🔧", "💻", 
  "📱", "🎯", "🧠", "🤝", "⚡", "🎨", "🔬", "🌍", "🌱", "💡",
  "🏆", "📋", "🎪", "🎭", "🎲", "🎳", "🎮", "🎸", "🎹", "🎺",
  "⚗️", "🔭", "🪐", "🌙", "☄️", "🌟", "✨", "💫", "🌈", "🔥"
];

// Lista de ícones para objetivos
const iconesObjetivos = [
  "🎯", "🧠", "🤝", "⚡", "💡", "🔬", "🎨", "🚀", "📚", "🏆",
  "⭐", "🔥", "💪", "🌟", "🎪", "🎭", "🎲", "🎮", "🔧", "💻"
];

interface Objetivo {
  icon: string;
  text: string;
}


export default function CriadorProjetoMelhorado() {
  // Estados para criação de projeto (já existentes)
  // ...existing code...

  // Estados para gerenciamento de projetos
  const [projetos, setProjetos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [projetoParaExcluir, setProjetoParaExcluir] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Estados para criação de novo projeto (página dedicada)
  // (Os estados abaixo serão usados apenas na página de criação)

  // Carregar projetos ao montar
  useEffect(() => {
    fetchProjetos();
  }, []);

  // Redirecionar para página de criação de projeto
  function irParaCriarProjeto() {
    window.location.href = "/admin/criar-projeto";
  }

  async function fetchProjetos() {
    setCarregando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "projetos-pedagogicos-avancados"));
      const lista: any[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
      setProjetos(lista);
    } catch (error) {
      setMensagem("❌ Erro ao carregar projetos.");
    }
    setCarregando(false);
  }

  function editarProjeto(id: string) {
    window.location.href = `/admin/editar-projeto/${id}`;
  }

  function visualizarComoAluno(id: string) {
    window.open(`/projeto-aluno/${id}`, "_blank");
  }

  function abrirProjeto(id: string) {
    window.open(`/projeto/${id}`, "_blank");
  }

  function confirmarExclusao(id: string) {
    setProjetoParaExcluir(id);
  }

  function cancelarExclusao() {
    setProjetoParaExcluir(null);
  }

  async function excluirProjeto() {
    if (!projetoParaExcluir) return;
    setExcluindo(true);
    try {
      await deleteDoc(doc(db, "projetos-pedagogicos-avancados", projetoParaExcluir));
      setMensagem("✅ Projeto excluído com sucesso!");
      setProjetos(projetos.filter(p => p.id !== projetoParaExcluir));
      setProjetoParaExcluir(null);
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      setMensagem("❌ Erro ao excluir projeto.");
      setTimeout(() => setMensagem(""), 3000);
    }
    setExcluindo(false);
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              ✨ Criador e Gerenciador de Projetos Avançados
            </h1>
            <p className="text-xl text-gray-300">
              Crie, edite, visualize e exclua projetos pedagógicos avançados
            </p>
          </div>

          {/* Botão de Novo Projeto */}
          <div className="flex justify-end mb-8">
            <Button
              onClick={irParaCriarProjeto}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            >
              ➕ Novo Projeto
            </Button>
          </div>

          {/* Mensagem de Feedback */}
          {mensagem && (
            <div className={`mb-8 p-4 rounded-lg text-center font-semibold ${
              mensagem.includes("✅") 
                ? "bg-green-600/20 text-green-400 border border-green-600" 
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {mensagem}
            </div>
          )}

          {/* Loading State */}
          {carregando && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <div className="text-2xl font-bold">Carregando projetos...</div>
            </div>
          )}

          {/* Empty State */}
          {!carregando && projetos.length === 0 && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-2xl font-bold mb-4">Nenhum projeto encontrado</div>
              <p className="text-gray-300 mb-8">Seja o primeiro a criar um projeto pedagógico!</p>
            </div>
          )}

          {/* Projects Grid */}
          {!carregando && projetos.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projetos.map((projeto) => (
                <Card key={projeto.id} className="bg-gray-800/50 border-gray-700 backdrop-blur hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                      {projeto.titulo}
                    </CardTitle>
                    <div className="text-gray-400 text-sm flex items-center gap-2">
                      <span>📅</span>
                      {new Date(projeto.criadoEm).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-gray-300 text-sm">
                        <span className="font-semibold">{projeto.etapas?.length || 0}</span> 
                        <span className="ml-1">etapa{(projeto.etapas?.length || 0) !== 1 ? 's' : ''}</span>
                      </div>
                      {projeto.etapas && projeto.etapas.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {projeto.etapas.slice(0, 5).map((etapa: any, idx: number) => (
                            <span key={idx} className="text-2xl" title={etapa.titulo}>
                              {etapa.icon}
                            </span>
                          ))}
                          {projeto.etapas.length > 5 && (
                            <span className="text-gray-400 text-sm self-center">
                              +{projeto.etapas.length - 5} mais
                            </span>
                          )}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Button 
                          onClick={() => abrirProjeto(projeto.id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                        >
                          👁️ Visualizar Projeto
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            visualizarComoAluno(projeto.id);
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 rounded-lg transition-all duration-300"
                        >
                          👨‍🎓 Modo Aluno
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              editarProjeto(projeto.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-2 rounded-lg transition-all duration-300"
                          >
                            ✏️ Editar
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmarExclusao(projeto.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 rounded-lg transition-all duration-300"
                          >
                            🗑️ Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modal de Criação de Novo Projeto removido. Agora a criação é feita em página dedicada. */}

          {/* Modal de Confirmação de Exclusão */}
          {projetoParaExcluir && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
              <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Confirmar Exclusão</h3>
                  <p className="text-gray-300 mb-6">
                    Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={cancelarExclusao}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                      disabled={excluindo}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={excluirProjeto}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      disabled={excluindo}
                    >
                      {excluindo ? "Excluindo..." : "Excluir"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
