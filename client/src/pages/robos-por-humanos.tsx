import React, { useState } from "react";
import { useLocation } from "wouter";

const RobosPorHumanos: React.FC = () => {
  const [, setLocation] = useLocation();
  const [cenaAtual, setCenaAtual] = useState(0);

  const cenas = [
    {
      titulo: "🤖 Bem-vindos ao Laboratório do Futuro!",
      conteudo: "Olá, jovens inventores! Vocês acabaram de entrar no laboratório mais avançado do mundo, onde criamos robôs para ajudar as pessoas. Sou a Dra. Ana, robótica especialista, e hoje vocês serão meus assistentes especiais!",
      personagem: "👩‍🔬",
      fundo: "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
      objetivos: [
        "Descobrir como robôs podem ajudar pessoas",
        "Conhecer diferentes tipos de robótica assistiva", 
        "Entender a importância da tecnologia para inclusão"
      ]
    },
    {
      titulo: "🦾 Descobrindo a Robótica Assistiva",
      conteudo: "Primeiro, vamos conhecer Maya! Ela perdeu o braço em um acidente, mas agora usa uma prótese robótica incrível. Vejam como ela consegue pegar objetos, escrever e até tocar piano! A tecnologia devolveu sua independência.",
      personagem: "👩‍🦽",
      fundo: "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
      objetivos: [
        "Compreender o conceito de próteses robóticas",
        "Aprender sobre sensores de movimento",
        "Descobrir como a eletricidade controla músculos artificiais"
      ]
    },
    {
      titulo: "🏥 Hospital do Amanhã",
      conteudo: "Agora estamos no hospital mais moderno do mundo! Aqui, robôs cirurgiões ajudam médicos em operações delicadas. O robô Da Vinci permite que os cirurgiões façam movimentos precisos através de pequenos cortes. Também temos robôs que levam medicamentos e fazem companhia para pacientes solitários.",
      personagem: "🏥",
      fundo: "bg-gradient-to-br from-white via-blue-100 to-green-200",
      objetivos: [
        "Entender robôs na medicina",
        "Conhecer a precisão robótica em cirurgias",
        "Descobrir robôs de companhia e assistência hospitalar"
      ]
    },
    {
      titulo: "🦮 Robôs Guia e Assistentes",
      conteudo: "Conheçam Rex, o cão-robô guia! Ele ajuda pessoas cegas a navegarem pela cidade com segurança. Seus sensores detectam obstáculos, semáforos e até reconhecem rostos familiares. E este é Charlie, um robô que ajuda crianças autistas a se comunicarem melhor!",
      personagem: "🦮",
      fundo: "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500",
      objetivos: [
        "Conhecer robôs de mobilidade para deficientes visuais",
        "Entender sensores ultrassônicos e de navegação",
        "Descobrir robôs terapêuticos para autismo"
      ]
    },
    {
      titulo: "🏭 Fábrica Robótica",
      conteudo: "Bem-vindos à nossa fábrica automatizada! Aqui, robôs trabalham 24 horas fazendo tarefas perigosas que seriam arriscadas para humanos. Eles soldam peças em altas temperaturas, movem cargas pesadas e trabalham com produtos químicos. Isso mantém os trabalhadores seguros!",
      personagem: "🏭",
      fundo: "bg-gradient-to-br from-gray-600 via-blue-700 to-purple-800",
      objetivos: [
        "Compreender automação industrial",
        "Aprender sobre segurança no trabalho",
        "Entender robôs em ambientes perigosos"
      ]
    },
    {
      titulo: "🎯 Missão Cumprida: Robôs a Serviço da Humanidade!",
      conteudo: "Parabéns, futuros engenheiros! Vocês descobriram como a robótica transforma vidas todos os dias. Desde próteses que devolvem movimentos até robôs que salvam vidas em hospitais. Agora é sua vez: que robô vocês criariam para ajudar alguém?",
      personagem: "🏆",
      fundo: "bg-gradient-to-br from-gold-300 via-yellow-400 to-orange-500",
      objetivos: [
        "Refletir sobre o impacto social da robótica",
        "Inspirar-se para criar soluções tecnológicas",
        "Planejar próximos projetos de robótica assistiva"
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
          <div className="text-8xl mb-4 animate-bounce">{cena.personagem}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{cena.titulo}</h1>
          <div className="bg-blue-100 rounded-2xl p-6 text-lg text-gray-700 leading-relaxed">
            {cena.conteudo}
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <span className="mr-3">🎯</span>
            Objetivos desta Etapa:
          </h3>
          <ul className="space-y-3">
            {cena.objetivos.map((objetivo, index) => (
              <li key={index} className="flex items-center text-lg text-gray-700">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">
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
                : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
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
                    ? "bg-blue-500 scale-125"
                    : index < cenaAtual
                    ? "bg-green-500"
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
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300"
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((cenaAtual + 1) / cenas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobosPorHumanos;
