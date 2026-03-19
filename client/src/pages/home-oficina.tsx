import { Link } from "wouter";
import { Button } from "../components/ui/button";

export default function HomeOficina() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white font-nunito">
      <section className="w-full py-20 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 text-white">
        <div className="max-w-4xl text-center">
          <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">Oficina do Amanha</h1>
          <p className="text-2xl mb-4 font-medium opacity-90">Referencia Nacional em Educacao Inovadora</p>
          <p className="text-lg mb-8 font-light opacity-80">
            Desenvolvemos metodologias proprias em tecnologia, robotica e programacao para
            transformar a educacao de criancas e jovens em todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/home">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-200">
                Acessar Blocks Kids
              </Button>
            </Link>
            <a
              href="#contato"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-200"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-12">Quem Somos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Nossa Missao</h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Preparar criancas e jovens para o futuro atraves de metodologias inovadoras,
              estimulando criatividade, pensamento critico e habilidades tecnologicas essenciais.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-purple-500">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Diferenciais</h3>
            <ul className="text-gray-700 text-center space-y-2">
              <li>Metodologia propria desenvolvida por especialistas</li>
              <li>Projetos praticos e ludicos</li>
              <li>Integracao MEP (Mecanica, Eletronica, Programacao)</li>
              <li>Ferramentas tecnologicas exclusivas</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-green-500">
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

      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-purple-600 mb-4 text-center">
            Nossos Produtos e Solucoes
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Ferramentas e metodologias desenvolvidas para revolucionar a educacao tecnologica
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Blocks Kids</h3>
              <p className="text-blue-100 mb-6 flex-grow">
                Editor visual de programacao por blocos para Arduino. Interface ludica e intuitiva,
                desenvolvida especialmente para criancas e educadores.
              </p>
              <Link href="/home">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-full w-full">
                  Acessar Plataforma
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Oficinas Tematicas</h3>
              <p className="text-purple-100 mb-6 flex-grow">
                Projetos praticos de robotica, cidades inteligentes, exploracao espacial,
                energias renovaveis, agronomia sustentavel e inclusao tecnologica.
              </p>
              <a
                href="#contato"
                className="bg-white hover:bg-gray-100 text-purple-600 font-bold px-6 py-3 rounded-full text-center"
              >
                Solicitar Orcamento
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Capacitacao de Professores</h3>
              <p className="text-green-100 mb-6 flex-grow">
                Treinamentos e workshops para educadores implementarem metodologias inovadoras
                em suas escolas e instituicoes.
              </p>
              <a
                href="#contato"
                className="bg-white hover:bg-gray-100 text-green-600 font-bold px-6 py-3 rounded-full text-center"
              >
                Saiba Mais
              </a>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Consultoria Educacional</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Assessoria para implementacao de laboratorios de inovacao, curriculos
                tecnologicos e projetos pedagogicos personalizados.
              </p>
              <a
                href="#contato"
                className="bg-white hover:bg-gray-100 text-orange-600 font-bold px-6 py-3 rounded-full text-center"
              >
                Fale Conosco
              </a>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Eventos e Workshops</h3>
              <p className="text-red-100 mb-6 flex-grow">
                Palestras, workshops, feiras de ciencias e eventos corporativos focados em
                educacao inovadora e tecnologia.
              </p>
              <a
                href="#contato"
                className="bg-white hover:bg-gray-100 text-red-600 font-bold px-6 py-3 rounded-full text-center"
              >
                Agendar Evento
              </a>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Materiais Didaticos</h3>
              <p className="text-indigo-100 mb-6 flex-grow">
                Kits educacionais, apostilas, projetos praticos e recursos pedagogicos para
                implementar tecnologia na educacao.
              </p>
              <a
                href="#contato"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-bold px-6 py-3 rounded-full text-center"
              >
                Ver Catalogo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-extrabold text-purple-600 mb-4 text-center">O que dizem sobre nos</h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Depoimentos reais de educadores, pais e alunos que vivenciaram nossa metodologia
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="font-bold text-gray-800 mb-2">Profa. Ana Paula</div>
            <p className="text-gray-700 italic">
              A Oficina do Amanha revolucionou nossa escola. Os alunos agora criam projetos
              incriveis e o engajamento aumentou muito.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="font-bold text-gray-800 mb-2">Carlos Gustavo</div>
            <p className="text-gray-700 italic">
              Meu filho aprendeu robotica e programacao de verdade. Ele monta robos em casa e
              explica conceitos que eu nao conhecia.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="font-bold text-gray-800 mb-2">Maria Santos</div>
            <p className="text-gray-700 italic">
              Implementamos a metodologia e nossa escola se tornou referencia em educacao
              tecnologica na regiao.
            </p>
          </div>
        </div>
      </section>

      <section id="contato" className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6">Entre em Contato</h2>
          <p className="text-xl mb-8 opacity-90">
            Quer levar a Oficina do Amanha para sua escola, evento ou instituicao?
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <a
              href="mailto:contato@oficinadoamanha.com.br"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200"
            >
              <div className="font-bold">E-mail</div>
              <div className="text-sm opacity-80">contato@oficinadoamanha.com.br</div>
            </a>

            <a
              href="https://api.whatsapp.com/send/?phone=5534997337087"
              target="_blank"
              rel="noopener"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200"
            >
              <div className="font-bold">WhatsApp</div>
              <div className="text-sm opacity-80">(34) 99733-7087</div>
            </a>

            <a
              href="https://www.instagram.com/oficinadoamanha.udi/"
              target="_blank"
              rel="noopener"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200"
            >
              <div className="font-bold">Instagram</div>
              <div className="text-sm opacity-80">@oficinadoamanha.udi</div>
            </a>

            <a
              href="https://www.linkedin.com/company/oficina-do-amanh%C3%A3"
              target="_blank"
              rel="noopener"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-6 transition-all duration-200"
            >
              <div className="font-bold">LinkedIn</div>
              <div className="text-sm opacity-80">Oficina do Amanha</div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contato@oficinadoamanha.com.br"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200"
            >
              Solicitar Orcamento
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=5534997337087"
              target="_blank"
              rel="noopener"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-blue-600 text-white py-8 text-center text-sm mt-12">
        Copyright {new Date().getFullYear()} Oficina do Amanha. Todos os direitos reservados.
      </footer>
    </div>
  );
}
