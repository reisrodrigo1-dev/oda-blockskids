import React from "react";
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import logoOdA from "../../assets/logo-OdA.png";

const menuSections = [
  {
    title: "Dashboard",
    items: [
      { label: "Início", icon: "🏠", href: "/admin" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { label: "Cadastrar Cliente", icon: "🏢", href: "/admin/cadastrar-cliente-novo" },
      { label: "Gerenciar Clientes", icon: "👥", href: "/admin/gerenciar-clientes" },
      { label: "Rotas de Estudos", icon: "🗺️", href: "/admin/rotas-estudos" },
      { label: "Associar Rotas", icon: "🔗", href: "/admin/associar-rotas-clientes" },
    ],
  },
  {
    title: "Geral",
    items: [
      { label: "Links Importantes", icon: "🌐", href: "/admin/links-importantes" },
      { label: "Documentos Importantes", icon: "📄", href: "/admin/documentos-importantes" },
    ],
  },
  {
    title: "Projetos",
    items: [
      { label: "Criar Projeto", icon: "✨", href: "/admin/criador-projeto-melhorado" },
      { label: "Projetos Pedagógicos", icon: "📚", href: "/admin/projetos-pedagogicos" },
      { label: "Cadastro de Aulas", icon: "🎓", href: "/admin/cadastro-aulas" },
      { label: "Criar Curso (Professor)", icon: "📖", href: "/admin/criar-curso" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar - Arduino Style */}
      <aside className="w-72 min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header com Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <img src={logoOdA} alt="ODA Logo" className="w-12 h-12 object-contain" />
            <div>
              <span className="text-xl font-bold text-gray-900 block">ODA Admin</span>
              <span className="text-xs text-gray-500">Painel Administrativo</span>
            </div>
          </div>
        </div>
        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3 tracking-wide">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
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
          ))}
          
          {/* Links adicionais */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href="/home-oficina-clean"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-[#00979D] transition-all duration-200"
            >
              <span className="text-lg">🌐</span>
              <span>Voltar ao Site</span>
            </a>
            <a
              href="/admin/login"
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all duration-200 mt-1"
            >
              <span className="text-lg">🚪</span>
              <span>Sair</span>
            </a>
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
