import React, { useState } from "react";
import { useLocation } from "wouter";

const AgronomiaSupply: React.FC = () => {
  const [, setLocation] = useLocation();
  const [cenaAtual, setCenaAtual] = useState(0);

  const cenas = [
    {
      titulo: "🌱 Bem-vindos à Fazenda do Futuro!",
      conteudo: "Olá, jovens agricultores! Sou a Dra. Maria, engenheira agrônoma especialista em agricultura sustentável. Hoje vocês descobrirão como a tecnologia está revolucionando a agricultura para alimentar o mundo sem destruir o planeta. Vamos explorar uma fazenda onde cada gota d'água e cada nutriente são usados com precisão!",
      personagem: "👩‍🌾",
      fundo: "bg-gradient-to-br from-green-300 via-lime-400 to-emerald-500",
      objetivos: [
        "Compreender agricultura sustentável e precisão",
        "Conhecer tecnologias de conservação de recursos",
        "Entender o papel da agricultura no futuro do planeta"
      ]
    },
    {
      titulo: "💧 Sistema de Irrigação Inteligente",
      conteudo: "Vejam este campo incrível! Sensores enterrados no solo medem constantemente a umidade da terra. Quando as plantas precisam de água, o sistema de irrigação automaticamente rega apenas onde é necessário. Isso economiza 70% da água comparado aos métodos tradicionais! Cada planta recebe exatamente o que precisa.",
      personagem: "💧",
      fundo: "bg-gradient-to-br from-blue-200 via-cyan-300 to-teal-400",
      objetivos: [
        "Aprender sobre sensores de umidade do solo",
        "Compreender sistemas de irrigação automatizada",
        "Entender conservação de recursos hídricos"
      ]
    },
    {
      titulo: "🌡️ Estação Meteorológica da Fazenda",
      conteudo: "Esta é nossa central de monitoramento climático! Sensores medem temperatura, umidade do ar, velocidade do vento e radiação solar. Todos os dados são enviados para um computador que prevê o melhor momento para plantar, regar e colher. Os agricultores recebem alertas no celular sobre mudanças no tempo!",
      personagem: "🌡️",
      fundo: "bg-gradient-to-br from-sky-200 via-blue-300 to-indigo-400",
      objetivos: [
        "Conhecer sensores meteorológicos",
        "Entender coleta e análise de dados climáticos",
        "Aprender sobre previsão agrícola automatizada"
      ]
    },
    {
      titulo: "🚜 Tratores Robóticos e Drones",
      conteudo: "Olhem só! Este trator se dirige sozinho usando GPS e sensores. Ele planta sementes em linha reta com precisão milimétrica. Os drones voam sobre a plantação tirando fotos especiais que mostram quais plantas estão saudáveis e quais precisam de cuidados. Tudo automatizado para ser mais eficiente!",
      personagem: "🚁",
      fundo: "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500",
      objetivos: [
        "Compreender automação agrícola",
        "Conhecer tecnologia GPS em agricultura",
        "Entender monitoramento por drones e imagens"
      ]
    },
    {
      titulo: "🔬 Laboratório de Nutrição das Plantas",
      conteudo: "Neste laboratório high-tech, sensores analisam o solo em tempo real para descobrir quais nutrientes estão faltando. Baseado nisso, o sistema calcula a quantidade exata de adubo que cada área precisa. Robots aplicam fertilizantes apenas onde necessário, evitando desperdício e poluição dos rios!",
      personagem: "🧪",
      fundo: "bg-gradient-to-br from-purple-300 via-violet-400 to-indigo-500",
      objetivos: [
        "Aprender sobre análise automatizada do solo",
        "Compreender aplicação precisa de nutrientes",
        "Entender prevenção de poluição ambiental"
      ]
    },
    {
      titulo: "🌍 Missão Cumprida: Guardiões do Planeta!",
      conteudo: "Excelente trabalho, futuros engenheiros agrônomos! Vocês descobriram como a tecnologia pode alimentar o mundo preservando a natureza. Com agricultura de precisão, economizamos água, reduzimos poluição e produzimos mais alimentos saudáveis. Agora vocês sabem como usar a tecnologia para proteger nosso planeta. Que solução sustentável vocês criariam para a agricultura?",
      personagem: "🏆",
      fundo: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600",
      objetivos: [
        "Refletir sobre sustentabilidade na agricultura",
        "Inspirar soluções tecnológicas para produção de alimentos",
        "Planejar projetos de agricultura de precisão"
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
          <div className="bg-green-100 rounded-2xl p-6 text-lg text-gray-700 leading-relaxed">
            {cena.conteudo}
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <span className="mr-3">🎯</span>
            Objetivos desta Etapa:
          </h3>
          <ul className="space-y-3">
            {cena.objetivos.map((objetivo, index) => (
              <li key={index} className="flex items-center text-lg text-gray-700">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4 font-bold">
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
                : "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
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
                    ? "bg-green-600 scale-125"
                    : index < cenaAtual
                    ? "bg-lime-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {cenaAtual === cenas.length - 1 ? (
            <button
              onClick={voltarProjeto}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 hover:scale-105 transition-all duration-300"
            >
              Concluir ✓
            </button>
          ) : (
            <button
              onClick={proximaCena}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 hover:scale-105 transition-all duration-300"
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
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((cenaAtual + 1) / cenas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgronomiaSupply;
