import React from "react";
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import { useClienteAuth } from "../../contexts/ClienteAuthContext";
import logoOdA from "../../assets/logo-OdA.png";

const menuItems = [
  { label: "Dashboard", icon: "📊", href: "/cliente/dashboard" },
  { label: "Minha Conta", icon: "🏢", href: "/cliente/conta" },
  { label: "Professores", icon: "👨‍🏫", href: "/cliente/professores" },
  { label: "Projetos e Aulas", icon: "📚", href: "/cliente/projetos-aulas" },
];

export default function ClienteDashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { cliente, logout } = useClienteAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/cliente/login');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-72 min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header com Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <img src={logoOdA} alt="ODA Logo" className="w-12 h-12 object-contain" />
            <div>
              <span className="text-xl font-bold text-gray-900 block">Área do Cliente</span>
              <span className="text-xs text-gray-500">Painel de Controle</span>
            </div>
          </div>
          
          {/* Cliente Info */}
          {cliente && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-[#00979D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {cliente.razaoSocial.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {cliente.razaoSocial}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {cliente.nomeResponsavel}
                  </p>
                  <span className={cn(
                    "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
                    cliente.tipo === 'prefeitura' 
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  )}>
                    {cliente.tipo === 'prefeitura' ? '🏛️ Prefeitura' : '🏭 Empresa'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-2">
            <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3 tracking-wide">
              Menu Principal
            </div>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const active = location === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer",
                          active
                            ? "bg-[#00979D] text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-[#00979D]"
                        )}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Links adicionais */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all duration-200 w-full"
            >
              <span className="text-lg">🚪</span>
              <span>Sair</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Oficina do Amanhã</span>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-white overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
