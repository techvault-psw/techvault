import { Route, Routes } from "react-router";
import { AuthLayout } from "./components/layouts/auth-layout";
import { MainLayout } from "./components/layouts/main-layout";
import HomePage from "./pages/home";
import PacotesDisponiveisPage from "./pages/pacotes-disponiveis";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import CadastroPage from "./pages/cadastro";
import PagamentoReservaPage from "./pages/pagamento-reserva";
import ReservasClientePage from "./pages/reservas-cliente";
import InformacoesPacotePage from "./pages/informacoes-pacote";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<MainLayout />}>
        <Route path="/pacotes-disponiveis" element={<PacotesDisponiveisPage />} />
        <Route path="/minhas-reservas" element={<ReservasClientePage/>}/>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/informacoes-pacote/:id" element={<InformacoesPacotePage />} />
        <Route path="/pagamento" element={<PagamentoReservaPage/>}/>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
      </Route>
    </Routes>
  );
}
