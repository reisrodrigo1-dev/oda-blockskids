import AdminAssociarRotasClientes from "@/pages/admin/associar-rotas-clientes";
        <Route path="/admin/associar-rotas-clientes" component={AdminAssociarRotasClientes} />
import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import EditarProjeto from "@/pages/editar-projeto";
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

function Router() {
    return (
      <Switch>
        <Route path="/admin/clientes" component={AdminClientes} />
        <Route path="/admin/editar-cliente/:id" component={AdminEditarCliente} />
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
        <Route path="/editar-projeto/:id" component={EditarProjeto} />
        <Route path="/criador-projeto-avancado" component={CriadorProjetoAvancado} />
        <Route path="/criador-projeto-melhorado" component={CriadorProjetoMelhorado} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/cadastro" component={AdminCadastro} />
        <Route path="/admin/criador-projeto-melhorado" component={AdminCriadorProjetoMelhorado} />
        <Route path="/admin/criar-projeto" component={AdminCriarProjetoAvancado} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/cadastrar-cliente" component={AdminCadastrarCliente} />
        <Route path="/admin/rotas-estudos" component={AdminRotasEstudos} />
        <Route path="/admin/associar-rotas-clientes" component={AdminAssociarRotasClientes} />
        <Route path="/admin" component={AdminHome} />
        <Route component={NotFound} />
      </Switch>
    );
}

function App() {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}

export default App;
