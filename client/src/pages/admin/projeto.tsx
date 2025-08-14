import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "./DashboardLayout";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

export default function AdminProjetoView() {
  const [match, params] = useRoute("/admin/projeto/:id");
  const [, setLocation] = useLocation();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [projeto, setProjeto] = useState<any>(null);

  useEffect(() => {
    async function fetchProjeto() {
      if (!params?.id) {
        setErro(true);
        setCarregando(false);
        return;
      }
      try {
        const ref = doc(db, "projetos-pedagogicos-avancados", params.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProjeto({ id: snap.id, ...snap.data() });
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

  function voltar() {
    setLocation("/admin/projetos-pedagogicos");
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <div className="text-2xl font-bold">Carregando projeto...</div>
        </div>
      </div>
    );
  }
  if (erro || !projeto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl font-bold mb-4">Projeto não encontrado</div>
          <Button onClick={voltar} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full">
            Voltar à lista de projetos
          </Button>
        </div>
      </div>
    );
  }
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <Button onClick={voltar} className="mb-6 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-6 py-3 rounded-full border border-white/20">
            ← Voltar aos Projetos
          </Button>
          <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white text-3xl font-bold flex items-center gap-2">
                <span>📚</span>
                {projeto.titulo}
              </CardTitle>
              <div className="text-gray-400 text-sm flex items-center gap-2 mt-2">
                <span>📅</span>
                {projeto.criadoEm && new Date(projeto.criadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })}
              </div>
            </CardHeader>
            <CardContent>
              {/* Lista de Materiais */}
              {projeto.materiais && projeto.materiais.length > 0 && (
                <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="text-2xl">📦</span>
                      Materiais do Projeto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-700">
                      {projeto.materiais.map((mat: any, idx: number) => (
                        <li key={idx} className="flex gap-4 py-2 text-white">
                          <span className="w-20 font-bold">{mat.quantidade}</span>
                          <span className="flex-1">{mat.nome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-8">
                {projeto.etapas && projeto.etapas.length > 0 ? (
                  projeto.etapas.map((etapa: any, idx: number) => (
                    <div key={idx} className={`p-6 rounded-xl bg-gradient-to-r ${etapa.background} border border-gray-600 mb-6`}>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{etapa.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{etapa.titulo}</h3>
                          <p className="text-gray-200 mb-4">{etapa.descricao}</p>
                          {etapa.codigo && (
                            <div className="mb-4">
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <span>💻</span>
                                Código:
                              </h4>
                              <div className="bg-black/30 p-3 rounded-lg border border-gray-600">
                                <pre className="text-green-300 text-sm overflow-x-auto font-mono">
                                  {etapa.codigo}
                                </pre>
                              </div>
                            </div>
                          )}
                          {etapa.imagemBlocos && (
                            <div className="mb-4">
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <span>🖼️</span>
                                Imagem dos Blocos:
                              </h4>
                              <img
                                src={etapa.imagemBlocos}
                                alt="Blocos da etapa"
                                className="max-h-48 w-auto rounded-lg border border-gray-600"
                              />
                            </div>
                          )}
                          {etapa.objetivos && etapa.objetivos.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <span>🎯</span>
                                Objetivos:
                              </h4>
                              <div className="space-y-1">
                                {etapa.objetivos.map((obj: any, objIdx: number) => (
                                  <div key={objIdx} className="flex items-center gap-2 text-gray-200">
                                    <span>{obj.icon}</span>
                                    <span className="text-sm">{obj.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {etapa.action && (
                            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                              {etapa.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-300">Nenhuma etapa cadastrada neste projeto.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
