import React, { useState } from 'react';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ExternalLink, Search, Globe, Tag } from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  icon: string;
}

const allLinks: LinkItem[] = [
  // Dashboard e Admin
  { id: '1', title: 'Dashboard Admin', url: '/admin', category: 'Admin', description: 'Painel administrativo principal', icon: '🏠' },
  { id: '2', title: 'Login Admin', url: '/admin/login', category: 'Admin', description: 'Login administrativo', icon: '🔐' },
  { id: '3', title: 'Cadastro Admin', url: '/admin/cadastro', category: 'Admin', description: 'Cadastro de novos admins', icon: '📝' },

  // Gestão de Clientes
  { id: '4', title: 'Cadastrar Cliente', url: '/admin/cadastrar-cliente-novo', category: 'Clientes', description: 'Cadastro de novo cliente', icon: '🏢' },
  { id: '5', title: 'Gerenciar Clientes', url: '/admin/gerenciar-clientes', category: 'Clientes', description: 'Lista e gerenciamento de clientes', icon: '👥' },
  { id: '6', title: 'Clientes', url: '/admin/clientes', category: 'Clientes', description: 'Visualização de clientes', icon: '📋' },

  // Rotas de Estudo
  { id: '7', title: 'Rotas de Estudos', url: '/admin/rotas-estudos', category: 'Rotas', description: 'Gerenciar rotas de aprendizado', icon: '🗺️' },
  { id: '8', title: 'Associar Rotas', url: '/admin/associar-rotas-clientes', category: 'Rotas', description: 'Vincular rotas aos clientes', icon: '🔗' },

  // Projetos Pedagógicos
  { id: '9', title: 'Criar Projeto', url: '/admin/criador-projeto-melhorado', category: 'Projetos', description: 'Criar novo projeto pedagógico', icon: '✨' },
  { id: '10', title: 'Projetos Pedagógicos', url: '/admin/projetos-pedagogicos', category: 'Projetos', description: 'Lista de projetos pedagógicos', icon: '📚' },
  { id: '11', title: 'Projetos Avançados', url: '/admin/projetos-avancados', category: 'Projetos', description: 'Projetos avançados', icon: '🚀' },

  // Cursos e Aulas
  { id: '12', title: 'Cadastro de Aulas', url: '/admin/cadastro-aulas', category: 'Cursos', description: 'Cadastrar novas aulas', icon: '🎓' },
  { id: '13', title: 'Criar Curso', url: '/admin/criar-curso', category: 'Cursos', description: 'Criar cursos para professores', icon: '📖' },

  // Área do Professor
  { id: '14', title: 'Login Professor', url: '/professor/login', category: 'Professor', description: 'Login para professores', icon: '👨‍🏫' },
  { id: '15', title: 'Dashboard Professor', url: '/professor/dashboard', category: 'Professor', description: 'Painel do professor', icon: '📊' },
  { id: '16', title: 'Cursos Professor', url: '/professor/cursos', category: 'Professor', description: 'Cursos do professor', icon: '📖' },
  { id: '17', title: 'Perfil Professor', url: '/professor/perfil', category: 'Professor', description: 'Perfil do professor', icon: '👤' },
  { id: '18', title: 'Projetos Professor', url: '/professor/projetos', category: 'Professor', description: 'Projetos do professor', icon: '📁' },

  // Área do Cliente (Responsável)
  { id: '19', title: 'Login Cliente', url: '/cliente/login', category: 'Cliente', description: 'Login para responsáveis de clientes', icon: '👔' },
  { id: '20', title: 'Dashboard Cliente', url: '/cliente/dashboard', category: 'Cliente', description: 'Painel do responsável', icon: '📊' },
  { id: '21', title: 'Minha Conta', url: '/cliente/conta', category: 'Cliente', description: 'Informações da conta do cliente', icon: '👤' },
  { id: '22', title: 'Professores', url: '/cliente/professores', category: 'Cliente', description: 'Lista de professores do cliente', icon: '👨‍🏫' },
  { id: '23', title: 'Projetos e Aulas', url: '/cliente/projetos-aulas', category: 'Cliente', description: 'Cursos e aulas disponíveis', icon: '📚' },

  // Área do Aluno
  { id: '24', title: 'Login Aluno', url: '/login-aluno', category: 'Aluno', description: 'Login para alunos', icon: '🎒' },
  { id: '25', title: 'Dashboard Aluno', url: '/aluno/dashboard', category: 'Aluno', description: 'Painel do aluno', icon: '📚' },

  // Páginas Públicas
  { id: '26', title: 'Home Principal', url: '/', category: 'Público', description: 'Página inicial', icon: '🏠' },
  { id: '27', title: 'Home Oficina', url: '/home-oficina-clean', category: 'Público', description: 'Home da Oficina do Amanhã', icon: '🌐' },
  { id: '28', title: 'Editor Offline', url: '/editor-offline', category: 'Público', description: 'Editor de blocos offline', icon: '🔧' },
  { id: '29', title: 'Projeto Pedagógico', url: '/projeto-pedagogico', category: 'Público', description: 'Visualizar projeto pedagógico', icon: '📖' },

  // Projetos Temáticos
  { id: '30', title: 'Robô Marciano', url: '/robo-marciano', category: 'Projetos Temáticos', description: 'Projeto Robô Marciano', icon: '🤖' },
  { id: '31', title: 'Robôs por Humanos', url: '/robos-por-humanos', category: 'Projetos Temáticos', description: 'Projeto Robôs por Humanos', icon: '🦾' },
  { id: '32', title: 'Cidade Inteligente', url: '/cidade-inteligente', category: 'Projetos Temáticos', description: 'Projeto Cidade Inteligente', icon: '🏙️' },
  { id: '33', title: 'Agronomia Sustentável', url: '/agronomia-sustentavel', category: 'Projetos Temáticos', description: 'Projeto Agronomia Sustentável', icon: '🌱' },
  { id: '34', title: 'Energias Sustentáveis', url: '/energias-sustentaveis', category: 'Projetos Temáticos', description: 'Projeto Energias Sustentáveis', icon: '⚡' },
  { id: '35', title: 'Exploração Espacial', url: '/exploracao-espacial', category: 'Projetos Temáticos', description: 'Projeto Exploração Espacial', icon: '🚀' },
  { id: '36', title: 'Projeto Final Espacial', url: '/projeto-final-espacial', category: 'Projetos Temáticos', description: 'Projeto final sobre espaço', icon: '🌌' },

  // Criadores e Ferramentas
  { id: '37', title: 'Criador Projetos AI', url: '/criador-projetos-ai', category: 'Ferramentas', description: 'Criar projetos com IA', icon: '🤖' },
  { id: '38', title: 'Criador Projeto Pedagógico', url: '/criador-projeto-pedagogico', category: 'Ferramentas', description: 'Criador de projetos pedagógicos', icon: '✏️' },
  { id: '39', title: 'Criador Projeto Avançado', url: '/criador-projeto-avancado', category: 'Ferramentas', description: 'Criador de projetos avançados', icon: '🎯' },
  { id: '40', title: 'Criador Projeto Melhorado', url: '/criador-projeto-melhorado', category: 'Ferramentas', description: 'Versão melhorada do criador', icon: '⭐' },

  // Visualização de Projetos
  { id: '41', title: 'Projetos Pedagógicos', url: '/projetos-pedagogicos', category: 'Visualização', description: 'Lista de projetos pedagógicos', icon: '📚' },
  { id: '42', title: 'Projetos Avançados', url: '/projetos-avancados', category: 'Visualização', description: 'Lista de projetos avançados', icon: '🎓' },

  // Debug e Desenvolvimento
  { id: '43', title: 'Debug Rotas', url: '/debug-rotas', category: 'Debug', description: 'Debugar rotas do sistema', icon: '🐛' },
];

export default function LinksImportantes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Obter categorias únicas
  const categories = ['Todos', ...Array.from(new Set(allLinks.map(link => link.category)))];

  // Filtrar links
  const filteredLinks = allLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Agrupar links por categoria
  const linksByCategory = filteredLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, LinkItem[]>);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-3xl">🔗</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Links Importantes</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acesso rápido a todas as páginas e funcionalidades do sistema
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{allLinks.length}</div>
            <div className="text-sm text-gray-600">Total de Links</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📁</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categorias</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{filteredLinks.length}</div>
            <div className="text-sm text-gray-600">Links Filtrados</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{selectedCategory === 'Todos' ? 'Todas' : selectedCategory}</div>
            <div className="text-sm text-gray-600">Categoria Ativa</div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campo de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por título, descrição ou URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro de categoria */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'bg-[#00979D] hover:bg-[#007a85]' : ''}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links agrupados por categoria */}
        <div className="space-y-6">
          {selectedCategory === 'Todos' ? (
            // Mostrar todas as categorias
            Object.entries(linksByCategory).map(([category, links]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#00979D]" />
                    {category}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({links.length} {links.length === 1 ? 'link' : 'links'})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.map(link => (
                      <button
                        key={link.id}
                        onClick={() => openLink(link.url)}
                        className="text-left bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-4 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl flex-shrink-0">{link.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{link.title}</h4>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#00979D] flex-shrink-0" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{link.description}</p>
                            <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded block truncate">
                              {link.url}
                            </code>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Mostrar apenas a categoria selecionada
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#00979D]" />
                  {selectedCategory}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLinks.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum link encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLinks.map(link => (
                      <button
                        key={link.id}
                        onClick={() => openLink(link.url)}
                        className="text-left bg-white border border-gray-200 hover:border-[#00979D] rounded-lg p-4 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl flex-shrink-0">{link.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{link.title}</h4>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#00979D] flex-shrink-0" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{link.description}</p>
                            <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded block truncate">
                              {link.url}
                            </code>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-[#00979D] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Central de Links</h3>
          <p className="max-w-2xl mx-auto">
            Todos os links do sistema organizados por categoria para facilitar o acesso. Clique em qualquer link para abrir em uma nova aba.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}