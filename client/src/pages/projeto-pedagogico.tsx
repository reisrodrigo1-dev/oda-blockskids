import React, { useState } from "react";
import { useLocation } from "wouter";

const anos = [
  "1º Ano do Fundamental",
  "2º Ano do Fundamental",
  "3º Ano do Fundamental",
  "4º Ano do Fundamental",
  "5º Ano do Fundamental",
  "6º Ano do Fundamental",
  "7º Ano do Fundamental",
  "8º Ano do Fundamental",
  "9º Ano do Fundamental",
  "Turmas Mistas - Alpha (Agronomia)",
  "Turmas Mistas - Gama (Robôs Humanos)",
  "Turmas Mistas - Beta (Energias)",
  "Turmas Mistas - Exploração Espacial",
  "Turmas Mistas - Problemas Urbanos",
];


const aulasPorAno: Record<string, Array<{ titulo: string; atividade: string; habilidade: string }>> = {
  "1º Ano do Fundamental": [
    {
      titulo: "Tema #M21 – Exploração Espacial: Robô Marciano",
      atividade: "Projeto completo de 5 aulas sobre exploração espacial. Introdução aos conceitos espaciais, montagem de chassi e componentes eletrônicos, programação de movimentos, desafios em mapa temático e apresentação final.",
      habilidade: "Desenvolver pensamento crítico, criatividade e interesse por STEM através da exploração espacial. Integração de Mecânica, Programação e Eletrônica."
    },
    {
      titulo: "Aula 1 – Introdução à Exploração Espacial",
      atividade: "Conceitos de exploração espacial e sua importância. Discussão sobre outros planetas e por que explorar o universo. Apresentação de projetos e expedições espaciais reais.",
      habilidade: "Compreensão sobre o cosmos e nosso lugar no universo."
    },
    {
      titulo: "Aula 2 – Mecânica e Eletrônica do Robô",
      atividade: "Montagem do chassi e dos componentes eletrônicos do robô marciano.",
      habilidade: "Habilidades básicas de montagem e identificação de componentes."
    },
    {
      titulo: "Aula 3 – Programação dos Movimentos",
      atividade: "Problematização, idealização e construção do código responsável pelos movimentos e funcionalidades do robô.",
      habilidade: "Lógica de programação e controle de robôs."
    },
    {
      titulo: "Aula 4 – Desafios de Exploração",
      atividade: "Cumprir desafios em mapa desenvolvido pela OdA. Cada grupo busca conseguir o maior número de pontos com os desafios propostos.",
      habilidade: "Trabalho em equipe e resolução de problemas práticos."
    },
    {
      titulo: "Aula 5 – Apresentação do Projeto",
      atividade: "Preparação e apresentação final do projeto Robô Marciano.",
      habilidade: "Comunicação e síntese de aprendizados."
    },
  ],
  "2º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Botão que acende LED",
      atividade: "Inserir botão no circuito e controlar LED.",
      habilidade: "Perceber ação do usuário como gatilho."
    },
    {
      titulo: "Aula 2 – Luz noturna",
      atividade: "Simular LED acendendo quando sensor de luz detecta escuridão (blocos).",
      habilidade: "Introdução a sensores."
    },
    {
      titulo: "Aula 3 – Buzzer musical",
      atividade: "Programar buzzer para tocar notas simples.",
      habilidade: "Ligação entre código e som."
    },
  ],
  "3º Ano do Fundamental": [
    {
      titulo: "Aula 1 – LED e sensor de luz",
      atividade: "Simular LED que acende apenas no escuro.",
      habilidade: "if/else em blocos."
    },
    {
      titulo: "Aula 2 – Sinal sonoro de alerta",
      atividade: "Buzzer toca se botão for pressionado.",
      habilidade: "Leitura de entradas digitais."
    },
    {
      titulo: "Aula 3 – Semáforo",
      atividade: "Criar sequência verde-amarelo-vermelho com blocos.",
      habilidade: "Uso de temporização."
    },
  ],
  "4º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Termômetro digital",
      atividade: "Ler sensor de temperatura e mostrar valor no monitor serial.",
      habilidade: "Interpretar dados numéricos."
    },
    {
      titulo: "Aula 2 – Ventilador automático",
      atividade: "Acionar motor quando temperatura ultrapassar valor.",
      habilidade: "Controle de atuadores com base em sensores."
    },
    {
      titulo: "Aula 3 – Alarme de presença",
      atividade: "Sensor ultrassônico aciona buzzer quando algo se aproxima.",
      habilidade: "Medir distâncias e reagir."
    },
  ],
  "5º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Alarme de luz e som",
      atividade: "Sensor de luz + buzzer + LED.",
      habilidade: "Múltiplas condições no código."
    },
    {
      titulo: "Aula 2 – Estação de monitoramento de luz",
      atividade: "Coletar e registrar intensidade luminosa.",
      habilidade: "Trabalhar dados no monitor serial."
    },
    {
      titulo: "Aula 3 – Mini projeto livre",
      atividade: "Escolher dois sensores e criar função prática.",
      habilidade: "Criatividade e autonomia."
    },
  ],
  "6º Ano do Fundamental": [
    {
      titulo: "Tema #611 – Robôs por Humanos",
      atividade: "13 aulas abordando a robótica como ferramenta fundamental para automatizar tarefas perigosas, melhorar precisão médica e auxiliar pessoas com dificuldades de acessibilidade.",
      habilidade: "Ampliar visão sobre utilidade da robótica em prol das necessidades humanas."
    },
    {
      titulo: "Projeto #1 – Introdução à Lógica de Programação e Algoritmos",
      atividade: "4 aulas: Introdução ao Pensamento Computacional com atividades desplugadas e desenvolvimento de jogo simples com Scratch.",
      habilidade: "Pensamento computacional e fundamentos de programação."
    },
    {
      titulo: "Projeto #2 – Introdução ao Arduino",
      atividade: "5 aulas: Primeiros passos com Arduino no Tinkercad, acendendo LED, semáforo, programação de notas musicais e desafio do piano completo.",
      habilidade: "Fundamentos de Arduino e programação de projetos básicos."
    },
    {
      titulo: "Projeto #3 – Sensor de Ré para Deficientes Auditivos",
      atividade: "4 aulas: Contextualização, desenvolvimento de circuito e código para auxiliar deficientes auditivos, discussão sobre melhorias e apresentação.",
      habilidade: "Aplicação prática da robótica para inclusão social."
    },
    {
      titulo: "Tema #613 – Cidade Inteligente",
      atividade: "6 aulas focadas em planejamento sustentável para o futuro, integrando preservação, sustentabilidade e tecnologia.",
      habilidade: "Pensamento de planejamento urbano sustentável com tecnologia."
    },
    {
      titulo: "Projeto #1 – Seguidor de Linha com Sucata",
      atividade: "6 aulas: Contextualização sobre cidades inteligentes, desenvolvimento de robô seguidor de linha com materiais recicláveis e campeonato de precisão.",
      habilidade: "Sustentabilidade, reutilização de materiais e competição técnica."
    },
  ],
  "7º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Sensor de temperatura",
      atividade: "Mostrar temperatura no monitor serial.",
      habilidade: "Leitura de dados analógicos."
    },
    {
      titulo: "Aula 2 – Ventilador automático",
      atividade: "Motor liga quando temperatura > limite.",
      habilidade: "Condicional com números."
    },
    {
      titulo: "Aula 3 – Registro e análise",
      atividade: "Coletar dados e exportar (copiar valores para Excel).",
      habilidade: "Análise de dados."
    },
  ],
  "8º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Robô seguidor de linha (simulado)",
      atividade: "Dois sensores IR controlando dois motores.",
      habilidade: "Lógica condicional complexa."
    },
    {
      titulo: "Aula 2 – Controle por Bluetooth (simulado)",
      atividade: "Receber comando para acender LEDs.",
      habilidade: "Introdução a comunicação serial."
    },
    {
      titulo: "Aula 3 – Projeto próprio orientado",
      atividade: "Criar protótipo no Tinkercad com pelo menos dois atuadores e dois sensores.",
      habilidade: "Aplicação integrada."
    },
  ],
  "9º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Estação meteorológica virtual",
      atividade: "Integrar temperatura, umidade e luz no mesmo projeto.",
      habilidade: "Organização de múltiplos dados."
    },
    {
      titulo: "Aula 2 – Envio de dados simulados",
      atividade: "Simular envio para 'nuvem' via comunicação serial.",
      habilidade: "Preparar dados para sistemas externos."
    },
    {
      titulo: "Aula 3 – Apresentação final",
      atividade: "Apresentar projeto autoral criado no Tinkercad.",
      habilidade: "Comunicação e argumentação técnica."
    },
  ],
  "Turmas Mistas - Alpha (Agronomia)": [
    {
      titulo: "Tema #M11 – Agronomia Sustentável",
      atividade: "8 aulas focadas na sustentabilidade agrícola para preservar recursos naturais, garantir segurança alimentar e enfrentar mudanças climáticas. Pilar principal: Programação.",
      habilidade: "Desenvolvimento sustentável e responsabilidade social no agronegócio."
    },
    {
      titulo: "Projeto #1 – Revisão do Conteúdo",
      atividade: "3 aulas: Revisão de lógica e algoritmos, acendendo LED no Tinkercad, desenvolvendo semáforo inteligente em blocos.",
      habilidade: "Consolidação de fundamentos de programação e eletrônica."
    },
    {
      titulo: "Projeto #2 – Horta Automática",
      atividade: "5 aulas: Apresentação do problema de desperdício de água, reflexão sobre impacto ambiental, prototipação, experimentação e apresentação final.",
      habilidade: "Resolução de problemas ambientais através da tecnologia."
    },
  ],
  "Turmas Mistas - Gama (Robôs Humanos)": [
    {
      titulo: "Tema #M12 – Robôs por Humanos",
      atividade: "8 aulas focadas no desenvolvimento de robótica como auxílio para desafios humanos: próteses, exoesqueletos, assistentes para deficiência e robôs para tarefas repetitivas. Pilar principal: Eletrônica.",
      habilidade: "Aplicação da robótica para melhoria da qualidade de vida humana."
    },
    {
      titulo: "Projeto #1 – Revisão do Conteúdo",
      atividade: "3 aulas: Revisão de lógica e algoritmos, acendendo LED no Tinkercad, desenvolvendo semáforo inteligente em blocos.",
      habilidade: "Consolidação de fundamentos de programação e eletrônica."
    },
    {
      titulo: "Projeto #3 – Bengala Inteligente",
      atividade: "5 aulas: Apresentação empática do problema da deficiência visual, reflexão sobre dificuldades diárias, prototipação, experimentação e apresentação final.",
      habilidade: "Desenvolvimento de tecnologia assistiva e empatia social."
    },
  ],
  "Turmas Mistas - Beta (Energias)": [
    {
      titulo: "Tema #M13 – Energias Sustentáveis",
      atividade: "8 aulas para conhecer conceitos de eletricidade básica, funcionamento das energias sustentáveis, crescimento do mercado e futuro da energia limpa. Pilar principal: Mecânica.",
      habilidade: "Compreensão de sistemas energéticos sustentáveis e futuro da energia."
    },
    {
      titulo: "Projeto #1 – Revisão do Conteúdo",
      atividade: "3 aulas: Revisão de lógica e algoritmos, acendendo LED no Tinkercad, desenvolvendo semáforo inteligente em blocos.",
      habilidade: "Consolidação de fundamentos de programação e eletrônica."
    },
    {
      titulo: "Projeto #1 – Solar Tracker",
      atividade: "5 aulas: Apresentação do problema de aproveitamento solar, debate sobre soluções, desenvolvimento do rastreador solar, aplicação em maquete e apresentação.",
      habilidade: "Otimização de sistemas de energia solar e aplicação prática."
    },
  ],
  "Turmas Mistas - Exploração Espacial": [
    {
      titulo: "Tema #M14 – Projeto Final – Exploração Espacial",
      atividade: "6 aulas de projeto final integrando Mecânica, Eletrônica e Programação (MEP) para exploração de lugares remotos no universo.",
      habilidade: "Integração completa de conhecimentos técnicos em projeto espacial."
    },
    {
      titulo: "Projeto #1 – Exploração Espacial",
      atividade: "6 aulas: Apresentação do problema de exploração universal, pesquisa sobre importância da exploração espacial, idealização e desenvolvimento do projeto, apresentação final.",
      habilidade: "Pensamento científico aplicado à exploração espacial e apresentação técnica."
    },
  ],
  "Turmas Mistas - Problemas Urbanos": [
    {
      titulo: "Tema #M15 – Projeto Final – Problemas Urbanos",
      atividade: "6 aulas focadas na solução de problemas urbanos para melhorar qualidade de vida, desenvolvimento econômico, sustentabilidade e inclusão social. Pilar principal: MEP.",
      habilidade: "Desenvolvimento de soluções tecnológicas para desafios urbanos."
    },
    {
      titulo: "Projeto #1 – Sistema Automático Alimentador de Animais",
      atividade: "6 aulas: Apresentação do problema urbano de cuidado animal, idealização de soluções automáticas, desenvolvimento do projeto e apresentação para outras turmas.",
      habilidade: "Automação aplicada ao bem-estar animal e apresentação interdisciplinar."
    },
  ],
};


const ProjetoPedagogico: React.FC = () => {
  const [anoSelecionado, setAnoSelecionado] = useState(anos[0]);
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-nunito flex flex-col">
      {/* Header igual ao da Home */}
      <header className="bg-white shadow-md py-6 px-8 flex items-center justify-between border-b-2 border-kid-blue">
        <div className="flex items-center gap-4">
          <img src="/src/assets/618819.jpg" alt="Oficina do Amanhã" />
          <div>
            <h1 className="text-3xl font-extrabold text-kid-blue">Blocks Kids</h1>
            <span className="text-sm text-gray-500 font-semibold">por Oficina do Amanhã</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setLocation("/projeto-pedagogico")}
            className="bg-kid-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-block transition-all duration-200 text-lg"
          >
            Sou professor
          </button>
          <button
            onClick={() => setLocation("/editor")}
            className="bg-kid-orange hover:bg-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-playful transition-all duration-200 text-lg"
          >
            Iniciar
          </button>
        </div>
      </header>

      {/* Conteúdo da tela */}
      <div className="flex flex-col items-center py-10">
        <div className="bg-white rounded-3xl shadow-playful p-10 max-w-7xl w-full border-2 border-kid-blue mb-8">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-5xl font-extrabold text-kid-blue mb-2">Guia do Professor</h1>
            <h2 className="text-2xl font-semibold text-kid-orange mb-4">Projetos Pedagógicos Blocks Kids</h2>
            <p className="text-lg text-gray-700 max-w-2xl mb-4">Esta tela apresenta todas as atividades de Robótica Educacional com Arduino que você, professor, irá aplicar em sala de aula. Navegue pelos anos do Ensino Fundamental e confira o planejamento, objetivos, atividades e habilidades de cada aula, conforme a BNCC.</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-kid-blue rounded-xl p-6 mb-8 text-left text-base text-gray-700 flex items-start gap-4">
            <span className="text-kid-blue text-3xl mr-2">📚</span>
            <div>
              <h2 className="text-2xl font-bold text-kid-blue mb-2">Conformidade com a BNCC</h2>
              <p className="mb-2">A Oficina do Amanhã desenvolve suas aulas de Robótica Educacional com Arduino totalmente alinhadas à Base Nacional Comum Curricular (BNCC), contemplando competências e habilidades previstas para o Ensino Fundamental – Anos Iniciais e Finais.</p>
              <p className="mb-2">Nosso planejamento integra conceitos de Ciências da Natureza, Matemática, Tecnologia e Linguagens, incentivando a aprendizagem interdisciplinar e a resolução de problemas por meio de metodologias ativas e projetos práticos.</p>
              <p className="mb-2">Cada atividade proposta no Tinkercad foi elaborada para promover:</p>
              <ul className="list-disc pl-6 mb-2">
                <li><strong>Competência Geral 2:</strong> Exercitar o pensamento científico, crítico e criativo.</li>
                <li><strong>Competência Geral 4:</strong> Utilizar diferentes linguagens – incluindo a programação – para expressar e compartilhar ideias.</li>
                <li><strong>Competência Geral 5:</strong> Compreender e utilizar tecnologias digitais de forma crítica, significativa e responsável.</li>
                <li><strong>Competência Geral 6:</strong> Valorizar a comunicação, a cooperação e o trabalho em equipe.</li>
              </ul>
              <p className="mb-2">Dessa forma, os conteúdos e práticas apresentados garantem não apenas o desenvolvimento de habilidades técnicas em robótica e programação, mas também competências socioemocionais, cognitivas e de cidadania, como preconiza a BNCC, preparando o estudante para os desafios do século XXI.</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 mt-2 mb-6">
            <label htmlFor="ano" className="font-bold text-kid-blue mb-2 text-lg">Selecione o ano:</label>
            <select
              id="ano"
              value={anoSelecionado}
              onChange={e => setAnoSelecionado(e.target.value)}
              className="px-6 py-3 rounded-xl border-2 border-kid-blue text-lg font-semibold text-kid-blue bg-blue-50 focus:outline-none focus:ring-2 focus:ring-kid-blue shadow-sm"
            >
              {anos.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>
          <div className="bg-kid-blue/10 rounded-xl p-4 mb-4 flex items-center justify-center">
            <span className="text-kid-blue text-xl font-bold">Ano selecionado:</span>
            <span className="ml-2 text-lg text-kid-orange font-bold">{anoSelecionado}</span>
          </div>
        </div>
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {aulasPorAno[anoSelecionado].map((aula, idx) => {
            const isInteractive = aula.titulo.includes('Robô Marciano') || 
                                 aula.titulo.includes('Tema #611') || 
                                 aula.titulo.includes('Tema #613') ||
                                 aula.titulo.includes('Tema #M11') ||
                                 aula.titulo.includes('Tema #M12') ||
                                 aula.titulo.includes('Tema #M13');
            
            const getRoute = (titulo: string) => {
              if (titulo.includes('Robô Marciano')) return '/robo-marciano';
              if (titulo.includes('Tema #611')) return '/robos-por-humanos';
              if (titulo.includes('Tema #613')) return '/cidade-inteligente';
              if (titulo.includes('Tema #M11')) return '/agronomia-sustentavel';
              if (titulo.includes('Tema #M12')) return '/robos-por-humanos';
              if (titulo.includes('Tema #M13')) return '/energias-sustentaveis';
              return '';
            };

            const getIcon = (titulo: string) => {
              if (titulo.includes('Robô Marciano')) return '🚀';
              if (titulo.includes('Tema #611')) return '🤖';
              if (titulo.includes('Tema #613')) return '🏙️';
              if (titulo.includes('Tema #M11')) return '🌱';
              if (titulo.includes('Tema #M12')) return '🦾';
              if (titulo.includes('Tema #M13')) return '⚡';
              return '📘';
            };

            return (
              <div 
                key={aula.titulo} 
                className={`bg-white rounded-2xl shadow-playful p-7 border-l-8 border-kid-blue flex flex-col items-start relative ${
                  isInteractive ? 'cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300' : ''
                }`}
                onClick={() => {
                  if (isInteractive) {
                    setLocation(getRoute(aula.titulo));
                  }
                }}
              >
                <div className="absolute -top-5 -left-5 bg-kid-orange text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg">{idx + 1}</div>
                <h2 className={`text-xl font-bold text-kid-blue mb-2 mt-2 flex items-center gap-2 ${
                  isInteractive ? 'text-red-600' : ''
                }`}>
                  <span className={`text-2xl ${isInteractive ? 'animate-pulse' : 'text-kid-orange'}`}>
                    {getIcon(aula.titulo)}
                  </span> 
                  {aula.titulo}
                  {isInteractive && (
                    <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full animate-bounce">INTERATIVO</span>
                  )}
                </h2>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Atividade:</span>
                  <span className="ml-2 text-gray-600">{aula.atividade}</span>
                </div>
                <div>
                  <span className="font-semibold text-kid-blue">Habilidade:</span>
                  <span className="ml-2 text-kid-orange font-semibold">{aula.habilidade}</span>
                </div>
                {isInteractive && (
                  <div className="mt-4 w-full">
                    <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center">
                      <span className="mr-2">{getIcon(aula.titulo)}</span>
                      Explorar Experiência Interativa
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer igual ao da Home */}
      <footer className="bg-white border-t-2 border-kid-blue py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Oficina do Amanhã. Todos os direitos reservados. | Desenvolvido por Oficina do Amanhã
      </footer>
    </div>
  );
};

export default ProjetoPedagogico;
