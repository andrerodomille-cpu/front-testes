import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";


/* Genérico */
import Home from "../scenes/home/home";
import NaoAutorizado from "./NaoAutorizado";
import NaoEncontrada from "./NaoEncontrada";
import BlankLayout from "@/scenes/home/blankLayout";


/* Login */
import CriarSenha from "@/scenes/login/criarSenha";
import AlterarSenha from "@/scenes/login/alterarSenha";
import NumeroCasPage from "@/pages/NumeroCasPage";
import CidadePage from "@/pages/CidadePage";

/* Rotas IA */
import AnaliseOperadoresPage from "@/pages/AnaliseOperadoresPage";
import DashboardRiscoOperacional from "@/scenes/riscos-operacionais/dashboardRiscoOperacional";
import AnaliseOperadoresDashboard from "@/scenes/analise-operadores/components/analise-operadores-dashboard";

function AppRouter(): JSX.Element {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NaoEncontrada />} />
      <Route path="/nao-autorizado" element={<NaoAutorizado />} />
      <Route path="/criar-senha" element={<CriarSenha />} />
      <Route path="/alterar-senha" element={<AlterarSenha />} />
      
      <Route path="/numerocas" element={<NumeroCasPage />} />
      <Route path="/cidades" element={<CidadePage />} />
      

      <Route path="/analise-operadores" element={<AnaliseOperadoresPage />} />
      <Route path="/risco-operacional" element={<DashboardRiscoOperacional />} />
      <Route path="/risco-operacional-avancado" element={<AnaliseOperadoresDashboard />} />

    </Routes>
  );
}

export default AppRouter;
