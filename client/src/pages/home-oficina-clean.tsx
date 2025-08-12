import { Link } from "wouter";
import { Button } from "../components/ui/button";
import logoOficina from "../assets/618819.jpg";
import Iridescence from "../components/Iridescence";

export default function HomeOficina() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white font-nunito">
      {/* Hero Section */}
      <section className="relative w-full py-20 px-4 flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Iridescent Background */}
        <div className="absolute inset-0">
          <Iridescence
            color={[0.3, 0.6, 1.0]}
            mouseReact={true}
            amplitude={0.2}
            speed={0.5}
          />
        </div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <img src={logoOficina} alt="Oficina do Amanhã" />
          </div>
          <h1 className="text-6xl font-extrabold mb-6 drop-shadow-2xl">Oficina do Amanhã</h1>
          <p className="text-2xl mb-4 font-medium opacity-95 drop-shadow-lg">Centro de Desenvolvimento de Habilidades</p>
          <p className="text-lg mb-8 font-light opacity-90 drop-shadow">Empoderamos e transformamos crianças e jovens através de educação inovadora e disruptiva, promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/home">
              <Button className="bg-yellow-400/90 hover:bg-yellow-500 backdrop-blur text-blue-900 font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all duration-200 border border-yellow-300/50">
                🚀 Acessar Blocks Kids
              </Button>
            </Link>
            <a href="#contato" className="bg-white/10 border-2 border-white/50 hover:bg-white/20 backdrop-blur text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-200">
              Fale Conosco
            </a>
          </div>
        </div>
      </section>

      {/* Sobre a Oficina do Amanhã */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-600 mb-4">Centro de Desenvolvimento de Habilidades</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Localizado em Uberlândia-MG, oferecemos Oficinas de Robótica Sustentável, Programação e Oficinas Profissionalizantes para crianças e jovens.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-500">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Nossa Missão</h3>
            <p className="text-gray-700">Empoderar e transformar crianças e jovens através de educação inovadora e disruptiva, promovendo pesquisa, criatividade, cidadania e empreendedorismo sustentável.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-green-500">
            <div className="text-4xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">Nossa Visão</h3>
            <p className="text-gray-700">Promover experiências enriquecedoras e transformadoras, capacitando nossos alunos como agentes de mudanças positivas e sustentáveis.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-purple-500">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Nossos Valores</h3>
            <p className="text-gray-700">Dedicação, impacto, colaboração, criatividade, empatia, inclusão, integridade e sustentabilidade.</p>
          </div>
        </div>

        {/* Números da OdA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-8">OdA em Números</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-extrabold mb-2">+12K</div>
              <div className="text-blue-200">Crianças e jovens impactados</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">+50</div>
              <div className="text-blue-200">Toneladas de material reciclado</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">+50K</div>
              <div className="text-blue-200">Horas de instrução</div>
            </div>
          </div>
        </div>
      </section>

      {/* Oficinas e Cursos */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-purple-600 mb-4 text-center">Nossas Oficinas</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Desenvolvemos habilidades essenciais para o futuro através de metodologias inovadoras</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Robótica Sustentável */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">Robótica Sustentável e Programação</h3>
              <p className="text-green-100 mb-4">Projeto interdisciplinar STEAM usando materiais reutilizáveis. Mecânica, elétrica e programação alinhados à BNCC.</p>
              <div className="text-sm bg-green-400/20 rounded-lg p-3">
                <strong>Idade:</strong> A partir de 11 anos
              </div>
            </div>

            {/* Blocks Kids */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-2xl font-bold mb-4">Blocks Kids</h3>
              <p className="text-blue-100 mb-4">Editor visual de programação por blocos para Arduino. Interface lúdica para aprender programação brincando.</p>
              <Link href="/home">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-lg w-full transition-all">
                  Acessar Plataforma
                </button>
              </Link>
            </div>

            {/* Design Gráfico */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-4">Design Gráfico</h3>
              <p className="text-pink-100 mb-4">Criação de posts e conteúdos para redes sociais, UX Design, Copywriting e teoria das cores.</p>
              <div className="text-sm bg-pink-400/20 rounded-lg p-3">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Marketing Digital */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-4">Marketing Digital</h3>
              <p className="text-orange-100 mb-4">Estratégias eficazes de marketing: Copywriting, email-marketing, Google ADS e SEO.</p>
              <div className="text-sm bg-orange-400/20 rounded-lg p-3">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-4xl mb-4">📲</div>
              <h3 className="text-2xl font-bold mb-4">Social Media</h3>
              <p className="text-purple-100 mb-4">Gestão estratégica de redes sociais, postagem eficaz e geração de leads.</p>
              <div className="text-sm bg-purple-400/20 rounded-lg p-3">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>

            {/* Web Design */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-4">Web Design</h3>
              <p className="text-indigo-100 mb-4">Desenvolvimento de sistemas e aplicativos com HTML5, CSS3 e Github em ambiente corporativo real.</p>
              <div className="text-sm bg-indigo-400/20 rounded-lg p-3">
                <strong>Idade:</strong> A partir de 14 anos<br/>
                <strong>Requisito:</strong> Informática Básica
              </div>
            </div>
          </div>

          {/* Parceria CODEL */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">♻️ Sustentabilidade em Ação</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Em parceria com a <strong>CODEL (Coleta e Descarte de Eletrônicos)</strong>, incorporamos materiais reutilizáveis, 
              incluindo eletrônicos, promovendo sustentabilidade e inovação em todas as nossas oficinas.
            </p>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6">Entre em Contato</h2>
          <p className="text-xl mb-8 opacity-90">Centro de Desenvolvimento de Habilidades em Uberlândia-MG</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <a href="mailto:contato@oficinadoamanha.com.br" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200">
              <div className="text-3xl mb-2">📧</div>
              <div className="font-bold">E-mail</div>
              <div className="text-sm opacity-80">contato@oficinadoamanha.com.br</div>
            </a>
            
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200">
              <div className="text-3xl mb-2">📱</div>
              <div className="font-bold">WhatsApp</div>
              <div className="text-sm opacity-80">(34) 99733-7087</div>
            </a>
            
            <a href="https://www.instagram.com/oficinadoamanha.udi/" target="_blank" rel="noopener" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200">
              <div className="text-3xl mb-2">📸</div>
              <div className="font-bold">Instagram</div>
              <div className="text-sm opacity-80">@oficinadoamanha.udi</div>
            </a>
            
            <a href="https://www.linkedin.com/company/oficina-do-amanh%C3%A3" target="_blank" rel="noopener" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200">
              <div className="text-3xl mb-2">💼</div>
              <div className="font-bold">LinkedIn</div>
              <div className="text-sm opacity-80">Oficina do Amanhã</div>
            </a>
          </div>
          
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 max-w-md mx-auto">
              <div className="text-3xl mb-2">📍</div>
              <div className="font-bold">Localização</div>
              <div className="text-sm opacity-80">Uberlândia - MG</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:contato@oficinadoamanha.com.br" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200">
              Solicitar Informações
            </a>
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8 text-center text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-4">© {new Date().getFullYear()} Oficina do Amanhã. Todos os direitos reservados.</p>
          <p className="text-blue-200">Desenvolvido com ❤️ pela equipe da Oficina do Amanhã</p>
        </div>
      </footer>
    </div>
  );
}
