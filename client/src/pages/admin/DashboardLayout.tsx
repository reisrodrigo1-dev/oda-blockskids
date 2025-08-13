        <Link href="/admin/criar-projeto">
          <a className="block text-white hover:text-blue-400">Criar Projeto Avançado</a>
        </Link>

import React from "react";
import { Link } from "wouter";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
    <aside className="w-72 bg-gray-900 p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-8">Admin</h2>
      <nav className="flex-1 space-y-4">
        <Link href="/admin/dashboard">
          <a className="block text-white hover:text-blue-400 font-medium">Dashboard</a>
        </Link>
        <Link href="/admin/criador-projeto-melhorado">
          <a className="block text-white hover:text-blue-400">Criar Projeto Melhorado</a>
        </Link>
        <Link href="/admin/clientes">
          <a className="block text-white hover:text-blue-400">Clientes</a>
        </Link>
        <Link href="/admin/rotas-estudos">
          <a className="block text-white hover:text-blue-400">Rotas de Estudos</a>
        </Link>
        <Link href="/admin/associar-rotas-clientes">
          <a className="block text-white hover:text-blue-400">Associar Rotas a Clientes</a>
        </Link>
        {/* Adicione outros links do admin aqui */}
      </nav>
      <div className="mt-auto pt-8">
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/admin/login";
          }}
        >
          Sair
        </button>
      </div>
    </aside>
    {/* Main content */}
    <main className="flex-1 p-8 overflow-y-auto">
      {children}
    </main>
  </div>
);

export default DashboardLayout;
