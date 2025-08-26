import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Editor from "@/pages/editor";
import ProjetoPedagogico from "@/pages/projeto-pedagogico";
import RoboMarciano from "@/pages/robo-marciano";
import RobosPorHumanos from "@/pages/robos-por-humanos";
import CidadeInteligente from "@/pages/cidade-inteligente";
import AgronomiaSupply from "@/pages/agronomia-sustentavel";
import EnergiasSustentaveis from "@/pages/energias-sustentaveis";
import NotFound from "@/pages/not-found";
import AdminHome from "@/pages/admin";
import AdminLogin from "@/pages/admin/login";
import AdminCadastro from "@/pages/admin/cadastro";
import CriadorProjetoMelhorado from "@/pages/admin/criador-projeto-melhorado";
import CriarProjeto from "@/pages/admin/criar-projeto";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjetoView from "@/pages/admin/projeto";
import EditarProjetoAdmin from "@/pages/admin/editar-projeto";
import AdminVisualizarComoAluno from "@/pages/admin/projeto-aluno";
import LoginProfessor from "@/pages/login-professor";
import DashboardProfessor from "@/pages/professor/dashboard";
import CadastrarAluno from "@/pages/professor/cadastrar-aluno";
import ProjetosProfessor from "@/pages/professor/projetos";
import LoginAluno from "@/pages/login-aluno";
import DashboardAluno from "@/pages/aluno/dashboard";
import GerenciarClientes from "@/pages/admin/gerenciar-clientes";
import NovaRotaEstudo from "@/pages/admin/nova-rota-estudo";
import DebugRotas from "@/pages/debug-rotas";
import RotaDetalhes from "@/pages/professor/rota-detalhes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/editor" component={Editor} />
      <Route path="/projeto-pedagogico" component={ProjetoPedagogico} />
      <Route path="/robo-marciano" component={RoboMarciano} />
      <Route path="/robos-por-humanos" component={RobosPorHumanos} />
      <Route path="/cidade-inteligente" component={CidadeInteligente} />
      <Route path="/agronomia-sustentavel" component={AgronomiaSupply} />
      <Route path="/energias-sustentaveis" component={EnergiasSustentaveis} />
      
      {/* Rotas de Login */}
      <Route path="/login-professor" component={LoginProfessor} />
      <Route path="/login-aluno" component={LoginAluno} />
      
      {/* Rotas do Professor */}
      <Route path="/professor/dashboard" component={DashboardProfessor} />
      <Route path="/professor/cadastrar-aluno/:codigoTurma" component={CadastrarAluno} />
      <Route path="/professor/projetos" component={ProjetosProfessor} />
      <Route path="/professor/rota/:rotaId" component={RotaDetalhes} />
      
      {/* Rotas do Aluno */}
      <Route path="/aluno/dashboard" component={DashboardAluno} />
      
      {/* Rotas Admin */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/cadastro" component={AdminCadastro} />
      <Route path="/admin/gerenciar-clientes" component={GerenciarClientes} />
      <Route path="/admin/cliente/:clienteId/nova-rota" component={NovaRotaEstudo} />
      <Route path="/admin/criador-projeto-melhorado" component={CriadorProjetoMelhorado} />
      <Route path="/admin/criar-projeto" component={CriarProjeto} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
  <Route path="/admin/projeto/:id" component={AdminProjetoView} />
  <Route path="/admin/editar-projeto/:id" component={EditarProjetoAdmin} />
      <Route path="/admin/projeto-aluno/:id" component={AdminVisualizarComoAluno} />
      <Route path="/admin" component={AdminHome} />
      
      {/* Debug */}
      <Route path="/debug-rotas" component={DebugRotas} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
