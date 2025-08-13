import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";

const AdminHome = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <h1 className="text-3xl font-bold text-white mb-4">Bem-vindo ao Painel Administrativo</h1>
        <p className="text-lg text-gray-300">Selecione uma opção no menu lateral para começar.</p>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminHome;
