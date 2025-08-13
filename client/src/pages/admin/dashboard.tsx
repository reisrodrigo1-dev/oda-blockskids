import React from "react";
import { Link } from "wouter";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";

const AdminDashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard Administrativo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card: Criar Projeto Melhorado */}
          <Link href="/admin/criador-projeto-melhorado">
            <a className="block bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg hover:bg-gray-700 transition-all">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <span>✨</span> Criar Projeto Melhorado
              </h2>
              <p className="text-gray-300">Crie projetos pedagógicos avançados, com etapas, objetivos e recursos visuais.</p>
            </a>
          </Link>
          {/* Outros cards de funcionalidades administrativas podem ser adicionados aqui */}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
