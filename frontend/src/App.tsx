import { Route, Routes } from "react-router";
import { AuthLayout } from "./components/layouts/auth-layout";
import { MainLayout } from "./components/layouts/main-layout";
import HomePage from "./pages/home";
import PacotesDisponiveisPage from "./pages/pacotes-disponiveis";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import CadastroPage from "./pages/cadastro";
import PagamentoReservaPage from "./pages/pagamento-reserva";
import MinhasReservasPage from "./pages/minhas-reservas";
import InformacoesPacotePage from "./pages/informacoes-pacote";
import ListarClientesPage from "./pages/listar-clientes";
import { ReservasClientePage } from "./pages/reservas-cliente";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
Estoukkkk
      <Route element={<MainLayout />}>
        <Route path="/pacotes-disponiveis" element={<PacotesDisponiveisPage />} />
        <Route path="/minhas-reservas" element={<MinhasReservasPage/>}/>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/informacoes-pacote/:id" element={<InformacoesPacotePage />} />
        <Route path="/pagamento" element={<PagamentoReservaPage/>}/>
        <Route path="/listar-clientes" element={<ListarClientesPage/>}/>
        <Route path="/reservas-cliente" element={<ReservasClientePage/>}/>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
      </Route>
    </Routes>
  );
}
