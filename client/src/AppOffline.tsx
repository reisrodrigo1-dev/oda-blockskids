import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import EditorOffline from "@/pages/editor-offline";
import ProjetoPedagogico from "@/pages/projeto-pedagogico";
import RoboMarciano from "@/pages/robo-marciano";
import RobosPorHumanos from "@/pages/robos-por-humanos";
import CidadeInteligente from "@/pages/cidade-inteligente";
import AgronomiaSupply from "@/pages/agronomia-sustentavel";
import EnergiasSustentaveis from "@/pages/energias-sustentaveis";
import ExploracaoEspacial from "@/pages/exploracao-espacial";
import ProjetoFinalEspacial from "@/pages/projeto-final-espacial";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/editor-offline" component={EditorOffline} />
      <Route path="/projeto-pedagogico" component={ProjetoPedagogico} />
      <Route path="/robo-marciano" component={RoboMarciano} />
      <Route path="/robos-por-humanos" component={RobosPorHumanos} />
      <Route path="/cidade-inteligente" component={CidadeInteligente} />
      <Route path="/agronomia-sustentavel" component={AgronomiaSupply} />
      <Route path="/energias-sustentaveis" component={EnergiasSustentaveis} />
      <Route path="/exploracao-espacial" component={ExploracaoEspacial} />
      <Route path="/projeto-final-espacial" component={ProjetoFinalEspacial} />
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
