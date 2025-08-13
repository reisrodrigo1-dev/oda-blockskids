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
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/cadastro" component={AdminCadastro} />
      <Route path="/admin/criador-projeto-melhorado" component={CriadorProjetoMelhorado} />
      <Route path="/admin/criar-projeto" component={CriarProjeto} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin" component={AdminHome} />
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
