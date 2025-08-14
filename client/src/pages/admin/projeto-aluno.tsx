import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Card, CardContent } from "../../components/ui/card";
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

export default function AdminVisualizarComoAluno() {
  const [match, params] = useRoute("/admin/projeto-aluno/:id");
  const [, setLocation] = useLocation();
  const [projeto, setProjeto] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [imagemModal, setImagemModal] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjeto() {
      if (!params?.id) {
        setErro(true);
        setCarregando(false);
        return;
      }
      setCarregando(true);
      setErro(false);
      try {
        const docRef = doc(db, "projetos-pedagogicos-avancados", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjeto({ id: params.id, ...docSnap.data() });
        } else {
          setErro(true);
        }
      } catch (e) {
        setErro(true);
      }
      setCarregando(false);
    }
    fetchProjeto();
  }, [params?.id]);

  function voltarParaProjeto() {
    setLocation(`/admin/projeto/${params?.id}`);
  }

  function proximaEtapa() {
    if (etapaAtual < projeto.etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    }
  }

  function etapaAnterior() {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  }

  function irParaEtapa(index: number) {
    setEtapaAtual(index);
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <div className="text-2xl font-bold">Carregando projeto...</div>
        </div>
      </div>
    );
  }
  if (erro || !projeto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl font-bold mb-4">Projeto não encontrado</div>
          <Button onClick={voltarParaProjeto} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full">
            Voltar ao projeto
          </Button>
        </div>
      </div>
    );
  }
  const etapa = projeto.etapas[etapaAtual];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Header com navegação */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={voltarParaProjeto} 
            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-4 py-2 rounded-full border border-white/20"
          >
            ← Sair da Visualização
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              👨‍🎓 Modo Aluno
            </h1>
            <p className="text-gray-300 text-sm">
              {projeto.titulo}
            </p>
          </div>
          <div className="text-white text-sm">
            Etapa {etapaAtual + 1} de {projeto.etapas.length}
          </div>
        </div>
        {/* Indicador de Progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex gap-2">
              {projeto.etapas.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => irParaEtapa(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    index === etapaAtual
                      ? 'bg-yellow-500 text-black scale-110'
                      : index < etapaAtual
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                  title={`Etapa ${index + 1}: ${projeto.etapas[index].titulo}`}
                >
                  {index < etapaAtual ? '✓' : index + 1}
                </button>
              ))}
            </div>
          </div>
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((etapaAtual + 1) / projeto.etapas.length) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Etapa Atual */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur overflow-hidden mb-8">
          <div className={`h-3 bg-gradient-to-r ${etapa.background}`}></div>
          <CardContent className="p-0">
            <div className={`rounded-b-3xl p-12 text-center shadow-2xl bg-gradient-to-br ${etapa.background} relative`}>
              {/* Badge da Etapa */}
              <div className="absolute top-6 left-6 bg-black/40 backdrop-blur px-4 py-2 rounded-full text-white font-bold">
                Etapa {etapaAtual + 1}
              </div>
              {/* Ícone e Título */}
              <div className="text-9xl mb-8 animate-bounce">{etapa.icon}</div>
              <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">{etapa.titulo}</h2>
              <p className="text-xl text-white text-opacity-95 leading-relaxed mb-8 max-w-4xl mx-auto">
                {etapa.descricao}
              </p>
              {/* Código da Etapa */}
              {etapa.codigo && (
                <div className="mt-8 bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto">
                  <h3 className="text-white font-bold text-2xl mb-4 flex items-center justify-center">
                    <span className="text-3xl mr-3">💻</span>
                    Código para esta Etapa:
                  </h3>
                  <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 overflow-x-auto border-2 border-gray-600">
                    <pre className="text-green-300 text-lg font-mono text-left whitespace-pre-wrap leading-relaxed">
                      {etapa.codigo}
                    </pre>
                  </div>
                </div>
              )}
              {/* Imagem dos Blocos */}
              {etapa.imagemBlocos && (
                <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto">
                  <h3 className="text-white font-bold text-2xl mb-4 flex items-center justify-center">
                    <span className="text-3xl mr-3">🖼️</span>
                    Imagem dos Blocos:
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src={etapa.imagemBlocos}
                      alt={`Blocos da etapa: ${etapa.titulo}`}
                      className="max-h-96 w-auto rounded-xl border-2 border-white border-opacity-30 shadow-2xl cursor-pointer hover:scale-105 transition-all"
                      onClick={() => setImagemModal(etapa.imagemBlocos)}
                      title="Clique para ampliar"
                    />
                  </div>
                </div>
              )}
              {/* Modal de Imagem Ampliada */}
              {imagemModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                  <div className="relative">
                    <img
                      src={imagemModal}
                      alt="Imagem ampliada"
                      className="max-h-[80vh] max-w-[90vw] rounded-xl border-4 border-white shadow-2xl"
                    />
                    <button
                      onClick={() => setImagemModal(null)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full text-2xl font-bold shadow-lg"
                      title="Fechar imagem"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              {/* Objetivos */}
              {etapa.objetivos && etapa.objetivos.length > 0 && (
                <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
                  <h3 className="text-white font-bold text-2xl mb-4 flex items-center justify-center">
                    <span className="text-3xl mr-3">🎯</span>
                    Objetivos desta Etapa:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    {etapa.objetivos.map((obj: any, i: number) => (
                      <div key={i} className="flex items-center bg-white/20 rounded-xl p-4 transition-all hover:bg-white/30">
                        <span className="text-3xl mr-4">{obj.icon}</span>
                        <span className="text-left text-lg">{obj.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Botão de Ação */}
              {etapa.action && (
                <div className="mt-8 flex justify-center">
                  <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-6 px-12 rounded-2xl text-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    {etapa.action}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Navegação entre Etapas */}
        <div className="flex items-center justify-between">
          <Button
            onClick={etapaAnterior}
            disabled={etapaAtual === 0}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              etapaAtual === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105'
            }`}
          >
            ← Etapa Anterior
          </Button>
          <div className="text-center">
            <div className="text-white text-2xl font-bold mb-2">
              {etapaAtual + 1} / {projeto.etapas.length}
            </div>
            <div className="text-gray-300 text-sm">
              {etapaAtual === projeto.etapas.length - 1 ? 'Última etapa!' : 'Continue o projeto'}
            </div>
          </div>
          <Button
            onClick={proximaEtapa}
            disabled={etapaAtual === projeto.etapas.length - 1}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              etapaAtual === projeto.etapas.length - 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white hover:scale-105'
            }`}
          >
            Próxima Etapa →
          </Button>
        </div>
        {/* Mensagem de Conclusão */}
        {etapaAtual === projeto.etapas.length - 1 && (
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500 backdrop-blur">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Parabéns! Você concluiu todas as etapas!
                </h3>
                <p className="text-green-300 text-lg mb-6">
                  Você completou com sucesso o projeto "{projeto.titulo}"
                </p>
                <Button 
                  onClick={voltarParaProjeto}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg"
                >
                  🏠 Voltar ao Projeto
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
