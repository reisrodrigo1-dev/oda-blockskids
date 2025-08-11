import React, { useState } from "react";
import { useLocation } from "wouter";

const EnergiasSustentaveis: React.FC = () => {
  const [, setLocation] = useLocation();
  const [cenaAtual, setCenaAtual] = useState(0);

  const cenas = [
    {
      titulo: "⚡ Bem-vindos ao Centro de Energias Limpa!",
      conteudo: "Olá, futuros engenheiros de energia! Sou o Dr. João, especialista em energias renováveis. Hoje vocês descobrirão como podemos gerar eletricidade sem poluir o planeta! Vamos explorar tecnologias incríveis que capturam energia do sol, vento e água para alimentar nossas casas e cidades.",
      personagem: "👨‍🔬",
      fundo: "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500",
      objetivos: [
        "Compreender fontes de energia renovável",
        "Conhecer tecnologias de geração limpa",
        "Entender a importância da transição energética"
      ]
    },
    {
      titulo: "☀️ Usina Solar Inteligente",
      conteudo: "Vejam esta incrível fazenda solar! Milhares de painéis capturam a luz do sol e a transformam em eletricidade. Mas o mais fantástico é que eles se movem automaticamente seguindo o sol durante todo o dia! Sensores detectam a posição solar e motores giram os painéis para captar máxima energia. É como girassóis robóticos!",
      personagem: "🌞",
      fundo: "bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400",
      objetivos: [
        "Aprender sobre energia fotovoltaica",
        "Compreender sistemas de rastreamento solar",
        "Entender conversão de luz em eletricidade"
      ]
    },
    {
      titulo: "💨 Parque Eólico Automatizado",
      conteudo: "Agora estamos no parque eólico mais moderno do mundo! Estas turbinas gigantes capturam a força do vento e geram eletricidade limpa. Sensores medem constantemente a velocidade e direção do vento. Um computador ajusta automaticamente a posição das hélices para captar máxima energia. Quando o vento está muito forte, elas se protegem automaticamente!",
      personagem: "🌪️",
      fundo: "bg-gradient-to-br from-sky-300 via-blue-400 to-cyan-500",
      objetivos: [
        "Conhecer energia eólica e aerogeradores",
        "Entender sensores de velocidade do vento",
        "Aprender sobre controle automático de turbinas"
      ]
    },
    {
      titulo: "🔋 Centro de Armazenamento Inteligente",
      conteudo: "Este é o coração do sistema energético! Baterias gigantes armazenam energia quando há muito sol e vento. Quando está nublado ou sem vento, elas fornecem eletricidade para a cidade. Sensores monitoram constantemente o nível de carga e um sistema inteligente decide quando armazenar ou fornecer energia. É como uma poupança de eletricidade!",
      personagem: "🔋",
      fundo: "bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500",
      objetivos: [
        "Compreender armazenamento de energia",
        "Conhecer sistemas de baterias inteligentes",
        "Entender gestão automatizada de energia"
      ]
    },
    {
      titulo: "🏠 Casa Autossuficiente",
      conteudo: "Conheçam a casa do futuro! Painéis solares no telhado, mini turbina eólica no quintal e bateria na garagem. A casa produz sua própria energia limpa! Sensores inteligentes controlam quando usar energia da rede ou das fontes próprias. Durante o dia, ela até vende energia excedente para os vizinhos. Uma verdadeira casa sustentável!",
      personagem: "🏡",
      fundo: "bg-gradient-to-br from-green-200 via-lime-300 to-emerald-400",
      objetivos: [
        "Aprender sobre microgeração residencial",
        "Compreender sistemas híbridos de energia",
        "Entender eficiência energética doméstica"
      ]
    },
    {
      titulo: "🌍 Missão Cumprida: Guardiões da Energia Limpa!",
      conteudo: "Parabéns, engenheiros do futuro sustentável! Vocês descobriram como podemos gerar energia sem prejudicar nosso planeta. Com energia solar, eólica e sistemas inteligentes, podemos ter eletricidade limpa e abundante para todos! O futuro depende de vocês para continuar desenvolvendo essas tecnologias. Que inovação energética vocês criariam?",
      personagem: "🏆",
      fundo: "bg-gradient-to-br from-emerald-400 via-green-500 to-cyan-600",
      objetivos: [
        "Refletir sobre sustentabilidade energética",
        "Inspirar inovações em energia limpa",
        "Planejar projetos de energia renovável"
      ]
    }
  ];

  const proximaCena = () => {
    if (cenaAtual < cenas.length - 1) {
      setCenaAtual(cenaAtual + 1);
    }
  };

  const cenaAnterior = () => {
    if (cenaAtual > 0) {
      setCenaAtual(cenaAtual - 1);
    }
  };

  const voltarProjeto = () => {
    setLocation("/projeto-pedagogico");
  };

  const cena = cenas[cenaAtual];

  return (
    <div className={`min-h-screen ${cena.fundo} flex flex-col items-center justify-center p-8 font-nunito`}>
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-spin-slow">{cena.personagem}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{cena.titulo}</h1>
          <div className="bg-yellow-100 rounded-2xl p-6 text-lg text-gray-700 leading-relaxed">
            {cena.conteudo}
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
            <span className="mr-3">🎯</span>
            Objetivos desta Etapa:
          </h3>
          <ul className="space-y-3">
            {cena.objetivos.map((objetivo, index) => (
              <li key={index} className="flex items-center text-lg text-gray-700">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">
                  {index + 1}
                </span>
                {objetivo}
              </li>
            ))}
          </ul>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <button
            onClick={cenaAnterior}
            disabled={cenaAtual === 0}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              cenaAtual === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105"
            }`}
          >
            ← Anterior
          </button>

          <div className="flex items-center space-x-2">
            {cenas.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === cenaAtual
                    ? "bg-orange-500 scale-125"
                    : index < cenaAtual
                    ? "bg-yellow-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {cenaAtual === cenas.length - 1 ? (
            <button
              onClick={voltarProjeto}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
            >
              Concluir ✓
            </button>
          ) : (
            <button
              onClick={proximaCena}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300"
            >
              Próximo →
            </button>
          )}
        </div>

        {/* Progresso */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da Aula</span>
            <span>{cenaAtual + 1} de {cenas.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((cenaAtual + 1) / cenas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergiasSustentaveis;
