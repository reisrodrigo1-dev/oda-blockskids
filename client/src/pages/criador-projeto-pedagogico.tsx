import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
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
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

interface Etapa {
  titulo: string;
  atividade: string;
  habilidade: string;
}

export default function CriadorProjetoPedagogico() {
  const [tituloProjeto, setTituloProjeto] = useState("");
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [novaEtapa, setNovaEtapa] = useState<Etapa>({ titulo: "", atividade: "", habilidade: "" });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");
  async function salvarProjeto() {
    if (!tituloProjeto || etapas.length === 0) {
      setMsg("Preencha o título e adicione pelo menos uma etapa.");
      return;
    }
    setSalvando(true);
    setMsg("");
    try {
      await addDoc(collection(db, "projetos-pedagogicos"), {
        titulo: tituloProjeto,
        etapas,
        criadoEm: new Date().toISOString(),
      });
      setMsg("Projeto salvo com sucesso!");
      setTituloProjeto("");
      setEtapas([]);
    } catch (e) {
      setMsg("Erro ao salvar projeto.");
    }
    setSalvando(false);
  }

  function adicionarEtapa() {
    if (!novaEtapa.titulo || !novaEtapa.atividade || !novaEtapa.habilidade) return;
    setEtapas([...etapas, novaEtapa]);
    setNovaEtapa({ titulo: "", atividade: "", habilidade: "" });
  }

  function removerEtapa(idx: number) {
    setEtapas(etapas.filter((_, i) => i !== idx));
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">Criador de Projeto Pedagógico</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Título do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={tituloProjeto}
            onChange={e => setTituloProjeto(e.target.value)}
            placeholder="Ex: Tema #M21 – Exploração Espacial: Robô Marciano"
            className="mb-2"
          />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Adicionar Etapa/Aula</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={novaEtapa.titulo}
            onChange={e => setNovaEtapa({ ...novaEtapa, titulo: e.target.value })}
            placeholder="Título da etapa/aula"
            className="mb-2"
          />
          <Textarea
            value={novaEtapa.atividade}
            onChange={e => setNovaEtapa({ ...novaEtapa, atividade: e.target.value })}
            placeholder="Descrição da atividade"
            className="mb-2"
          />
          <Textarea
            value={novaEtapa.habilidade}
            onChange={e => setNovaEtapa({ ...novaEtapa, habilidade: e.target.value })}
            placeholder="Habilidade desenvolvida"
            className="mb-2"
          />
          <Button onClick={adicionarEtapa} className="mt-2 w-full bg-blue-600 hover:bg-blue-700">Adicionar Etapa</Button>
        </CardContent>
      </Card>

      {/* Visualização do Projeto */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Visualização do Projeto</h2>
        <Card>
          <CardHeader>
            <CardTitle>{tituloProjeto || "(Sem título)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {etapas.length === 0 && <div className="text-gray-400">Nenhuma etapa adicionada ainda.</div>}
              {etapas.map((etapa, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400 relative">
                  <button
                    onClick={() => removerEtapa(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    title="Remover etapa"
                  >✕</button>
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{etapa.titulo}</h3>
                  <p className="text-gray-700 mb-2"><span className="font-semibold">Atividade:</span> {etapa.atividade}</p>
                  <p className="text-gray-600"><span className="font-semibold">Habilidade:</span> {etapa.habilidade}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex flex-col items-center">
          <Button onClick={salvarProjeto} disabled={salvando} className="w-full max-w-xs bg-green-600 hover:bg-green-700">
            {salvando ? "Salvando..." : "Salvar Projeto no Banco"}
          </Button>
          {msg && <div className={`mt-2 text-sm ${msg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}
