import React, { useState } from "react";
import { useLocation } from "wouter";

const CidadeInteligente: React.FC = () => {
  const [, setLocation] = useLocation();
  const [cenaAtual, setCenaAtual] = useState(0);

  const cenas = [
    {
      titulo: "🏙️ Bem-vindos à Cidade do Futuro!",
      conteudo: "Olá, urbanistas do amanhã! Sou o Dr. Carlos, especialista em cidades inteligentes. Hoje vocês farão uma viagem incrível pela cidade mais sustentável e tecnológica do mundo. Aqui, a tecnologia trabalha em harmonia com a natureza!",
      personagem: "👨‍💼",
      fundo: "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
      objetivos: [
        "Compreender o conceito de cidade inteligente",
        "Conhecer tecnologias urbanas sustentáveis",
        "Entender a importância do planejamento urbano"
      ]
    },
    {
      titulo: "🚦 Sistema de Trânsito Inteligente",
      conteudo: "Observem este cruzamento! Os semáforos se comunicam entre si e com os carros. Sensores detectam o fluxo de veículos e ajustam os tempos automaticamente. Não há mais engarrafamentos! Carros autônomos seguem linhas especiais no asfalto e se comunicam para evitar acidentes.",
      personagem: "🚗",
      fundo: "bg-gradient-to-br from-blue-400 via-green-500 to-yellow-400",
      objetivos: [
        "Aprender sobre sensores de tráfego",
        "Compreender comunicação entre veículos",
        "Entender seguimento de linha em carros autônomos"
      ]
    },
    {
      titulo: "♻️ Centro de Reciclagem Automático",
      conteudo: "Esta é nossa usina de reciclagem robótica! Robôs identificam diferentes tipos de lixo usando sensores especiais e os separam automaticamente. Garrafas plásticas viram roupas, papéis se transformam em novos cadernos, e o lixo orgânico vira adubo para as plantas da cidade!",
      personagem: "♻️",
      fundo: "bg-gradient-to-br from-green-300 via-blue-400 to-teal-500",
      objetivos: [
        "Conhecer automação na reciclagem",
        "Entender sensores de identificação de materiais",
        "Aprender sobre economia circular"
      ]
    },
    {
      titulo: "🌱 Jardins Verticais Automatizados",
      conteudo: "Vejam estes edifícios cobertos de plantas! São jardins verticais inteligentes que purificam o ar da cidade. Sensores monitoram umidade, luz e nutrientes do solo. Quando as plantas precisam de água, o sistema de irrigação automático funciona. Isso reduz a poluição e deixa a cidade mais verde!",
      personagem: "🌿",
      fundo: "bg-gradient-to-br from-green-200 via-emerald-400 to-teal-600",
      objetivos: [
        "Compreender agricultura urbana automatizada",
        "Aprender sobre sensores ambientais",
        "Entender sustentabilidade urbana"
      ]
    },
    {
      titulo: "☀️ Rede de Energia Solar Inteligente",
      conteudo: "Toda a cidade é alimentada por energia limpa! Painéis solares nos telhados se movem automaticamente seguindo o sol para captar mais energia. Durante o dia, o excesso de energia é armazenado em baterias gigantes. À noite, a energia guardada ilumina toda a cidade!",
      personagem: "⚡",
      fundo: "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500",
      objetivos: [
        "Conhecer energia solar automatizada",
        "Entender sistemas de rastreamento solar",
        "Aprender sobre armazenamento de energia"
      ]
    },
    {
      titulo: "🏆 Missão Cumprida: Arquitetos do Futuro!",
      conteudo: "Fantástico, futuros planejadores urbanos! Vocês descobriram como a tecnologia pode criar cidades mais verdes, eficientes e habitáveis. Agora vocês têm as ferramentas para projetar a cidade dos seus sonhos. Que inovação vocês criariam para melhorar sua própria cidade?",
      personagem: "🏗️",
      fundo: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
      objetivos: [
        "Refletir sobre planejamento urbano sustentável",
        "Inspirar soluções tecnológicas para cidades",
        "Planejar projetos de tecnologia urbana"
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
          <div className="text-8xl mb-4 animate-pulse">{cena.personagem}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{cena.titulo}</h1>
          <div className="bg-blue-100 rounded-2xl p-6 text-lg text-gray-700 leading-relaxed">
            {cena.conteudo}
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <span className="mr-3">🎯</span>
            Objetivos desta Etapa:
          </h3>
          <ul className="space-y-3">
            {cena.objetivos.map((objetivo, index) => (
              <li key={index} className="flex items-center text-lg text-gray-700">
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">
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
                : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
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
                    ? "bg-green-500 scale-125"
                    : index < cenaAtual
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {cenaAtual === cenas.length - 1 ? (
            <button
              onClick={voltarProjeto}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300"
            >
              Concluir ✓
            </button>
          ) : (
            <button
              onClick={proximaCena}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
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
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((cenaAtual + 1) / cenas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CidadeInteligente;
