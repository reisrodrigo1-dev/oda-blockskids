import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
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

// Paleta de gradientes predefinidos
const gradientes = [
  { nome: "Vermelho Espacial", classe: "from-red-900 via-red-700 to-orange-600" },
  { nome: "Azul Profundo", classe: "from-blue-900 via-purple-800 to-indigo-900" },
  { nome: "Verde Tecnológico", classe: "from-green-800 via-teal-700 to-cyan-600" },
  { nome: "Cinza Industrial", classe: "from-gray-800 via-gray-600 to-blue-700" },
  { nome: "Laranja Marciano", classe: "from-red-800 via-orange-700 to-yellow-600" },
  { nome: "Roxo Galáxia", classe: "from-purple-900 via-pink-800 to-indigo-900" },
  { nome: "Verde Floresta", classe: "from-emerald-900 via-green-700 to-teal-600" },
  { nome: "Azul Oceano", classe: "from-blue-800 via-cyan-700 to-teal-600" },
];

// Lista de ícones disponíveis
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

interface Etapa {
  titulo: string;
  descricao: string;
  background: string;
  icon: string;
  action: string;
  objetivos: Objetivo[];
}

export default function CriadorProjetoAvancado() {
  const [tituloProjeto, setTituloProjeto] = useState("");
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [novaEtapa, setNovaEtapa] = useState<Etapa>({ titulo: "", descricao: "", background: "from-blue-900 via-purple-800 to-indigo-900", icon: "", action: "", objetivos: [] });
  const [novoObjetivo, setNovoObjetivo] = useState<Objetivo>({ icon: "", text: "" });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  function adicionarObjetivo() {
    if (!novoObjetivo.icon || !novoObjetivo.text) return;
    setNovaEtapa({ ...novaEtapa, objetivos: [...novaEtapa.objetivos, novoObjetivo] });
    setNovoObjetivo({ icon: "", text: "" });
  }

  function removerObjetivo(idx: number) {
    setNovaEtapa({ ...novaEtapa, objetivos: novaEtapa.objetivos.filter((_, i) => i !== idx) });
  }

  function adicionarEtapa() {
    if (!novaEtapa.titulo || !novaEtapa.descricao || !novaEtapa.background || !novaEtapa.icon || !novaEtapa.action) return;
    setEtapas([...etapas, novaEtapa]);
    setNovaEtapa({ titulo: "", descricao: "", background: "from-blue-900 via-purple-800 to-indigo-900", icon: "", action: "", objetivos: [] });
  }

  function removerEtapa(idx: number) {
    setEtapas(etapas.filter((_, i) => i !== idx));
  }

  async function salvarProjeto() {
    if (!tituloProjeto || etapas.length === 0) {
      setMsg("Preencha o título e adicione pelo menos uma etapa.");
      return;
    }
    setSalvando(true);
    setMsg("");
    try {
      await addDoc(collection(db, "projetos-pedagogicos-avancados"), {
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

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">Criador de Projeto Avançado</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Título do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={tituloProjeto}
            onChange={e => setTituloProjeto(e.target.value)}
            placeholder="Ex: Missão: Robô Marciano"
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
            value={novaEtapa.descricao}
            onChange={e => setNovaEtapa({ ...novaEtapa, descricao: e.target.value })}
            placeholder="Descrição da etapa/aula"
            className="mb-2"
          />
          <Input
            value={novaEtapa.background}
            onChange={e => setNovaEtapa({ ...novaEtapa, background: e.target.value })}
            placeholder="Gradiente de fundo (ex: from-red-900 via-red-700 to-orange-600)"
            className="mb-2"
          />
          <Input
            value={novaEtapa.icon}
            onChange={e => setNovaEtapa({ ...novaEtapa, icon: e.target.value })}
            placeholder="Emoji/ícone grande (ex: 🚀)"
            className="mb-2"
          />
          <Input
            value={novaEtapa.action}
            onChange={e => setNovaEtapa({ ...novaEtapa, action: e.target.value })}
            placeholder="Texto do botão de ação (ex: Aceitar Missão)"
            className="mb-2"
          />
          <div className="mb-2">
            <div className="font-bold mb-1">Objetivos da etapa (opcional):</div>
            <div className="flex gap-2 mb-2">
              <Input
                value={novoObjetivo.icon}
                onChange={e => setNovoObjetivo({ ...novoObjetivo, icon: e.target.value })}
                placeholder="Ícone (ex: 🎯)"
                className="w-16"
              />
              <Input
                value={novoObjetivo.text}
                onChange={e => setNovoObjetivo({ ...novoObjetivo, text: e.target.value })}
                placeholder="Texto do objetivo"
                className="flex-1"
              />
              <Button onClick={adicionarObjetivo} className="bg-blue-500 hover:bg-blue-700">Adicionar</Button>
            </div>
            <div className="space-y-1">
              {novaEtapa.objetivos.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span>{obj.icon}</span>
                  <span>{obj.text}</span>
                  <button onClick={() => removerObjetivo(idx)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
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
            <div className="space-y-8">
              {etapas.length === 0 && <div className="text-gray-400">Nenhuma etapa adicionada ainda.</div>}
              {etapas.map((etapa, idx) => (
                <div key={idx} className={`rounded-3xl p-8 text-center shadow-2xl border border-white border-opacity-20 bg-gradient-to-br ${etapa.background} relative`}>
                  <button
                    onClick={() => removerEtapa(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    title="Remover etapa"
                  >✕</button>
                  <div className="text-8xl mb-6 animate-bounce">{etapa.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">{etapa.titulo}</h3>
                  <p className="text-lg text-white text-opacity-90 leading-relaxed mb-6 max-w-3xl mx-auto">{etapa.descricao}</p>
                  {etapa.objetivos.length > 0 && (
                    <div className="mt-6 bg-black bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 max-w-2xl mx-auto">
                      <h4 className="text-white font-bold text-lg mb-2 flex items-center">
                        <span className="text-2xl mr-3">📋</span>
                        Objetivos desta Etapa:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white text-sm">
                        {etapa.objetivos.map((obj, i) => (
                          <div key={i} className="flex items-center">
                            <span className="text-lg mr-2">{obj.icon}</span>
                            <span>{obj.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex justify-center">
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      {etapa.action}
                    </Button>
                  </div>
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
