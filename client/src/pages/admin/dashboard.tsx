import React from "react";
import { Link } from "wouter";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { criarDadosTeste } from "../../utils/dados-teste";

const AdminDashboard = () => {
  const handleCriarDadosTeste = async () => {
    try {
      const resultado = await criarDadosTeste();
      alert(`Dados de teste criados!\nCliente ID: ${resultado.clienteId}\nCódigo da turma: ${resultado.codigoTurma}`);
    } catch (error) {
      alert("Erro ao criar dados de teste: " + error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-lg text-gray-600">Gerencie clientes, projetos e rotas de estudo</p>
        </div>
        
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Clientes Ativos</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Projetos Criados</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-2">🗺️</div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Rotas de Estudo</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Alunos Atendidos</div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card: Gerenciar Clientes */}
            <Link href="/admin/gerenciar-clientes">
              <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🏢</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Gerenciar Clientes</h2>
                <p className="text-gray-600">Cadastre e gerencie instituições de ensino e suas rotas de estudo.</p>
              </a>
            </Link>

            {/* Card: Criar Projeto */}
            <Link href="/admin/criador-projeto-melhorado">
              <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">✨</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Criar Projeto</h2>
                <p className="text-gray-600">Crie projetos pedagógicos avançados, com etapas, objetivos e recursos visuais.</p>
              </a>
            </Link>

            {/* Card: Projetos Pedagógicos */}
            <Link href="/admin/projetos-pedagogicos">
              <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">📚</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Projetos Pedagógicos</h2>
                <p className="text-gray-600">Visualize e gerencie todos os projetos pedagógicos criados.</p>
              </a>
            </Link>

            {/* Card: Associar Rotas */}
            <Link href="/admin/associar-rotas-clientes">
              <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🔗</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Associar Rotas</h2>
                <p className="text-gray-600">Vincule rotas de estudo específicas para cada cliente.</p>
              </a>
            </Link>

            {/* Card: Rotas de Estudos */}
            <Link href="/admin/rotas-estudos">
              <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🗺️</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Rotas de Estudos</h2>
                <p className="text-gray-600">Gerencie rotas de aprendizado e sequências de projetos.</p>
              </a>
            </Link>

            {/* Card: Voltar ao Site */}
            <Link href="/home-oficina-clean">
              <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center text-2xl mb-4">🌐</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Voltar ao Site</h2>
                <p className="text-gray-600">Retornar para a página principal da Oficina do Amanhã.</p>
              </a>
            </Link>
          </div>
        </div>

        {/* Ferramentas de Desenvolvimento */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">🧪 Ferramentas de Desenvolvimento</h3>
          <button
            onClick={handleCriarDadosTeste}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-semibold transition-colors"
          >
            Criar Dados de Teste (Cliente + Rota + Projetos)
          </button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
