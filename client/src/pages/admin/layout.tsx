import React from "react";
import { Link } from "wouter";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 220, background: "#f3f3f3", padding: 24 }}>
        <h2>Admin</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/admin">Início</Link></li>
          <li><Link to="/admin/criador-projeto-melhorado">Criar Projeto Melhorado</Link></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: 32 }}>
        <div>Selecione uma opcao no menu administrativo.</div>
      </main>
    </div>
  );
};

export default AdminLayout;
