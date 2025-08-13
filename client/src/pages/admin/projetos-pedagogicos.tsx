import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "./DashboardLayout";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

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

export default function AdminProjetosPedagogicos() {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [, setLocation] = useLocation();
  const [projetoParaExcluir, setProjetoParaExcluir] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetchProjetos();
  }, []);

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

  function abrirProjeto(id: string) {
    setLocation(`/projeto/${id}`);
  }

  function visualizarComoAluno(id: string) {
    setLocation(`/projeto-aluno/${id}`);
  }

  function editarProjeto(id: string) {
    setLocation(`/editar-projeto/${id}`);
  }

  function criarNovoProjeto() {
    setLocation("/criador-projeto-melhorado");
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
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-6xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              📚 Projetos Pedagógicos Avançados
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore os projetos criados pela nossa comunidade educativa
            </p>
            <Button 
              onClick={criarNovoProjeto}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105"
            >
              ✨ Criar Novo Projeto
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
              <Button 
                onClick={criarNovoProjeto}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg"
              >
                ✨ Criar Primeiro Projeto
              </Button>
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
                      {/* Preview das Etapas */}
                      <div className="text-gray-300 text-sm">
                        <span className="font-semibold">{projeto.etapas?.length || 0}</span> 
                        <span className="ml-1">etapa{(projeto.etapas?.length || 0) !== 1 ? 's' : ''}</span>
                      </div>
                      {/* Preview dos Ícones das Etapas */}
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
                      {/* Botões de Ação */}
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

          {/* Footer */}
          <div className="text-center mt-16 pt-8 border-t border-white/20">
            <p className="text-gray-300 mb-4">
              💡 Dica: Clique em qualquer projeto para visualizá-lo em uma nova tela
            </p>
            <Button 
              onClick={criarNovoProjeto}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-full"
            >
              ➕ Adicionar Novo Projeto
            </Button>
          </div>
        </div>

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
  );
}
