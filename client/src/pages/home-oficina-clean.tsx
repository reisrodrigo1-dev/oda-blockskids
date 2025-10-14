import { Link } from "wouter";
import { Button } from "../components/ui/button";
import logoOdA from "../assets/logo-OdA.png";
import logoTopoRemovebg from "../assets/logo-topo-removebg-preview.png";
import imagemAula1 from "../assets/imagem_aula_1.jpg";
import imagemAula2 from "../assets/imagem_aula_2.jpg";
import imagemAula3 from "../assets/imagem_aula_3.jpg";
import imagemAula4 from "../assets/imagem_aula_4.jpg";
import { useState, useEffect, useRef } from "react";

// Hook para animação de contagem
function useCountUp(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      setCount(currentCount);
      if (progress >= 1) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration, start]);
  return { count, ref };
}

function AnimatedNumber({ end, suffix = "", prefix = "", duration = 2000 }: { end: number, suffix?: string, prefix?: string, duration?: number }) {
  const { count, ref } = useCountUp(end, duration);
  return (
    <div ref={ref} className="text-4xl font-bold mb-2 text-gray-900">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function HomeOficina() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header - Arduino Style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoTopoRemovebg} alt="Oficina do Amanhã" className="w-16 h-16 object-contain" />
            <span className="text-2xl font-bold text-gray-900">Oficina do Amanhã</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-gray-700 hover:text-[#00979D] font-medium transition-colors">Sobre</a>
            <a href="#metodologia" className="text-gray-700 hover:text-[#00979D] font-medium transition-colors">Metodologia</a>
            <a href="#oficinas" className="text-gray-700 hover:text-[#00979D] font-medium transition-colors">Oficinas</a>
            <a href="#contato" className="text-gray-700 hover:text-[#00979D] font-medium transition-colors">Contato</a>
            <Link href="/home">
              <button className="bg-[#00979D] hover:bg-[#007A7E] text-white px-6 py-2 rounded font-medium transition-colors">
                Acessar Blocks Kids
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Large, Clean, Arduino Style */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Centro de Desenvolvimento de Habilidades
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Empoderamos e transformamos crianças e jovens através de educação inovadora e disruptiva, 
                promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.
              </p>
              <div className="flex gap-4">
                <Link href="/home">
                  <button className="bg-[#00979D] hover:bg-[#007A7E] text-white px-8 py-3 rounded font-semibold transition-colors">
                    Acessar Blocks Kids
                  </button>
                </Link>
                <a href="#contato">
                  <button className="border-2 border-gray-300 hover:border-[#00979D] text-gray-700 hover:text-[#00979D] px-8 py-3 rounded font-semibold transition-colors">
                    Fale Conosco
                  </button>
                </a>
              </div>
            </div>
            <div>
              <img src={logoTopoRemovebg} alt="Oficina do Amanhã Logo" className="w-full max-w-md mx-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links - Projetos Pedagógicos */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Área de Projetos Pedagógicos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/criador-projeto-melhorado">
              <div className="border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center cursor-pointer transition-all hover:shadow-lg">
                <h3 className="font-bold text-xl mb-2 text-gray-900">Criar Novo Projeto</h3>
                <p className="text-gray-600">Desenvolva projetos personalizados</p>
              </div>
            </Link>
            <Link href="/projetos-avancados">
              <div className="border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center cursor-pointer transition-all hover:shadow-lg">
                <h3 className="font-bold text-xl mb-2 text-gray-900">Ver Projetos Criados</h3>
                <p className="text-gray-600">Explore projetos da comunidade</p>
              </div>
            </Link>
            <Link href="/projetos-pedagogicos">
              <div className="border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center cursor-pointer transition-all hover:shadow-lg">
                <h3 className="font-bold text-xl mb-2 text-gray-900">Projetos Básicos</h3>
                <p className="text-gray-600">Templates prontos para usar</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre - Clean Cards */}
      <section id="sobre" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Centro de Desenvolvimento de Habilidades</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Localizado em Uberlândia-MG, oferecemos Oficinas de Robótica Sustentável, Programação e 
              Oficinas Profissionalizantes para crianças e jovens.
            </p>
          </div>

          {/* Galeria */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <img src={imagemAula1} alt="Alunos em aula" className="w-full h-48 object-cover rounded-lg" />
            <img src={imagemAula2} alt="Alunos em aula" className="w-full h-48 object-cover rounded-lg" />
            <img src={imagemAula3} alt="Alunos em aula" className="w-full h-48 object-cover rounded-lg" />
            <img src={imagemAula4} alt="Alunos em aula" className="w-full h-48 object-cover rounded-lg" />
          </div>

          {/* Missão, Visão, Valores */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Empoderar e transformar crianças e jovens através de educação inovadora e disruptiva, promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Promover experiências enriquecedoras e transformadoras, capacitando nossos alunos como agentes de mudanças positivas e sustentáveis.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossos Valores</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicação, impacto, colaboração, criatividade, empatia, inclusão, integridade e sustentabilidade.
              </p>
            </div>
          </div>

          {/* Números */}
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">OdA em Números</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <AnimatedNumber end={12000} prefix="+" duration={1800} />
                <div className="text-gray-600 font-medium">Crianças e jovens impactados</div>
              </div>
              <div>
                <AnimatedNumber end={50} prefix="+" duration={1500} />
                <div className="text-gray-600 font-medium">Toneladas de material reciclado</div>
              </div>
              <div>
                <AnimatedNumber end={50000} prefix="+" duration={2000} />
                <div className="text-gray-600 font-medium">Horas de instrução</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section id="metodologia" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-[1fr,1.2fr] gap-12 items-start">
            {/* Coluna Esquerda - Título e Texto Descritivo */}
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8">NOSSA<br/>METODOLOGIA</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  A <strong>Metodologia OdA – Observar, Desenvolver e Avançar</strong> é uma abordagem 
                  inovadora que coloca a criança no centro do processo de aprendizagem. Mais do que ensinar 
                  a montar e programar robôs, promovemos <strong>vivências práticas</strong> que estimulam 
                  a curiosidade, o apelo e fazer bem propósito, e o conhecimento ganha sentido.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Nossos projetos são estruturados com base nos <strong>três pilares da robótica: mecânica, 
                  programação e eletrônica</strong>, articulados de forma integrada para que cada construção 
                  seja também uma oportunidade de desenvolvimento do pensamento crítico, criatividade e 
                  compreensão profunda dos temas abordados.
                </p>
              </div>
            </div>

            {/* Coluna Direita - Cards OdA */}
            <div className="space-y-4">
              {/* Card Observar */}
              <div className="bg-[#F4C542] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Observar</h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  É o momento de despertar a curiosidade. Os alunos observam o mundo ao redor, identificam <strong>problemas reais</strong> e 
                  fazem conexões com o mundo ao redor. Observar é o ponto de partida para uma <strong>aprendizagem com sentido</strong>.
                </p>
              </div>

              {/* Card Desenvolver */}
              <div className="bg-[#00B4A8] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Desenvolver</h3>
                <p className="text-white text-sm leading-relaxed">
                  Os estudantes conhecem os <strong>componentes eletrônicos, mecânicos e os fundamentos de programação</strong> envolvidos no 
                  projeto. Planejam, testam ideias e constroem soluções com <strong>criatividade e funcionalidade</strong>.
                </p>
              </div>

              {/* Card Avançar */}
              <div className="bg-[#00979D] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">Avançar</h3>
                <p className="text-white text-sm leading-relaxed">
                  Hora de colocar a mão na massa! Os alunos <strong>aprimoram seus projetos</strong>, desenvolvendo <strong>autonomia, 
                  pensamento crítico</strong> e protagonismo com base em <strong>desafios reais</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Competências */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Competências Técnicas</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span>Programação e Pensamento Computacional</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Robótica e Automação</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Design Digital e Criatividade</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Marketing Digital e Comunicação</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Desenvolvimento Web</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Competências Socioemocionais</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span>Pensamento Crítico e Criativo</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Colaboração e Trabalho em Equipe</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Liderança e Protagonismo</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Consciência Ambiental</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span>Empreendedorismo e Inovação</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BNCC */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Alinhamento com a BNCC</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossos projetos estão totalmente alinhados com a Base Nacional Comum Curricular, 
              desenvolvendo as competências gerais necessárias para a formação integral dos estudantes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Competências Cognitivas</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Pensamento científico, crítico e criativo</li>
                <li>• Repertório cultural e conhecimento</li>
                <li>• Comunicação e argumentação</li>
                <li>• Cultura digital e tecnológica</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Competências Sociais</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Empatia e cooperação</li>
                <li>• Diversidade e direitos humanos</li>
                <li>• Trabalho e projeto de vida</li>
                <li>• Argumentação e diálogo</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Competências Pessoais</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Autoconhecimento e autocuidado</li>
                <li>• Responsabilidade e cidadania</li>
                <li>• Autonomia e tomada de decisões</li>
                <li>• Resiliência e projeto de vida</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-[#00979D] text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Certificação e Reconhecimento</h3>
            <p className="max-w-3xl mx-auto">
              Todos os nossos alunos recebem certificados de participação e conclusão, 
              validando as competências desenvolvidas e o cumprimento da carga horária estabelecida.
            </p>
          </div>
        </div>
      </section>

      {/* Soluções */}
      <section id="oficinas" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-12">NOSSAS<br/>SOLUÇÕES</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Coluna Esquerda - Lista de Soluções */}
              <div className="space-y-8">
                {/* Currículo Completo */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Currículo Completo de Programação e Robótica</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Entregamos a matriz curricular pronta e totalmente alinhada à BNCC e às novas diretrizes da LDB/PNED, 
                    garantindo a tranquilidade pedagógica da sua escola.
                  </p>
                </div>

                {/* Plataforma OdA */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Plataforma OdA de Ensino</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Oferecemos um ambiente tecnológico próprio e completo, onde os alunos aprendem a programar 
                    de forma prática e intuitiva, transformando conceitos em realidade.
                  </p>
                </div>

                {/* Kits Pedagógicos */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kits pedagógicos</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Kits de robótica com componentes eletrônicos e projetos alinhados à BNCC.
                  </p>
                </div>

                {/* Formação 360º */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Formação 360º para Professores</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Garantimos a capacitação completa do seu corpo docente com formação contínua e apoio pedagógico 
                    dedicado durante todo o projeto, preparando sua equipe para ministrar aulas de alto impacto 
                    com total segurança.
                  </p>
                </div>

                {/* Instrumentos de Avaliação */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Instrumentos de avaliação</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Ferramentas para mapear o desenvolvimento de competências técnicas (como lógica, algoritmos e 
                    prototipagem) e socioemocionais (como colaboração, criatividade e empatia).
                  </p>
                </div>
              </div>

              {/* Coluna Direita - Imagem */}
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=700&fit=crop" 
                  alt="Professora com tablet ensinando programação"
                  className="rounded-lg shadow-lg w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
            <p className="text-xl text-gray-600">Centro de Desenvolvimento de Habilidades em Uberlândia-MG</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <a href="mailto:contato@oficinadoamanha.com.br" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="font-bold text-gray-900 mb-2">E-mail</div>
              <div className="text-sm text-gray-600">contato@oficinadoamanha.com.br</div>
            </a>
            
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="font-bold text-gray-900 mb-2">WhatsApp</div>
              <div className="text-sm text-gray-600">(34) 99733-7087</div>
            </a>
            
            <a href="https://www.instagram.com/oficinadoamanha.udi/" target="_blank" rel="noopener" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="font-bold text-gray-900 mb-2">Instagram</div>
              <div className="text-sm text-gray-600">@oficinadoamanha.udi</div>
            </a>
            
            <a href="https://www.linkedin.com/company/oficina-do-amanh%C3%A3" target="_blank" rel="noopener" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="font-bold text-gray-900 mb-2">LinkedIn</div>
              <div className="text-sm text-gray-600">Oficina do Amanhã</div>
            </a>
          </div>
          
          <div className="text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm mx-auto mb-8">
              <div className="font-bold text-gray-900 mb-2">Localização</div>
              <div className="text-gray-600">Uberlândia - MG</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contato@oficinadoamanha.com.br" className="bg-[#00979D] hover:bg-[#007A7E] text-white font-semibold px-8 py-3 rounded transition-colors">
                Solicitar Informações
              </a>
              <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded transition-colors">
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img src={logoOdA} alt="Oficina do Amanhã" className="w-16 h-16 object-contain opacity-80" />
          </div>
          <p className="text-gray-600 mb-2">© {new Date().getFullYear()} Oficina do Amanhã. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm">Desenvolvido com ❤️ pela equipe da Oficina do Amanhã</p>
        </div>
      </footer>
    </div>
  );
}
