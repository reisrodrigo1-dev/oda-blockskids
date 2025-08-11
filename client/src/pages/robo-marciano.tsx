import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function RoboMarciano() {
  const [, setLocation] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);
  const [showStars, setShowStars] = useState(true);

  useEffect(() => {
    // Animação das estrelas
    const interval = setInterval(() => {
      setShowStars(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scenes = [
    {
      id: 0,
      title: "🚀 Missão: Exploração de Marte",
      content: "Ano 2045... A humanidade finalmente está pronta para enviar robôs exploradores para Marte! Você foi escolhido para ser o engenheiro responsável por programar o primeiro robô marciano da história.",
      background: "from-red-900 via-red-700 to-orange-600",
      character: "🧑‍🚀",
      action: "Aceitar a Missão"
    },
    {
      id: 1,
      title: "🛸 Centro de Controle Espacial",
      content: "Bem-vindo ao Centro de Controle da Missão Marte! Aqui você aprenderá tudo sobre exploração espacial. Por que é importante explorar outros planetas? Que mistérios Marte guarda? Vamos descobrir juntos!",
      background: "from-blue-900 via-purple-800 to-indigo-900",
      character: "👩‍🔬",
      action: "Iniciar Treinamento"
    },
    {
      id: 2,
      title: "🔧 Laboratório de Montagem",
      content: "Agora é hora de construir seu robô! No laboratório espacial, você montará o chassi e instalará todos os componentes eletrônicos. Cada peça é essencial para que nosso explorador funcione em Marte!",
      background: "from-gray-800 via-gray-600 to-blue-700",
      character: "🤖",
      action: "Montar Robô"
    },
    {
      id: 3,
      title: "💻 Sala de Programação",
      content: "Seu robô está montado, mas precisa de um 'cérebro'! Aqui você programará todos os movimentos e funcionalidades. Como ele vai se mover? Como vai reagir aos obstáculos marcianos?",
      background: "from-green-800 via-teal-700 to-cyan-600",
      character: "👨‍💻",
      action: "Programar Movimentos"
    },
    {
      id: 4,
      title: "🏜️ Simulador de Marte",
      content: "Teste final! Seu robô será testado em um simulador que recria a superfície marciana. Desafios, obstáculos e mistérios aguardam. Quantos pontos sua equipe conseguirá?",
      background: "from-red-800 via-orange-700 to-yellow-600",
      character: "🛰️",
      action: "Iniciar Simulação"
    },
    {
      id: 5,
      title: "🏆 Missão Concluída",
      content: "Parabéns, Explorador Espacial! Você concluiu com sucesso o treinamento. Agora é hora de apresentar sua criação para o mundo e mostrar como será a próxima era da exploração espacial!",
      background: "from-purple-900 via-pink-800 to-indigo-900",
      character: "🌟",
      action: "Ver Certificado"
    }
  ];

  const currentSceneData = scenes[currentScene];

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentSceneData.background} relative overflow-hidden`}>
      {/* Estrelas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full transition-opacity duration-1000 ${
              showStars ? 'opacity-100' : 'opacity-30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header com navegação */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setLocation("/projeto-pedagogico")}
            className="text-white hover:text-yellow-300 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Projeto Pedagógico
          </button>
          <div className="text-white text-sm">
            Aula {currentScene + 1} de {scenes.length}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full text-center border border-white border-opacity-20 shadow-2xl">
          {/* Personagem/Ícone */}
          <div className="text-8xl mb-6 animate-bounce">
            {currentSceneData.character}
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            {currentSceneData.title}
          </h1>

          {/* Conteúdo da história */}
          <p className="text-xl text-white text-opacity-90 leading-relaxed mb-8 max-w-3xl mx-auto">
            {currentSceneData.content}
          </p>

          {/* Botões de navegação */}
          <div className="flex justify-center space-x-4">
            {currentScene > 0 && (
              <button
                onClick={prevScene}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
            )}

            <button
              onClick={nextScene}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {currentSceneData.action}
              {currentScene < scenes.length - 1 && (
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Indicador de progresso */}
          <div className="mt-8">
            <div className="flex justify-center space-x-2">
              {scenes.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentScene 
                      ? 'bg-yellow-400 scale-125' 
                      : index < currentScene 
                        ? 'bg-green-400' 
                        : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Detalhes da aula atual */}
        {currentScene > 0 && currentScene < scenes.length - 1 && (
          <div className="mt-8 bg-black bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              Objetivos desta Etapa:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">🎯</span>
                <span>Aprendizado prático</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-2">🧠</span>
                <span>Pensamento crítico</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-2">🤝</span>
                <span>Trabalho em equipe</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-2">⚡</span>
                <span>Integração STEM</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-20 backdrop-blur-sm p-4 text-center text-white text-sm">
        <p>🚀 Projeto Robô Marciano - Explorando o futuro da humanidade no espaço 🌌</p>
      </div>
    </div>
  );
}
