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
                <div className="text-5xl mb-4">✨</div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Criar Novo Projeto</h3>
                <p className="text-gray-600">Desenvolva projetos personalizados</p>
              </div>
            </Link>
            <Link href="/projetos-avancados">
              <div className="border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center cursor-pointer transition-all hover:shadow-lg">
                <div className="text-5xl mb-4">👁️</div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Ver Projetos Criados</h3>
                <p className="text-gray-600">Explore projetos da comunidade</p>
              </div>
            </Link>
            <Link href="/projetos-pedagogicos">
              <div className="border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center cursor-pointer transition-all hover:shadow-lg">
                <div className="text-5xl mb-4">📋</div>
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
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-white text-2xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Empoderar e transformar crianças e jovens através de educação inovadora e disruptiva, promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-white text-2xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Promover experiências enriquecedoras e transformadoras, capacitando nossos alunos como agentes de mudanças positivas e sustentáveis.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-white text-2xl mb-4">💎</div>
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa Metodologia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aplicamos metodologias ativas e inovadoras, integrando STEAM, sustentabilidade e empreendedorismo 
              para formar cidadãos preparados para os desafios do século XXI
            </p>
          </div>

          {/* Pilares */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">🎯</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Aprendizagem Ativa</h3>
              <p className="text-gray-600 text-sm">
                Metodologias hands-on onde os alunos são protagonistas do seu aprendizado através de projetos práticos e desafios reais.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">🔬</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">STEAM Integrado</h3>
              <p className="text-gray-600 text-sm">
                Ciência, Tecnologia, Engenharia, Arte e Matemática trabalhadas de forma interdisciplinar e contextualizada.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">♻️</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Sustentabilidade</h3>
              <p className="text-gray-600 text-sm">
                Uso de materiais reutilizáveis e consciência ambiental integrada em todos os projetos e atividades.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">🚀</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Empreendedorismo</h3>
              <p className="text-gray-600 text-sm">
                Desenvolvimento do pensamento empreendedor, criatividade e capacidade de inovação desde cedo.
              </p>
            </div>
          </div>

          {/* Processo */}
          <div className="bg-gray-50 rounded-lg p-12 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nosso Processo de Aprendizagem</h3>
            <div className="grid md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00979D] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">1</div>
                <h4 className="font-bold text-gray-900 mb-2">Descobrir</h4>
                <p className="text-sm text-gray-600">Identificação de problemas e oportunidades reais</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00979D] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">2</div>
                <h4 className="font-bold text-gray-900 mb-2">Idealizar</h4>
                <p className="text-sm text-gray-600">Brainstorming e desenvolvimento de soluções criativas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00979D] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">3</div>
                <h4 className="font-bold text-gray-900 mb-2">Prototipar</h4>
                <p className="text-sm text-gray-600">Construção de protótipos funcionais com materiais sustentáveis</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00979D] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">4</div>
                <h4 className="font-bold text-gray-900 mb-2">Testar</h4>
                <p className="text-sm text-gray-600">Validação das soluções através de experimentação</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00979D] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">5</div>
                <h4 className="font-bold text-gray-900 mb-2">Implementar</h4>
                <p className="text-sm text-gray-600">Aplicação prática e compartilhamento dos resultados</p>
              </div>
            </div>
          </div>

          {/* Competências */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Competências Técnicas</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</div>
                  <span>Programação e Pensamento Computacional</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</div>
                  <span>Robótica e Automação</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</div>
                  <span>Design Digital e Criatividade</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</div>
                  <span>Marketing Digital e Comunicação</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</div>
                  <span>Desenvolvimento Web</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Competências Socioemocionais</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">💡</div>
                  <span>Pensamento Crítico e Criativo</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">🤝</div>
                  <span>Colaboração e Trabalho em Equipe</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">🎯</div>
                  <span>Liderança e Protagonismo</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">🌱</div>
                  <span>Consciência Ambiental</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs mr-3">🚀</div>
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

      {/* Oficinas */}
      <section id="oficinas" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossas Oficinas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvemos habilidades essenciais para o futuro através de metodologias inovadoras
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Robótica */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Robótica Sustentável e Programação</h3>
              <p className="text-gray-600 mb-4">
                Projeto interdisciplinar STEAM usando materiais reutilizáveis. Mecânica, elétrica e programação alinhados à BNCC.
              </p>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                <strong>Idade:</strong> A partir de 11 anos
              </div>
            </div>

            {/* Blocks Kids */}
            <div className="border border-[#00979D] rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🧩</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Blocks Kids</h3>
              <p className="text-gray-600 mb-4">
                Editor visual de programação por blocos para Arduino. Interface lúdica para aprender programação brincando.
              </p>
              <Link href="/home">
                <button className="bg-[#00979D] hover:bg-[#007A7E] text-white font-semibold px-6 py-2 rounded w-full transition-colors">
                  Acessar Plataforma
                </button>
              </Link>
            </div>

            {/* Design */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-2xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Design Gráfico</h3>
              <p className="text-gray-600 mb-4">
                Criação de posts e conteúdos para redes sociais, UX Design, Copywriting e teoria das cores.
              </p>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Marketing */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Marketing Digital</h3>
              <p className="text-gray-600 mb-4">
                Estratégias eficazes de marketing: Copywriting, email-marketing, Google ADS e SEO.
              </p>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Social Media */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl mb-4">📲</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Social Media</h3>
              <p className="text-gray-600 mb-4">
                Gestão estratégica de redes sociais, postagem eficaz e geração de leads.
              </p>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Web Design */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-2xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Web Design</h3>
              <p className="text-gray-600 mb-4">
                Desenvolvimento de sistemas e aplicativos com HTML5, CSS3 e Github em ambiente corporativo real.
              </p>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>
          </div>

          {/* Experiências */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossos Alunos em Ação</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative rounded-lg overflow-hidden">
                <img src={imagemAula1} alt="Alunos trabalhando" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">Aprendizado Prático</h4>
                  <p>Nossos alunos desenvolvem projetos reais, aplicando conhecimentos de forma prática e colaborativa.</p>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img src={imagemAula3} alt="Ambiente colaborativo" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">Ambiente Inspirador</h4>
                  <p>Espaços modernos e equipados para estimular a criatividade e o pensamento inovador.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parceria CODEL */}
          <div className="mt-16 bg-gray-50 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">♻️</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Sustentabilidade em Ação</h3>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg">
              Em parceria com a <strong>CODEL (Coleta e Descarte de Eletrônicos)</strong>, incorporamos materiais reutilizáveis, 
              incluindo eletrônicos, promovendo sustentabilidade e inovação em todas as nossas oficinas.
            </p>
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
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-4">📧</div>
              <div className="font-bold text-gray-900 mb-2">E-mail</div>
              <div className="text-sm text-gray-600">contato@oficinadoamanha.com.br</div>
            </a>
            
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-4">📱</div>
              <div className="font-bold text-gray-900 mb-2">WhatsApp</div>
              <div className="text-sm text-gray-600">(34) 99733-7087</div>
            </a>
            
            <a href="https://www.instagram.com/oficinadoamanha.udi/" target="_blank" rel="noopener" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-4">📸</div>
              <div className="font-bold text-gray-900 mb-2">Instagram</div>
              <div className="text-sm text-gray-600">@oficinadoamanha.udi</div>
            </a>
            
            <a href="https://www.linkedin.com/company/oficina-do-amanh%C3%A3" target="_blank" rel="noopener" className="bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 text-center transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-4">💼</div>
              <div className="font-bold text-gray-900 mb-2">LinkedIn</div>
              <div className="text-sm text-gray-600">Oficina do Amanhã</div>
            </a>
          </div>
          
          <div className="text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-sm mx-auto mb-8">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-4">📍</div>
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
