import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

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

export default function ProjetoIndividual() {
  const [match, params] = useRoute("/projeto/:id");
  const [, setLocation] = useLocation();
  const [projeto, setProjeto] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

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
        console.error("Erro ao carregar projeto:", e);
        setErro(true);
      }
      setCarregando(false);
    }

    fetchProjeto();
  }, [params?.id]);

  function voltarParaLista() {
    setLocation("/projetos-avancados");
  }

  function visualizarComoAluno() {
    setLocation(`/projeto-aluno/${params?.id}`);
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
          <Button onClick={voltarParaLista} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full">
            Voltar à lista de projetos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button 
              onClick={voltarParaLista} 
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-6 py-3 rounded-full border border-white/20"
            >
              ← Voltar à Lista de Projetos
            </Button>
            <Button 
              onClick={visualizarComoAluno} 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-full border border-green-400/20"
            >
              👨‍🎓 Visualizar como Aluno
            </Button>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {projeto.titulo}
          </h1>
          <div className="text-white/70 text-lg mb-4">
            Criado em: {new Date(projeto.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="text-gray-300 text-sm">
            💡 Use o botão "Visualizar como Aluno" para ver como os estudantes experimentarão este projeto
          </div>
        </div>

        {/* Etapas do Projeto */}
        <div className="space-y-12">
          {projeto.etapas.map((etapa: any, idx: number) => (
            <Card key={idx} className="bg-gray-800/50 border-gray-700 backdrop-blur overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${etapa.background}`}></div>
              <CardContent className="p-0">
                <div className={`rounded-b-2xl p-8 text-center shadow-2xl bg-gradient-to-br ${etapa.background} relative`}>
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur px-3 py-1 rounded-full text-white text-sm font-bold">
                    Etapa {idx + 1}
                  </div>
                  
                  <div className="text-8xl mb-6 animate-bounce">{etapa.icon}</div>
                  <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">{etapa.titulo}</h3>
                  <p className="text-xl text-white text-opacity-90 leading-relaxed mb-6 max-w-4xl mx-auto">{etapa.descricao}</p>
                  
                  {/* Código da Etapa */}
                  {etapa.codigo && (
                    <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto">
                      <h4 className="text-white font-bold text-xl mb-4 flex items-center justify-center">
                        <span className="text-3xl mr-3">💻</span>
                        Código para esta Etapa:
                      </h4>
                      <div className="bg-gray-900 bg-opacity-70 rounded-xl p-6 overflow-x-auto border border-gray-600">
                        <pre className="text-green-300 text-base font-mono text-left whitespace-pre-wrap leading-relaxed">
                          {etapa.codigo}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Imagem dos Blocos */}
                  {etapa.imagemBlocos && (
                    <div className="mt-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto">
                      <h4 className="text-white font-bold text-xl mb-4 flex items-center justify-center">
                        <span className="text-3xl mr-3">🖼️</span>
                        Imagem dos Blocos:
                      </h4>
                      <div className="flex justify-center">
                        <img
                          src={etapa.imagemBlocos}
                          alt={`Blocos da etapa: ${etapa.titulo}`}
                          className="max-h-80 w-auto rounded-xl border-2 border-white border-opacity-20 shadow-2xl"
                        />
                      </div>
                    </div>
                  )}

                  {/* Objetivos */}
                  {etapa.objetivos && etapa.objetivos.length > 0 && (
                    <div className="mt-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
                      <h4 className="text-white font-bold text-xl mb-4 flex items-center justify-center">
                        <span className="text-3xl mr-3">🎯</span>
                        Objetivos desta Etapa:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                        {etapa.objetivos.map((obj: any, i: number) => (
                          <div key={i} className="flex items-center bg-white/10 rounded-lg p-3">
                            <span className="text-2xl mr-3">{obj.icon}</span>
                            <span className="text-left">{obj.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botão de Ação */}
                  {etapa.action && (
                    <div className="mt-8 flex justify-center">
                      <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        {etapa.action}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer da Página */}
        <div className="text-center mt-12 pt-8 border-t border-white/20">
          <Button 
            onClick={voltarParaLista} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105"
          >
            ← Voltar aos Projetos
          </Button>
        </div>
      </div>
    </div>
  );
}
