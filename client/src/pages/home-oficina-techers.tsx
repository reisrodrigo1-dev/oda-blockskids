import { Link } from "wouter";
import { Button } from "../components/ui/button";
import logoOdA from "../assets/logo-OdA.png";
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
    <div ref={ref} className="text-4xl font-extrabold mb-2 text-white">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function HomeOficina() {
  return (
    <div className="min-h-screen bg-white font-nunito">
      {/* Navegação Superior */}
      <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoOdA} alt="Oficina do Amanhã" className="h-12 w-auto object-contain" />
            <span className="text-xl font-bold text-[#2C3E96]">Oficina do Amanhã</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-[#2C3E96] font-medium transition-colors">Início</a>
            <a href="#cursos" className="text-gray-700 hover:text-[#2C3E96] font-medium transition-colors">Cursos</a>
            <a href="#metodologia" className="text-gray-700 hover:text-[#2C3E96] font-medium transition-colors">Metodologia</a>
            <a href="#sobre" className="text-gray-700 hover:text-[#2C3E96] font-medium transition-colors">Sobre</a>
            <a href="#contato" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-2 rounded-full font-bold transition-colors">
              Fale Conosco
            </a>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-[#2C3E96]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E96] via-[#4A5FBA] to-[#6B73D9]"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF6B35]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-[#FF6B35]/30 rounded-lg rotate-45 blur-lg"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <div className="flex justify-center mb-8">
            <img src={logoOdA} alt="Oficina do Amanhã" className="w-32 h-32 object-contain drop-shadow-2xl" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Transforme o Futuro dos<br/>
            <span className="text-[#FF6B35]">Seus Filhos</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 font-light max-w-4xl mx-auto leading-relaxed text-white/90">
            Centro de Desenvolvimento de Habilidades que forma jovens protagonistas através de 
            <strong className="text-[#FF6B35]"> robótica sustentável, programação e empreendedorismo</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#contato" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
              🎯 Agende uma Aula Gratuita
            </a>
            <Link href="/home">
              <Button className="bg-white/10 border-2 border-white/50 hover:bg-white/20 backdrop-blur text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300">
                🚀 Conhecer Blocks Kids
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <AnimatedNumber end={12000} prefix="+" duration={1800} />
              <p className="text-white/80 text-sm">Crianças Impactadas</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <AnimatedNumber end={50000} prefix="+" duration={2000} />
              <p className="text-white/80 text-sm">Horas de Ensino</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <AnimatedNumber end={50} prefix="+" duration={1500} />
              <p className="text-white/80 text-sm">Toneladas Recicladas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Diferenciais */}
      <section id="diferenciais" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2C3E96] mb-6">
              Por que escolher a <span className="text-[#FF6B35]">Oficina do Amanhã</span>?
            </h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos pioneiros em educação tecnológica sustentável, formando jovens protagonistas do futuro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2C3E96] to-[#4A5FBA] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                🚀
              </div>
              <h3 className="text-xl font-bold text-[#2C3E96] mb-4">Metodologia Inovadora</h3>
              <p className="text-gray-600">Aprendizagem ativa com projetos práticos e desafios reais</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                ♻️
              </div>
              <h3 className="text-xl font-bold text-[#FF6B35] mb-4">100% Sustentável</h3>
              <p className="text-gray-600">Uso exclusivo de materiais reutilizáveis e eletrônicos reciclados</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-4">Professores Especializados</h3>
              <p className="text-gray-600">Equipe qualificada com experiência em educação tecnológica</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6B73D9] to-[#4A5FBA] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                🏆
              </div>
              <h3 className="text-xl font-bold text-[#6B73D9] mb-4">Resultados Comprovados</h3>
              <p className="text-gray-600">Mais de 12 mil jovens transformados e 50 toneladas recicladas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Cursos */}
      <section id="cursos" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-[#2C3E96] mb-6">Nossos Cursos</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Desenvolvemos habilidades essenciais para o futuro através de metodologias inovadoras
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#2C3E96] to-[#4A5FBA] rounded-3xl shadow-2xl p-10 text-white">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center text-3xl mb-6">🧩</div>
              <h3 className="text-3xl font-bold mb-6">Blocks Kids</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Editor visual de programação por blocos para Arduino. Interface lúdica para aprender programação brincando.</p>
              <Link href="/home">
                <button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold px-6 py-4 rounded-2xl w-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Acessar Plataforma
                </button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-2xl p-10 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">🤖</div>
              <h3 className="text-3xl font-bold mb-6">Robótica Sustentável</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Projeto interdisciplinar STEAM usando materiais reutilizáveis. Mecânica, elétrica e programação.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 11 anos
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-3xl shadow-2xl p-10 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">📱</div>
              <h3 className="text-3xl font-bold mb-6">Marketing Digital</h3>
              <p className="text-white/90 mb-8 leading-relaxed">Estratégias eficazes: Copywriting, email-marketing, Google ADS e SEO.</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 border border-white/30">
                <strong>Idade:</strong> A partir de 14 anos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Metodologia */}
      <section id="metodologia" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-[#2C3E96] mb-6">Nossa Metodologia</h2>
            <div className="w-24 h-1 bg-[#FF6B35] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Aplicamos metodologias ativas e inovadoras, integrando STEAM, sustentabilidade e empreendedorismo
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 mb-16">
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
              <p className="text-sm text-gray-600">Construção com materiais sustentáveis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6B73D9] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">4</div>
              <h4 className="font-bold text-[#2C3E96] mb-2">Testar</h4>
              <p className="text-sm text-gray-600">Validação através de experimentação</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">5</div>
              <h4 className="font-bold text-[#2C3E96] mb-2">Implementar</h4>
              <p className="text-sm text-gray-600">Aplicação prática e compartilhamento</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <img src={imagemAula1} alt="Alunos em robótica" className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E96]/80 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-2xl font-bold mb-2">Aprendizado Prático</h4>
                <p className="text-white/90">Projetos reais com aplicação direta de conhecimentos</p>
              </div>
            </div>
            <div className="relative">
              <img src={imagemAula3} alt="Ambiente colaborativo" className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/80 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="text-2xl font-bold mb-2">Ambiente Inspirador</h4>
                <p className="text-white/90">Espaços modernos para estimular a criatividade</p>
              </div>
            </div>
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