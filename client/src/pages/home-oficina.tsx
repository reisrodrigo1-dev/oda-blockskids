import { Link } from "wouter";
import { Button } from "../components/ui/button";

export default function HomeOficina() {      {/* Depoimentos */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-extrabold text-purple-600 mb-4 text-center">O que dizem sobre nós</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Depoimentos reais de educadores, pais e alunos que vivenciaram nossa metodologia</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">AP</span>
              </div>
              <div className="ml-3">
                <div className="font-bold text-gray-800">Profa. Ana Paula</div>
                <div className="text-sm text-gray-600">Coord. Pedagógica</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"A Oficina do Amanhã revolucionou nossa escola! Os alunos agora criam projetos incríveis e o engajamento aumentou 300%. A metodologia é realmente inovadora."</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">CG</span>
              </div>
              <div className="ml-3">
                <div className="font-bold text-gray-800">Carlos Gustavo</div>
                <div className="text-sm text-gray-600">Pai de aluno</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"Meu filho aprendeu robótica e programação de verdade! Ele monta robôs em casa e explica conceitos que nem eu conhecia. Incrível!"</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">MS</span>
              </div>
              <div className="ml-3">
                <div className="font-bold text-gray-800">Maria Santos</div>
                <div className="text-sm text-gray-600">Diretora Escolar</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"Implementamos a metodologia da Oficina do Amanhã e nossa escola se tornou referência em educação tecnológica na região. Resultados fantásticos!"</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">JM</span>
              </div>
              <div className="ml-3">
                <div className="font-bold text-gray-800">Prof. João Marcelo</div>
                <div className="text-sm text-gray-600">Professor de Ciências</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"O treinamento transformou minha prática docente. Agora minhas aulas são mais dinâmicas e os alunos participam ativamente dos experimentos."</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">LR</span>
              </div>
              <div className="ml-3">
                <div className="font-bold text-gray-800">Luisa Rodrigues</div>
                <div className="text-sm text-gray-600">Aluna, 14 anos</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"Aprendi a programar e construir robôs! Agora quero estudar engenharia. A Oficina do Amanhã mudou meu futuro!"</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">RS</span>
              </div>
              <div className="ml-3">
                <div className="font-bold text-gray-800">Roberto Silva</div>
                <div className="text-sm text-gray-600">Secretário de Educação</div>
              </div>
            </div>
            <p className="text-gray-700 italic">"Parceria excepcional! A Oficina do Amanhã capacitou mais de 200 professores em nosso município. Resultados impressionantes na rede pública."</p>
          </div>
        </div>
      </section>   <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white font-nunito">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 text-white">
        <div className="max-w-4xl text-center">
          <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">Oficina do Amanhã</h1>
          <p className="text-2xl mb-4 font-medium opacity-90">Referência Nacional em Educação Inovadora</p>
          <p className="text-lg mb-8 font-light opacity-80">Desenvolvemos metodologias próprias em tecnologia, robótica e programação para transformar a educação de crianças e jovens em todo o Brasil.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/home">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-200">
                🚀 Acessar Blocks Kids
              </Button>
            </Link>
            <a href="#contato" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-200">
              Fale Conosco
            </a>
          </div>
        </div>
      </section>

      {/* Missão e Diferenciais */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-12">Quem Somos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-500">
            <span className="text-6xl mb-4">🎯</span>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Nossa Missão</h3>
            <p className="text-gray-700 text-center leading-relaxed">Preparar crianças e jovens para o futuro através de metodologias inovadoras, estimulando criatividade, pensamento crítico e habilidades tecnológicas essenciais.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-purple-500">
            <span className="text-6xl mb-4">⭐</span>
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Diferenciais</h3>
            <ul className="text-gray-700 text-center space-y-2">
              <li>✓ Metodologia própria desenvolvida por especialistas</li>
              <li>✓ Projetos práticos e lúdicos</li>
              <li>✓ Integração MEP (Mecânica, Eletrônica, Programação)</li>
              <li>✓ Ferramentas tecnológicas exclusivas</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-green-500">
            <span className="text-6xl mb-4">�</span>
            <h3 className="text-2xl font-bold text-green-600 mb-4">Impacto</h3>
            <div className="text-gray-700 text-center space-y-2">
              <p className="font-bold text-2xl text-green-600">10.000+</p>
              <p>Alunos impactados</p>
              <p className="font-bold text-2xl text-green-600">500+</p>
              <p>Escolas atendidas</p>
              <p className="font-bold text-2xl text-green-600">15+</p>
              <p>Estados do Brasil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos e Soluções */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-purple-600 mb-4 text-center">Nossos Produtos e Soluções</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Ferramentas e metodologias desenvolvidas para revolucionar a educação tecnológica</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-2xl font-bold mb-4">Blocks Kids</h3>
              <p className="text-blue-100 mb-6 flex-grow">Editor visual de programação por blocos para Arduino. Interface lúdica e intuitiva, desenvolvida especialmente para crianças e educadores.</p>
              <Link href="/home">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-full w-full">
                  Acessar Plataforma
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">Oficinas Temáticas</h3>
              <p className="text-purple-100 mb-6 flex-grow">Projetos práticos de robótica, cidades inteligentes, exploração espacial, energias renováveis, agronomia sustentável e inclusão tecnológica.</p>
              <a href="#contato" className="bg-white hover:bg-gray-100 text-purple-600 font-bold px-6 py-3 rounded-full text-center">
                Solicitar Orçamento
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-4">Capacitação de Professores</h3>
              <p className="text-green-100 mb-6 flex-grow">Treinamentos e workshops para educadores implementarem metodologias inovadoras em suas escolas e instituições.</p>
              <a href="#contato" className="bg-white hover:bg-gray-100 text-green-600 font-bold px-6 py-3 rounded-full text-center">
                Saiba Mais
              </a>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <div className="text-4xl mb-4">🏫</div>
              <h3 className="text-2xl font-bold mb-4">Consultoria Educacional</h3>
              <p className="text-orange-100 mb-6 flex-grow">Assessoria para implementação de laboratórios de inovação, currículos tecnológicos e projetos pedagógicos personalizados.</p>
              <a href="#contato" className="bg-white hover:bg-gray-100 text-orange-600 font-bold px-6 py-3 rounded-full text-center">
                Fale Conosco
              </a>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Eventos e Workshops</h3>
              <p className="text-red-100 mb-6 flex-grow">Palestras, workshops, feiras de ciências e eventos corporativos focados em educação inovadora e tecnologia.</p>
              <a href="#contato" className="bg-white hover:bg-gray-100 text-red-600 font-bold px-6 py-3 rounded-full text-center">
                Agendar Evento
              </a>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold mb-4">Materiais Didáticos</h3>
              <p className="text-indigo-100 mb-6 flex-grow">Kits educacionais, apostilas, projetos práticos e recursos pedagógicos para implementar tecnologia na educação.</p>
              <a href="#contato" className="bg-white hover:bg-gray-100 text-indigo-600 font-bold px-6 py-3 rounded-full text-center">
                Ver Catálogo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-extrabold text-purple-600 mb-8 text-center">Depoimentos</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-700 italic mb-4">“A Oficina do Amanhã mudou a forma como meus alunos enxergam tecnologia. Eles criam, testam e aprendem brincando!”</p>
            <span className="font-bold text-blue-600">Prof. Ana Paula</span>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-700 italic mb-4">“Meu filho aprendeu robótica e programação de verdade, com projetos que ele mesmo montou!”</p>
            <span className="font-bold text-purple-600">Carlos, pai de aluno</span>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6">Entre em Contato</h2>
          <p className="text-xl mb-8 opacity-90">Quer levar a Oficina do Amanhã para sua escola, evento ou instituição?</p>
          
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:contato@oficinadoamanha.com.br" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200">
              Solicitar Orçamento
            </a>
            <a href="https://api.whatsapp.com/send/?phone=5534997337087" target="_blank" rel="noopener" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8 text-center text-sm mt-12">
        © {new Date().getFullYear()} Oficina do Amanhã. Todos os direitos reservados. | Desenvolvido por Oficina do Amanhã
      </footer>
    </div>
  );
}
