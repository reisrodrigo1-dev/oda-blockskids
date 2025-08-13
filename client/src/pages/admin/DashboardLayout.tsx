import React from "react";
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";

const menuSections = [
  {
    title: "Gestão",
    items: [
      { label: "Clientes", icon: "👥", href: "/admin/clientes" },
      { label: "Rotas de Estudos", icon: "🗺️", href: "/admin/rotas-estudos" },
      { label: "Associação Rotas-Clientes", icon: "🔗", href: "/admin/associar-rotas-clientes" },
    ],
  },
  {
    title: "Projetos",
    items: [
      { label: "Criar Projeto", icon: "✨", href: "/admin/criar-projeto" },
      { label: "Projetos Avançados", icon: "🚀", href: "/admin/projetos-avancados" },
      { label: "Projetos Pedagógicos", icon: "📚", href: "/admin/projetos-pedagogicos" },
    ],
  },
];

const avatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=admin";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Sidebar */}
      <aside className="w-72 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col p-6 gap-8 relative z-10">
        {/* Avatar e título */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <img
            src={avatarUrl}
            alt="Admin Avatar"
            className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg mb-2 bg-white/20"
          />
          <span className="text-lg font-bold text-white tracking-wide">Admin ODA</span>
          <span className="text-xs text-gray-300 bg-black/20 px-2 py-0.5 rounded-full mt-1">Painel de Controle</span>
        </div>
        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-6">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <div className="text-xs uppercase text-gray-400 font-bold mb-2 pl-2 tracking-widest">
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
                            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 cursor-pointer",
                            active
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105 border border-white/30"
                              : "text-gray-200 hover:bg-white/10 hover:scale-105 border border-transparent"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span>{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {/* Footer */}
        <div className="mt-auto text-center text-xs text-gray-400 pt-8 border-t border-white/10">
          <span className="opacity-80">© {new Date().getFullYear()} ODA BlocksKids</span>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
 
  );
}
