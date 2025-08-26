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
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard Administrativo</h1>
        
        {/* Botão temporário para criar dados de teste */}
        <div className="mb-6">
          <button
            onClick={handleCriarDadosTeste}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            🧪 Criar Dados de Teste (Cliente + Rota + Projetos)
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card: Gerenciar Clientes */}
          <Link href="/admin/gerenciar-clientes">
            <a className="block bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg hover:bg-gray-700 transition-all">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <span>🏢</span> Gerenciar Clientes
              </h2>
              <p className="text-gray-300">Cadastre e gerencie instituições de ensino e suas rotas de estudo.</p>
            </a>
          </Link>

          {/* Card: Criar Projeto Melhorado */}
          <Link href="/admin/criador-projeto-melhorado">
            <a className="block bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg hover:bg-gray-700 transition-all">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <span>✨</span> Criar Projeto Melhorado
              </h2>
              <p className="text-gray-300">Crie projetos pedagógicos avançados, com etapas, objetivos e recursos visuais.</p>
            </a>
          </Link>

          {/* Card: Associar Rotas */}
          <Link href="/admin/associar-rotas-clientes">
            <a className="block bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg hover:bg-gray-700 transition-all">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <span>🔗</span> Associar Rotas
              </h2>
              <p className="text-gray-300">Vincule rotas de estudo específicas para cada cliente.</p>
            </a>
          </Link>
          
          {/* Outros cards de funcionalidades administrativas podem ser adicionados aqui */}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
