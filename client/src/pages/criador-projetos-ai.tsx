import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

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

export default function CriadorDeProjetosAI() {
  const [titulo, setTitulo] = useState("");
  const [atividade, setAtividade] = useState("");
  const [habilidade, setHabilidade] = useState("");
  const [publico, setPublico] = useState("");
  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");
  const handleSalvarFirebase = async () => {
    setSalvando(true);
    setMsg("");
    try {
      await addDoc(collection(db, "projetos-ai"), {
        titulo,
        atividade,
        habilidade,
        publico,
        resultado,
        criadoEm: new Date().toISOString()
      });
      setMsg("Projeto salvo com sucesso!");
    } catch (err) {
      setMsg("Erro ao salvar no Firebase");
    }
    setSalvando(false);
  };

  const handleGerarProjeto = async () => {
    setGerando(true);
    setResultado("");
    // Chamada para API do ChatGPT (OpenAI)
    try {
      const res = await fetch("/api/gerar-projeto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, atividade, habilidade, publico })
      });
      const data = await res.json();
      setResultado(data.resultado || "Erro ao gerar projeto");
    } catch (err) {
      setResultado("Erro ao conectar com a API");
    }
    setGerando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Criador de Projetos com IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Título do Projeto"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <Textarea
            placeholder="Descrição da Atividade"
            value={atividade}
            onChange={e => setAtividade(e.target.value)}
            rows={3}
          />
          <Input
            placeholder="Habilidade Desenvolvida"
            value={habilidade}
            onChange={e => setHabilidade(e.target.value)}
          />
          <Input
            placeholder="Público Alvo"
            value={publico}
            onChange={e => setPublico(e.target.value)}
          />
          <Button onClick={handleGerarProjeto} disabled={gerando || !titulo || !atividade} className="w-full bg-purple-600 hover:bg-purple-700">
            {gerando ? "Gerando..." : "Gerar Projeto com IA"}
          </Button>
          {resultado && (
            <>
              <div className="mt-4 p-4 bg-white rounded-lg shadow text-gray-800 whitespace-pre-wrap">
                {resultado}
              </div>
              <Button onClick={handleSalvarFirebase} disabled={salvando} className="w-full mt-2 bg-green-600 hover:bg-green-700">
                {salvando ? "Salvando..." : "Salvar no Firebase"}
              </Button>
              {msg && <div className="mt-2 text-green-700 font-bold">{msg}</div>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
