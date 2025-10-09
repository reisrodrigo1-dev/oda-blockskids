import AdminProjetosPedagogicos from "@/pages/admin/projetos-pedagogicos";
import AdminProjetosAvancados from "@/pages/admin/projetos-avancados";
import AdminAssociarRotasClientes from "@/pages/admin/associar-rotas-clientes";
import AdminProjetoView from "@/pages/admin/projeto";
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
import ProfessorLogin from "@/pages/professor/login";
import ProfessorCursos from "@/pages/professor/cursos";
import ProfessorPerfil from "@/pages/professor/perfil";
import AssistirAula from "@/pages/professor/assistir-aula";
import ProfessorDocumentos from "@/pages/professor/documentos";
import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ProfessorAuthProvider } from "@/contexts/ProfessorAuthContext";
import { ClienteAuthProvider } from "@/contexts/ClienteAuthContext";
import Home from "@/pages/home";
import HomeOficina from "@/pages/home-oficina-clean";
import EditorOffline from "@/pages/editor-offline";
import ProjetoPedagogico from "@/pages/projeto-pedagogico";
import RoboMarciano from "@/pages/robo-marciano";
import RobosPorHumanos from "@/pages/robos-por-humanos";
import CidadeInteligente from "@/pages/cidade-inteligente";
import AgronomiaSupply from "@/pages/agronomia-sustentavel";
import EnergiasSustentaveis from "@/pages/energias-sustentaveis";
import ExploracaoEspacial from "@/pages/exploracao-espacial";
import ProjetoFinalEspacial from "@/pages/projeto-final-espacial";
import CriadorProjetosAI from "@/pages/criador-projetos-ai";
import CriadorProjetoPedagogico from "@/pages/criador-projeto-pedagogico";
import ProjetosPedagogicos from "@/pages/projetos-pedagogicos";
import CriadorProjetoAvancado from "@/pages/criador-projeto-avancado";
import ProjetosAvancados from "@/pages/projetos-avancados";
import CriadorProjetoMelhorado from "@/pages/criador-projeto-melhorado";
import ProjetoIndividual from "@/pages/projeto-individual";
import EditarProjetoAdmin from "@/pages/admin/editar-projeto";
import ProjetoAluno from "@/pages/projeto-aluno";
import NotFound from "@/pages/not-found";
import AdminHome from "@/pages/admin";
import AdminLogin from "@/pages/admin/login";
import AdminCadastro from "@/pages/admin/cadastro";
import AdminCriadorProjetoMelhorado from "@/pages/admin/criador-projeto-melhorado";
import AdminCriarProjetoAvancado from "@/pages/admin/criar-projeto";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCadastrarCliente from "@/pages/admin/cadastrar-cliente";
import AdminRotasEstudos from "@/pages/admin/rotas-estudos";
import AdminClientes from "@/pages/admin/clientes";
import AdminEditarCliente from "@/pages/admin/editar-cliente";
import CadastroAulas from "@/pages/admin/cadastro-aulas";
import CriarCurso from "@/pages/admin/criar-curso";
import DocumentosImportantes from "@/pages/admin/documentos-importantes";
import LinksImportantes from "@/pages/admin/links-importantes";
import CadastrarClienteNovo from "@/pages/admin/cadastrar-cliente-novo";

// Cliente Pages
import ClienteLogin from "@/pages/cliente/login";
import ClienteDashboard from "@/pages/cliente/dashboard";
import ClienteConta from "@/pages/cliente/conta";
import ClienteProfessores from "@/pages/cliente/professores";
import ClienteProjetosAulas from "@/pages/cliente/projetos-aulas";

function Router() {
    return (
      <Switch>
  <Route path="/admin/clientes" component={AdminClientes} />
  <Route path="/admin/projetos-pedagogicos" component={AdminProjetosPedagogicos} />
  <Route path="/admin/projetos-avancados" component={AdminProjetosAvancados} />
  <Route path="/admin/editar-cliente/:id" component={AdminEditarCliente} />
  <Route path="/admin/editar-projeto/:id" component={EditarProjetoAdmin} />
        <Route path="/" component={HomeOficina} />
        <Route path="/home" component={Home} />
        <Route path="/editor-offline" component={EditorOffline} />
        <Route path="/projeto-pedagogico" component={ProjetoPedagogico} />
        <Route path="/robo-marciano" component={RoboMarciano} />
        <Route path="/robos-por-humanos" component={RobosPorHumanos} />
        <Route path="/cidade-inteligente" component={CidadeInteligente} />
        <Route path="/agronomia-sustentavel" component={AgronomiaSupply} />
        <Route path="/energias-sustentaveis" component={EnergiasSustentaveis} />
        <Route path="/exploracao-espacial" component={ExploracaoEspacial} />
        <Route path="/projeto-final-espacial" component={ProjetoFinalEspacial} />
        <Route path="/criador-projetos-ai" component={CriadorProjetosAI} />
        <Route path="/criador-projeto-pedagogico" component={CriadorProjetoPedagogico} />
        <Route path="/projetos-pedagogicos" component={ProjetosPedagogicos} />
        <Route path="/projetos-avancados" component={ProjetosAvancados} />
        <Route path="/projeto/:id" component={ProjetoIndividual} />
        <Route path="/projeto-aluno/:id" component={ProjetoAluno} />
        <Route path="/criador-projeto-avancado" component={CriadorProjetoAvancado} />
        <Route path="/criador-projeto-melhorado" component={CriadorProjetoMelhorado} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/cadastro" component={AdminCadastro} />
        <Route path="/admin/gerenciar-clientes" component={GerenciarClientes} />
        <Route path="/admin/cliente/:clienteId/nova-rota" component={NovaRotaEstudo} />
        <Route path="/admin/criador-projeto-melhorado" component={AdminCriadorProjetoMelhorado} />
        <Route path="/admin/criar-projeto" component={AdminCriarProjetoAvancado} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/cadastrar-cliente" component={AdminCadastrarCliente} />
        <Route path="/admin/cadastrar-cliente-novo" component={CadastrarClienteNovo} />
        <Route path="/admin/rotas-estudos" component={AdminRotasEstudos} />
        <Route path="/admin/cadastro-aulas" component={CadastroAulas} />
        <Route path="/admin/criar-curso" component={CriarCurso} />
        <Route path="/admin/documentos-importantes" component={DocumentosImportantes} />
        <Route path="/admin/links-importantes" component={LinksImportantes} />
        <Route path="/admin/associar-rotas-clientes" component={AdminAssociarRotasClientes} />
        <Route path="/admin/projeto/:id" component={AdminProjetoView} />
        <Route path="/admin/projeto-aluno/:id" component={AdminVisualizarComoAluno} />
        <Route path="/admin" component={AdminHome} />
        
        {/* Rotas de Login */}
        <Route path="/login-professor" component={LoginProfessor} />
        <Route path="/login-aluno" component={LoginAluno} />
        
        {/* Novo Sistema de Professor (Área de Cursos e Aulas) */}
        <Route path="/professor/login" component={ProfessorLogin} />
        <Route path="/professor/dashboard" component={DashboardProfessor} />
        <Route path="/professor/cursos" component={ProfessorCursos} />
        <Route path="/professor/documentos" component={ProfessorDocumentos} />
        <Route path="/professor/perfil" component={ProfessorPerfil} />
        <Route path="/professor/assistir/:cursoId/:aulaId?" component={AssistirAula} />
        
        {/* Rotas do Professor (Sistema Antigo) */}
        <Route path="/professor/cadastrar-aluno/:codigoTurma" component={CadastrarAluno} />
        <Route path="/professor/projetos" component={ProjetosProfessor} />
        <Route path="/professor/rota/:rotaId" component={RotaDetalhes} />
        
        {/* Rotas do Aluno */}
        <Route path="/aluno/dashboard" component={DashboardAluno} />
        
        {/* Rotas do Cliente (Responsável) */}
        <Route path="/cliente/login" component={ClienteLogin} />
        <Route path="/cliente/dashboard" component={ClienteDashboard} />
        <Route path="/cliente/conta" component={ClienteConta} />
        <Route path="/cliente/professores" component={ClienteProfessores} />
        <Route path="/cliente/projetos-aulas" component={ClienteProjetosAulas} />
        
        {/* Debug */}
        <Route path="/debug-rotas" component={DebugRotas} />
        
        <Route component={NotFound} />
      </Switch>
    );
}

function App() {
  return (
    <ProfessorAuthProvider>
      <ClienteAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ClienteAuthProvider>
    </ProfessorAuthProvider>
  );
}

export default App;
