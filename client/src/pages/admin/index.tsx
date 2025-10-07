import React from "react";
import { Link } from "wouter";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import logoOdA from "../../assets/logo-OdA.png";

const AdminHome = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={logoOdA} alt="Oficina do Amanhã" className="w-32 h-32 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao Painel Administrativo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie toda a plataforma Oficina do Amanhã - Blocks Kids
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-sm text-gray-600">Clientes</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📚</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-sm text-gray-600">Projetos</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-sm text-gray-600">Rotas</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-sm text-gray-600">Alunos</div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/gerenciar-clientes">
            <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gerenciar Clientes</h3>
              <p className="text-gray-600 text-sm">Cadastre e gerencie instituições de ensino</p>
            </a>
          </Link>

          <Link href="/admin/criador-projeto-melhorado">
            <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Criar Projeto</h3>
              <p className="text-gray-600 text-sm">Desenvolva novos projetos pedagógicos</p>
            </a>
          </Link>

          <Link href="/admin/projetos-pedagogicos">
            <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Projetos Pedagógicos</h3>
              <p className="text-gray-600 text-sm">Visualize todos os projetos criados</p>
            </a>
          </Link>

          <Link href="/admin/rotas-estudos">
            <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rotas de Estudos</h3>
              <p className="text-gray-600 text-sm">Gerencie sequências de aprendizado</p>
            </a>
          </Link>

          <Link href="/admin/associar-rotas-clientes">
            <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-[#00979D] rounded-lg flex items-center justify-center text-2xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Associar Rotas</h3>
              <p className="text-gray-600 text-sm">Vincule rotas aos clientes</p>
            </a>
          </Link>

          <Link href="/home-oficina-clean">
            <a className="block bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-8 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center text-2xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Voltar ao Site</h3>
              <p className="text-gray-600 text-sm">Retornar à página principal</p>
            </a>
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-[#00979D] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Sistema de Gestão Educacional</h3>
          <p className="max-w-2xl mx-auto">
            Gerencie clientes, projetos pedagógicos e rotas de aprendizado de forma centralizada e eficiente.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminHome;
