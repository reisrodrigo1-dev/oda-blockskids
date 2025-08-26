import { useState } from "react";
import { useLocation } from "wouter";
import logoOficina from "../assets/618819.jpg";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-nunito flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-6 px-8 flex items-center justify-between border-b-2 border-kid-blue">
        <div className="flex items-center gap-4">
          <img src={logoOficina} alt="Oficina do Amanhã" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <h1 className="text-3xl font-extrabold text-kid-blue">Blocks Kids</h1>
            <span className="text-sm text-gray-500 font-semibold">por Oficina do Amanhã</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setLocation("/login-professor")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-block transition-all duration-200 text-sm"
          >
            👨‍🏫 Professor
          </button>
          <button
            onClick={() => setLocation("/login-aluno")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-block transition-all duration-200 text-sm"
          >
            👨‍🎓 Aluno
          </button>
          <button
            onClick={() => setLocation("/projeto-pedagogico")}
            className="bg-kid-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-block transition-all duration-200 text-lg"
          >
            Sou professor
          </button>
          <button
            onClick={() => setLocation("/exploracao-espacial")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-block transition-all duration-200 text-sm"
          >
            🚀 Exploração Espacial
          </button>
          <button
            onClick={() => setLocation("/editor-offline")}
            className="bg-kid-orange hover:bg-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-playful transition-all duration-200 text-lg"
          >
            Iniciar
          </button>
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <section className="max-w-3xl w-full text-center py-16">
          <h2 className="text-4xl font-extrabold text-kid-blue mb-4">Bem-vindo ao Blocks Kids!</h2>
          <div className="mb-6">
            <span className="inline-block bg-kid-orange text-white px-4 py-2 rounded-full font-bold shadow-block text-lg">
              Desenvolvido com metodologia própria para o ensino de tecnologia, criada por especialistas da Oficina do Amanhã
            </span>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            O <span className="font-bold text-kid-orange">Blocks Kids</span> é um editor visual de programação por blocos para Arduino, desenvolvido especialmente para crianças e educadores. Com uma interface lúdica e intuitiva, você pode criar projetos eletrônicos de forma divertida e descomplicada!
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a href="https://oficinadoamanha.com.br" target="_blank" rel="noopener" className="bg-kid-green hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-block transition-all duration-200">Conheça a Oficina do Amanhã</a>
            <button
              onClick={() => setLocation("/editor-offline")}
              className="bg-kid-orange hover:bg-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-playful transition-all duration-200"
            >
              Iniciar agora
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-4xl w-full py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-block p-6 flex flex-col items-center">
            <span className="text-5xl mb-4">🎨</span>
            <h3 className="text-xl font-bold text-kid-blue mb-2">Interface Lúdica</h3>
            <p className="text-gray-600">Pensada para crianças, com blocos coloridos e fácil de usar.</p>
          </div>
          <div className="bg-white rounded-xl shadow-block p-6 flex flex-col items-center">
            <span className="text-5xl mb-4">🔌</span>
            <h3 className="text-xl font-bold text-kid-orange mb-2">Programação Arduino</h3>
            <p className="text-gray-600">Monte projetos eletrônicos e veja o código gerado automaticamente.</p>
          </div>
          <div className="bg-white rounded-xl shadow-block p-6 flex flex-col items-center">
            <span className="text-5xl mb-4">🚀</span>
            <h3 className="text-xl font-bold text-kid-green mb-2">Aprenda Brincando</h3>
            <p className="text-gray-600">Ideal para escolas, oficinas e pais que querem ensinar tecnologia.</p>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-3xl w-full py-12 text-center">
          <h3 className="text-2xl font-bold text-kid-blue mb-4">Sobre a Oficina do Amanhã</h3>
          <p className="text-gray-700 mb-4">
            A <a href="https://oficinadoamanha.com.br" target="_blank" rel="noopener" className="text-kid-blue underline font-bold">Oficina do Amanhã</a> é referência nacional em educação inovadora, tecnologia e robótica para crianças e jovens. Nosso objetivo é preparar as novas gerações para o futuro, estimulando criatividade, pensamento crítico e habilidades digitais.
          </p>
          <p className="text-gray-600">Saiba mais em nosso site e conheça nossos cursos, oficinas e projetos!</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-kid-blue py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Oficina do Amanhã. Todos os direitos reservados. | Desenvolvido por Oficina do Amanhã
      </footer>
    </div>
  );
}
