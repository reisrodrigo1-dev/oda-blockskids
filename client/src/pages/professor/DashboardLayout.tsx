import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';
import { Button } from '../../components/ui/button';
import {
  GraduationCap,
  BookOpen,
  User,
  LogOut,
  Building2,
  Menu,
  X,
  FileText,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function ProfessorDashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { professor, cliente, logout } = useProfessorAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation('/professor/login');
  };

  const menuItems = [
    { icon: GraduationCap, label: 'Dashboard', path: '/professor/dashboard' },
    { icon: BookOpen, label: 'Meus Projetos', path: '/professor/cursos' },
    { icon: FileText, label: 'Documentos', path: '/professor/documentos' },
    { icon: User, label: 'Meu Perfil', path: '/professor/perfil' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00979D] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Professor</h2>
                  <p className="text-xs text-gray-500">Portal de Ensino</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Professor Info */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#00979D]/10 to-[#007a85]/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#00979D] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {professor?.nome}
                </p>
                <p className="text-xs text-gray-600 truncate">{professor?.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-[#00979D]" />
                  <p className="text-xs text-gray-600 truncate">
                    {cliente?.nomeFantasia || cliente?.razaoSocial}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setLocation(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#00979D] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#00979D]" />
              <span className="font-semibold text-gray-900">Portal do Professor</span>
            </div>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
