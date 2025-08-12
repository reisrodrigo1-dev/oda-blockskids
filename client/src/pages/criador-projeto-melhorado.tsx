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

interface Etapa {
  titulo: string;
  descricao: string;
  background: string;
  icon: string;
  action: string;
  codigo: string;
  imagemBlocos: string;
  objetivos: Objetivo[];
}

export default function CriadorProjetoMelhorado() {
  const [tituloProjeto, setTituloProjeto] = useState("");
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [novaEtapa, setNovaEtapa] = useState<Etapa>({ 
    titulo: "", 
    descricao: "", 
    background: "from-blue-900 via-purple-800 to-indigo-900", 
    icon: "", 
    action: "", 
    codigo: "",
    imagemBlocos: "",
    objetivos: [] 
  });
  const [novoObjetivo, setNovoObjetivo] = useState<Objetivo>({ icon: "", text: "" });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const adicionarObjetivo = () => {
    if (novoObjetivo.icon && novoObjetivo.text.trim()) {
      setNovaEtapa({ 
        ...novaEtapa, 
        objetivos: [...novaEtapa.objetivos, novoObjetivo] 
      });
      setNovoObjetivo({ icon: "", text: "" });
    }
  };

  const removerObjetivo = (index: number) => {
    const novosObjetivos = novaEtapa.objetivos.filter((_, i) => i !== index);
    setNovaEtapa({ ...novaEtapa, objetivos: novosObjetivos });
  };

  const adicionarEtapa = () => {
    if (novaEtapa.titulo.trim() && novaEtapa.descricao.trim()) {
      setEtapas([...etapas, novaEtapa]);
      setNovaEtapa({ 
        titulo: "", 
        descricao: "", 
        background: "from-blue-900 via-purple-800 to-indigo-900", 
        icon: "", 
        action: "", 
        codigo: "",
        imagemBlocos: "",
        objetivos: [] 
      });
    }
  };

  const removerEtapa = (index: number) => {
    const novasEtapas = etapas.filter((_, i) => i !== index);
    setEtapas(novasEtapas);
  };

  const salvarProjeto = async () => {
    if (!tituloProjeto.trim() || etapas.length === 0) {
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
      setMsg("🎉 Projeto salvo com sucesso!");
      setTituloProjeto("");
      setEtapas([]);
    } catch (e) {
      setMsg("❌ Erro ao salvar projeto.");
    }
    setSalvando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            ✨ Criador de Projeto Avançado
          </h1>
          <p className="text-xl text-gray-300">
            Crie projetos pedagógicos visuais e interativos
          </p>
        </div>

        {/* Título do Projeto */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Título do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={tituloProjeto}
              onChange={e => setTituloProjeto(e.target.value)}
              placeholder="Ex: Missão: Robô Marciano"
              className="bg-gray-700 border-gray-600 text-white text-lg p-4"
            />
          </CardContent>
        </Card>

        {/* Formulário para Nova Etapa */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Adicionar Nova Etapa/Aula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Título da Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📝 Título da Etapa
              </label>
              <Input
                placeholder="Ex: Montagem do Robô Marciano"
                value={novaEtapa.titulo}
                onChange={(e) => setNovaEtapa({ ...novaEtapa, titulo: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Descrição da Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📋 Descrição da Etapa
              </label>
              <Textarea
                placeholder="Descreva o que os alunos farão nesta etapa..."
                value={novaEtapa.descricao}
                onChange={(e) => setNovaEtapa({ ...novaEtapa, descricao: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            {/* Seletor de Gradiente */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎨 Tema Visual da Etapa
              </label>
              <div className="grid grid-cols-4 gap-3">
                {gradientes.map((gradiente, index) => (
                  <div
                    key={index}
                    className={`relative h-20 rounded-xl cursor-pointer border-2 transition-all duration-300 bg-gradient-to-r ${gradiente.classe} ${
                      novaEtapa.background === gradiente.classe 
                        ? 'border-yellow-400 scale-105 ring-2 ring-yellow-400/50' 
                        : 'border-gray-600 hover:border-gray-400 hover:scale-102'
                    }`}
                    onClick={() => setNovaEtapa({ ...novaEtapa, background: gradiente.classe })}
                    title={gradiente.nome}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">{gradiente.preview}</span>
                      {novaEtapa.background === gradiente.classe && (
                        <div className="absolute top-1 right-1 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-xl text-center">
                      {gradiente.nome}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                🎯 Tema selecionado: <span className="font-semibold">{gradientes.find(g => g.classe === novaEtapa.background)?.nome}</span>
              </p>
            </div>

            {/* Seletor de Ícone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎭 Ícone Representativo da Etapa
              </label>
              <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-gray-700/50">
                {icones.map((icone, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl hover:bg-gray-600 transition-all duration-200 ${
                      novaEtapa.icon === icone 
                        ? 'bg-blue-600 ring-2 ring-yellow-400 scale-110' 
                        : 'bg-gray-800 hover:scale-105'
                    }`}
                    onClick={() => setNovaEtapa({ ...novaEtapa, icon: icone })}
                    title={icone}
                  >
                    {icone}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                🎯 Ícone selecionado: {novaEtapa.icon ? (
                  <span className="font-semibold">{novaEtapa.icon}</span>
                ) : (
                  <span className="italic">Nenhum ícone selecionado</span>
                )}
              </p>
            </div>

            {/* Ação da Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ⚡ Ação Principal da Etapa
              </label>
              <Input
                placeholder="Ex: Construir, Programar, Testar, Apresentar"
                value={novaEtapa.action}
                onChange={(e) => setNovaEtapa({ ...novaEtapa, action: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Código da Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                💻 Código para esta Etapa
              </label>
              <Textarea
                placeholder="Cole aqui o código que será usado nesta etapa..."
                value={novaEtapa.codigo}
                onChange={(e) => setNovaEtapa({ ...novaEtapa, codigo: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                rows={6}
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 Dica: Cole o código Arduino ou de blocos que os alunos irão usar
              </p>
            </div>

            {/* Upload de Imagem dos Blocos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🖼️ Inserir Imagem dos Blocos
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setNovaEtapa({ ...novaEtapa, imagemBlocos: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-300 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 file:cursor-pointer
                    cursor-pointer border border-gray-600 rounded-lg p-2 bg-gray-700"
                />
                
                {/* Preview da Imagem */}
                {novaEtapa.imagemBlocos && (
                  <div className="relative">
                    <img
                      src={novaEtapa.imagemBlocos}
                      alt="Preview dos blocos"
                      className="max-h-40 w-auto rounded-lg border border-gray-600"
                    />
                    <button
                      onClick={() => setNovaEtapa({ ...novaEtapa, imagemBlocos: "" })}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-sm"
                      title="Remover imagem"
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                <p className="text-xs text-gray-400">
                  📸 Formatos aceitos: JPG, PNG, GIF | Tamanho máximo: 5MB
                </p>
              </div>
            </div>

            {/* Objetivos da Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎯 Objetivos de Aprendizagem (opcional)
              </label>
              
              {/* Adicionar Objetivo */}
              <div className="bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-600">
                <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                  <span>➕</span>
                  Adicionar Novo Objetivo
                </h4>
                
                {/* Seletor de Ícone para Objetivo */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-2">Ícone do Objetivo</label>
                  <div className="grid grid-cols-10 gap-1 max-h-24 overflow-y-auto border border-gray-600 rounded p-2 bg-gray-800">
                    {iconesObjetivos.map((icone, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center rounded text-lg hover:bg-gray-600 transition-all duration-200 ${
                          novoObjetivo.icon === icone 
                            ? 'bg-blue-600 ring-2 ring-yellow-400 scale-110' 
                            : 'bg-gray-700 hover:scale-105'
                        }`}
                        onClick={() => setNovoObjetivo({ ...novoObjetivo, icon: icone })}
                        title={icone}
                      >
                        {icone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Texto do Objetivo */}
                <div className="flex gap-2">
                  <Input
                    value={novoObjetivo.text}
                    onChange={(e) => setNovoObjetivo({ ...novoObjetivo, text: e.target.value })}
                    placeholder="Descreva o objetivo de aprendizagem..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white text-sm"
                  />
                  <Button 
                    onClick={adicionarObjetivo} 
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                    disabled={!novoObjetivo.icon || !novoObjetivo.text.trim()}
                  >
                    <span className="text-lg">➕</span>
                  </Button>
                </div>
              </div>

              {/* Lista de Objetivos Adicionados */}
              {novaEtapa.objetivos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white text-sm font-medium flex items-center gap-2">
                    <span>📋</span>
                    Objetivos Adicionados ({novaEtapa.objetivos.length})
                  </h4>
                  {novaEtapa.objetivos.map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg border border-gray-600 text-white">
                      <span className="text-xl">{obj.icon}</span>
                      <span className="flex-1 text-sm">{obj.text}</span>
                      <button 
                        onClick={() => removerObjetivo(idx)} 
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded transition-all"
                        title="Remover objetivo"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              onClick={adicionarEtapa} 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              disabled={!novaEtapa.titulo.trim() || !novaEtapa.descricao.trim()}
            >
              <span className="text-xl mr-2">✨</span>
              Adicionar Etapa ao Projeto
            </Button>
          </CardContent>
        </Card>

        {/* Preview das Etapas */}
        {etapas.length > 0 && (
          <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                Preview do Projeto ({etapas.length} etapa{etapas.length !== 1 ? 's' : ''})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {etapas.map((etapa, index) => (
                  <div key={index} className={`p-6 rounded-xl bg-gradient-to-r ${etapa.background} border border-gray-600 relative`}>
                    <button
                      onClick={() => removerEtapa(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all"
                      title="Remover etapa"
                    >
                      <span className="text-sm">🗑️</span>
                    </button>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{etapa.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{etapa.titulo}</h3>
                        <p className="text-gray-200 mb-4">{etapa.descricao}</p>
                        
                        {/* Código da Etapa */}
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

                        {/* Imagem dos Blocos */}
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

                        {etapa.objetivos.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                              <span>🎯</span>
                              Objetivos:
                            </h4>
                            <div className="space-y-1">
                              {etapa.objetivos.map((obj, objIdx) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão Salvar e Mensagens */}
        <div className="text-center space-y-4">
          <Button
            onClick={salvarProjeto}
            disabled={salvando || !tituloProjeto.trim() || etapas.length === 0}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105"
          >
            {salvando ? (
              <>
                <span className="text-2xl mr-2">⏳</span>
                Salvando Projeto...
              </>
            ) : (
              <>
                <span className="text-2xl mr-2">💾</span>
                Salvar Projeto Completo
              </>
            )}
          </Button>

          {msg && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              msg.includes("sucesso") 
                ? "bg-green-600/20 text-green-400 border border-green-600" 
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
