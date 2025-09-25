import { Link } from "wouter";
import { Button } from "../components/ui/button";
import logoOdA from "../assets/logo-OdA.png";
import imagemAula1 from "../assets/imagem_aula_1.jpg";
import imagemAula2 from "../assets/imagem_aula_2.jpg";
import imagemAula3 from "../assets/imagem_aula_3.jpg";
import imagemAula4 from "../assets/imagem_aula_4.jpg";
import Iridescence from "../components/Iridescence";
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
    <div ref={ref} className="text-4xl font-extrabold mb-2">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function HomeOficina() {
  return (
    <div className="min-h-screen bg-white font-nunito">
      {/* Hero Section */}
      <section className="relative w-full py-20 px-4 flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Gradiente OdA - Azul escuro para roxo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E96] via-[#4A5FBA] to-[#6B73D9]"></div>
        
        {/* Elementos geométricos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF6B35]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-[#FF6B35]/30 rounded-lg rotate-45 blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/20 rounded-lg rotate-12 blur-md"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl text-center">
          <div className="flex justify-center mb-8">
            <img src={logoOdA} alt="Oficina do Amanhã" className="w-56 h-56 object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-7xl font-black mb-6 text-white tracking-tight">
            Oficina do Amanhã
          </h1>
          <div className="bg-[#FF6B35] text-white px-6 py-3 rounded-full text-xl font-bold mb-8 inline-block shadow-lg">
            Centro de Desenvolvimento de Habilidades
          </div>
          <p className="text-xl mb-10 font-light text-white/95 max-w-4xl mx-auto leading-relaxed">
            Empoderamos e transformamos crianças e jovens através de educação inovadora e disruptiva, 
            promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/home">
              <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[#FF6B35]">
                🚀 Acessar Blocks Kids
              </Button>
            </Link>
            <a href="#contato" className="bg-white/15 border-2 border-white/50 hover:bg-white/25 backdrop-blur text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105">
              💬 Fale Conosco
            </a>
          </div>

          {/* Seção de Projetos */}
          <div className="mt-16 pt-12 border-t border-white/30">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold mb-8 text-white">📚 Área de Projetos Pedagógicos</h3>
              <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
                <Link href="/criador-projeto-melhorado">
                  <div className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="text-4xl mb-4">✨</div>
                    <h4 className="font-bold text-lg mb-2">Criar Novo Projeto</h4>
                    <p className="text-sm text-white/80">Desenvolva projetos personalizados</p>
                  </div>
                </Link>
                <Link href="/projetos-avancados">
                  <div className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="text-4xl mb-4">👁️</div>
                    <h4 className="font-bold text-lg mb-2">Ver Projetos Criados</h4>
                    <p className="text-sm text-white/80">Explore projetos da comunidade</p>
                  </div>
                </Link>
                <Link href="/projetos-pedagogicos">
                  <div className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="text-4xl mb-4">📋</div>
                    <h4 className="font-bold text-lg mb-2">Projetos Básicos</h4>
                    <p className="text-sm text-white/80">Templates prontos para usar</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Oficina do Amanhã */}
      <section className="max-w-7xl mx-auto py-24 px-4 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-[#2C3E96] mb-6">Centro de Desenvolvimento de Habilidades</h2>
          <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Localizado em Uberlândia-MG, oferecemos Oficinas de Robótica Sustentável, Programação e 
            Oficinas Profissionalizantes para crianças e jovens.
          </p>
          
          {/* Galeria de Imagens das Aulas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <img src={imagemAula1} alt="Alunos em aula - Robótica" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#2C3E96]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-bold text-center px-4">Robótica Sustentável</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <img src={imagemAula2} alt="Alunos em aula - Programação" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#FF6B35]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-bold text-center px-4">Programação</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <img src={imagemAula3} alt="Alunos em aula - Design" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#6B73D9]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-bold text-center px-4">Design & Criatividade</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <img src={imagemAula4} alt="Alunos em aula - Projetos" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-green-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-bold text-center px-4">Projetos Colaborativos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border-2 border-gray-100 hover:border-[#2C3E96]/20 transition-all duration-300 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2C3E96] to-[#4A5FBA] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-[#2C3E96] mb-6">Nossa Missão</h3>
            <p className="text-gray-600 leading-relaxed">Empoderar e transformar crianças e jovens através de educação inovadora e disruptiva, promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border-2 border-gray-100 hover:border-[#FF6B35]/20 transition-all duration-300 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6">👁️</div>
            <h3 className="text-2xl font-bold text-[#FF6B35] mb-6">Nossa Visão</h3>
            <p className="text-gray-600 leading-relaxed">Promover experiências enriquecedoras e transformadoras, capacitando nossos alunos como agentes de mudanças positivas e sustentáveis.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border-2 border-gray-100 hover:border-[#6B73D9]/20 transition-all duration-300 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6B73D9] to-[#4A5FBA] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6">💎</div>
            <h3 className="text-2xl font-bold text-[#6B73D9] mb-6">Nossos Valores</h3>
            <p className="text-gray-600 leading-relaxed">Dedicação, impacto, colaboração, criatividade, empatia, inclusão, integridade e sustentabilidade.</p>
          </div>
        </div>

        {/* Números da OdA */}
        <div className="bg-gradient-to-r from-[#2C3E96] via-[#4A5FBA] to-[#6B73D9] rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-4xl font-black mb-12 text-white">OdA em Números</h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <AnimatedNumber end={12000} prefix="+"  duration={1800} />
              <div className="text-white/90 text-lg font-medium">Crianças e jovens impactados</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <AnimatedNumber end={50} prefix="+" duration={1500} />
              <div className="text-white/90 text-lg font-medium">Toneladas de material reciclado</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
              <AnimatedNumber end={50000} prefix="+"  duration={2000} />
              <div className="text-white/90 text-lg font-medium">Horas de instrução</div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologia Educacional */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-[#2C3E96] mb-6">Nossa Metodologia</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Aplicamos metodologias ativas e inovadoras, integrando STEAM, sustentabilidade e empreendedorismo 
              para formar cidadãos preparados para os desafios do século XXI
            </p>
          </div>

          {/* Pilares Metodológicos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-[#2C3E96] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2C3E96] to-[#4A5FBA] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">🎯</div>
              <h3 className="text-xl font-bold text-[#2C3E96] mb-4">Aprendizagem Ativa</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Metodologias hands-on onde os alunos são protagonistas do seu aprendizado através de projetos práticos e desafios reais.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-[#FF6B35] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">🔬</div>
              <h3 className="text-xl font-bold text-[#FF6B35] mb-4">STEAM Integrado</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ciência, Tecnologia, Engenharia, Arte e Matemática trabalhadas de forma interdisciplinar e contextualizada.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">♻️</div>
              <h3 className="text-xl font-bold text-green-600 mb-4">Sustentabilidade</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Uso de materiais reutilizáveis e consciência ambiental integrada em todos os projetos e atividades.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-[#6B73D9] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6B73D9] to-[#4A5FBA] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">🚀</div>
              <h3 className="text-xl font-bold text-[#6B73D9] mb-4">Empreendedorismo</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Desenvolvimento do pensamento empreendedor, criatividade e capacidade de inovação desde cedo.
              </p>
            </div>
          </div>

          {/* Processo de Aprendizagem */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
            <h3 className="text-3xl font-bold text-[#2C3E96] mb-8 text-center">Nosso Processo de Aprendizagem</h3>
            <div className="grid md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">1</div>
                <h4 className="font-bold text-[#2C3E96] mb-2">Descobrir</h4>
                <p className="text-sm text-gray-600">Identificação de problemas e oportunidades reais</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2C3E96] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">2</div>
                <h4 className="font-bold text-[#2C3E96] mb-2">Idealizar</h4>
                <p className="text-sm text-gray-600">Brainstorming e desenvolvimento de soluções criativas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">3</div>
                <h4 className="font-bold text-[#2C3E96] mb-2">Prototipar</h4>
                <p className="text-sm text-gray-600">Construção de protótipos funcionais com materiais sustentáveis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#6B73D9] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">4</div>
                <h4 className="font-bold text-[#2C3E96] mb-2">Testar</h4>
                <p className="text-sm text-gray-600">Validação das soluções através de experimentação</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">5</div>
                <h4 className="font-bold text-[#2C3E96] mb-2">Implementar</h4>
                <p className="text-sm text-gray-600">Aplicação prática e compartilhamento dos resultados</p>
              </div>
            </div>
          </div>

          {/* Competências Desenvolvidas */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#2C3E96] to-[#4A5FBA] rounded-3xl p-10 text-white">
              <h3 className="text-3xl font-bold mb-8">Competências Técnicas</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm mr-4">✓</div>
                  <span>Programação e Pensamento Computacional</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm mr-4">✓</div>
                  <span>Robótica e Automação</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm mr-4">✓</div>
                  <span>Design Digital e Criatividade</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm mr-4">✓</div>
                  <span>Marketing Digital e Comunicação</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm mr-4">✓</div>
                  <span>Desenvolvimento Web</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-3xl p-10 text-white">
              <h3 className="text-3xl font-bold mb-8">Competências Socioemocionais</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm mr-4">💡</div>
                  <span>Pensamento Crítico e Criativo</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm mr-4">🤝</div>
                  <span>Colaboração e Trabalho em Equipe</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm mr-4">🎯</div>
                  <span>Liderança e Protagonismo</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm mr-4">🌱</div>
                  <span>Consciência Ambiental</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm mr-4">🚀</div>
                  <span>Empreendedorismo e Inovação</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Alinhamento com BNCC */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#2C3E96] mb-6">Alinhamento com a BNCC</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossos projetos estão totalmente alinhados com a Base Nacional Comum Curricular, 
              desenvolvendo as competências gerais necessárias para a formação integral dos estudantes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-l-4 border-[#2C3E96]">
              <h3 className="text-xl font-bold text-[#2C3E96] mb-4">🧠 Competências Cognitivas</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Pensamento científico, crítico e criativo</li>
                <li>• Repertório cultural e conhecimento</li>
                <li>• Comunicação e argumentação</li>
                <li>• Cultura digital e tecnológica</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border-l-4 border-[#FF6B35]">
              <h3 className="text-xl font-bold text-[#FF6B35] mb-4">🤝 Competências Sociais</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Empatia e cooperação</li>
                <li>• Diversidade e direitos humanos</li>
                <li>• Trabalho e projeto de vida</li>
                <li>• Argumentação e diálogo</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-green-600 mb-4">🌱 Competências Pessoais</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Autoconhecimento e autocuidado</li>
                <li>• Responsabilidade e cidadania</li>
                <li>• Autonomia e tomada de decisões</li>
                <li>• Resiliência e projeto de vida</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#2C3E96] to-[#4A5FBA] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Certificação e Reconhecimento</h3>
            <p className="text-white/90 max-w-3xl mx-auto">
              Todos os nossos alunos recebem certificados de participação e conclusão, 
              validando as competências desenvolvidas e o cumprimento da carga horária estabelecida.
            </p>
          </div>
        </div>
      </section>

      {/* Oficinas e Cursos */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-[#2C3E96] mb-6">Nossas Oficinas</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Desenvolvemos habilidades essenciais para o futuro através de metodologias inovadoras</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Robótica Sustentável */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-2xl p-10 text-white border-2 border-green-400/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🤖</div>
              <h3 className="text-3xl font-bold mb-6">Robótica Sustentável e Programação</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Projeto interdisciplinar STEAM usando materiais reutilizáveis. Mecânica, elétrica e programação alinhados à BNCC.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 11 anos
              </div>
            </div>

            {/* Blocks Kids */}
            <div className="bg-gradient-to-br from-[#2C3E96] to-[#4A5FBA] rounded-3xl shadow-2xl p-10 text-white border-2 border-[#FF6B35]/20">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center text-3xl mb-6">🧩</div>
              <h3 className="text-3xl font-bold mb-6">Blocks Kids</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Editor visual de programação por blocos para Arduino. Interface lúdica para aprender programação brincando.</p>
              <Link href="/home">
                <button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold px-6 py-4 rounded-2xl w-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Acessar Plataforma
                </button>
              </Link>
            </div>

            {/* Design Gráfico */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl shadow-2xl p-10 text-white border-2 border-pink-400/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🎨</div>
              <h3 className="text-3xl font-bold mb-6">Design Gráfico</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Criação de posts e conteúdos para redes sociais, UX Design, Copywriting e teoria das cores.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Marketing Digital */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-3xl shadow-2xl p-10 text-white border-2 border-[#FF6B35]/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">📱</div>
              <h3 className="text-3xl font-bold mb-6">Marketing Digital</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Estratégias eficazes de marketing: Copywriting, email-marketing, Google ADS e SEO.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-[#6B73D9] to-[#4A5FBA] rounded-3xl shadow-2xl p-10 text-white border-2 border-[#6B73D9]/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">📲</div>
              <h3 className="text-3xl font-bold mb-6">Social Media</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Gestão estratégica de redes sociais, postagem eficaz e geração de leads.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Web Design */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl shadow-2xl p-10 text-white border-2 border-indigo-400/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">💻</div>
              <h3 className="text-3xl font-bold mb-6">Web Design</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Desenvolvimento de sistemas e aplicativos com HTML5, CSS3 e Github em ambiente corporativo real.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>
          </div>

          {/* Experiências dos Alunos */}
          <div className="mt-20 mb-16">
            <h3 className="text-4xl font-black text-[#2C3E96] mb-12 text-center">Nossos Alunos em Ação</h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="relative">
                <img src={imagemAula1} alt="Alunos trabalhando em projetos de robótica" className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E96]/80 to-transparent rounded-3xl"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">Aprendizado Prático</h4>
                  <p className="text-white/90">Nossos alunos desenvolvem projetos reais, aplicando conhecimentos de forma prática e colaborativa.</p>
                </div>
              </div>
              <div className="relative">
                <img src={imagemAula3} alt="Ambiente de aprendizagem colaborativo" className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/80 to-transparent rounded-3xl"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">Ambiente Inspirador</h4>
                  <p className="text-white/90">Espaços modernos e equipados para estimular a criatividade e o pensamento inovador.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parceria CODEL */}
          <div className="mt-16 bg-white rounded-3xl shadow-2xl p-12 text-center border-2 border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-8">♻️</div>
            <h3 className="text-3xl font-bold text-green-600 mb-6">Sustentabilidade em Ação</h3>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
              Em parceria com a <strong className="text-[#2C3E96]">CODEL (Coleta e Descarte de Eletrônicos)</strong>, incorporamos materiais reutilizáveis, 
              incluindo eletrônicos, promovendo sustentabilidade e inovação em todas as nossas oficinas.
            </p>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="bg-gradient-to-r from-[#2C3E96] via-[#4A5FBA] to-[#6B73D9] py-24">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-5xl font-black mb-8">Entre em Contato</h2>
          <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-8"></div>
          <p className="text-xl mb-12 text-white/90">Centro de Desenvolvimento de Habilidades em Uberlândia-MG</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <a href="mailto:contato@oficinadoamanha.com.br" className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">📧</div>
              <div className="font-bold text-lg mb-2">E-mail</div>
              <div className="text-sm text-white/80">contato@oficinadoamanha.com.br</div>
            </a>
            
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">📱</div>
              <div className="font-bold text-lg mb-2">WhatsApp</div>
              <div className="text-sm text-white/80">(34) 99733-7087</div>
            </a>
            
            <a href="https://www.instagram.com/oficinadoamanha.udi/" target="_blank" rel="noopener" className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">📸</div>
              <div className="font-bold text-lg mb-2">Instagram</div>
              <div className="text-sm text-white/80">@oficinadoamanha.udi</div>
            </a>
            
            <a href="https://www.linkedin.com/company/oficina-do-amanh%C3%A3" target="_blank" rel="noopener" className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">💼</div>
              <div className="font-bold text-lg mb-2">LinkedIn</div>
              <div className="text-sm text-white/80">Oficina do Amanhã</div>
            </a>
          </div>
          
          <div className="mb-12">
            <div className="bg-white/15 backdrop-blur rounded-2xl p-8 max-w-sm mx-auto border border-white/20">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">📍</div>
              <div className="font-bold text-lg mb-2">Localização</div>
              <div className="text-white/80">Uberlândia - MG</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="mailto:contato@oficinadoamanha.com.br" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105">
              💌 Solicitar Informações
            </a>
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105">
              💬 Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E96] text-white py-16 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <img src={logoOdA} alt="Oficina do Amanhã" className="w-24 h-24 object-contain opacity-90" />
          </div>
          <div className="w-16 h-1 bg-[#FF6B35] mx-auto mb-8"></div>
          <p className="mb-6 text-lg">© {new Date().getFullYear()} Oficina do Amanhã. Todos os direitos reservados.</p>
          <p className="text-white/70">Desenvolvido com ❤️ pela equipe da Oficina do Amanhã</p>
        </div>
      </footer>
    </div>
  );
}
