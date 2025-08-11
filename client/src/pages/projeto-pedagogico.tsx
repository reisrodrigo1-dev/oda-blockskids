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
];


const aulasPorAno: Record<string, Array<{ titulo: string; atividade: string; habilidade: string }>> = {
  "1º Ano do Fundamental": [
    {
      titulo: "Aula 1 – Acenda a lâmpada no Tinkercad",
      atividade: "Explorar protótipo com bateria e lâmpada (ligar/desligar).",
      habilidade: "Entender circuito simples (fonte + carga)."
    },
    {
      titulo: "Aula 2 – Brincando com cores de LEDs",
      atividade: "Trocar LEDs no circuito e observar efeito visual.",
      habilidade: "Identificar componentes e suas funções."
    },
    {
      titulo: "Aula 3 – Sequência de LEDs com blocos",
      atividade: "Usar programação em blocos para acender LEDs em ordem.",
      habilidade: "Noção de sequência lógica."
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
      titulo: "Aula 1 – Servo motor básico",
      atividade: "Movimentar servo para ângulos definidos.",
      habilidade: "Controle de posição."
    },
    {
      titulo: "Aula 2 – Cancela automática",
      atividade: "Servo abre/fecha com sensor ultrassônico.",
      habilidade: "Integrar entrada e movimento."
    },
    {
      titulo: "Aula 3 – Carro com lógica simples",
      atividade: "Simular dois motores ligando/desligando por botão.",
      habilidade: "Simulação de robôs móveis."
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
          {aulasPorAno[anoSelecionado].map((aula, idx) => (
            <div key={aula.titulo} className="bg-white rounded-2xl shadow-playful p-7 border-l-8 border-kid-blue flex flex-col items-start relative">
              <div className="absolute -top-5 -left-5 bg-kid-orange text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg">{idx + 1}</div>
              <h2 className="text-xl font-bold text-kid-blue mb-2 mt-2 flex items-center gap-2">
                <span className="text-kid-orange">📘</span> {aula.titulo}
              </h2>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Atividade:</span>
                <span className="ml-2 text-gray-600">{aula.atividade}</span>
              </div>
              <div>
                <span className="font-semibold text-kid-blue">Habilidade:</span>
                <span className="ml-2 text-kid-orange font-semibold">{aula.habilidade}</span>
              </div>
            </div>
          ))}
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
