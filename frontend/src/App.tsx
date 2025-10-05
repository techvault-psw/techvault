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
import ReservasClientePage from "./pages/reservas-cliente";
import ConfirmarReservaPage from "./pages/confirmar-reserva";
import ClientesPage from "./pages/clientes";
import InformacoesReservasPage from "./pages/informacoes-reserva";
import EnderecosClientePage from "./pages/enderecos-cliente";
import ReservasPage from "./pages/reservas";
import ReservaConfirmadaPage from "./pages/reserva-confirmada";
import PerfilPage from "./pages/perfil";
import Pacotes from "./pages/pacotes";
import FeedbacksPage from "./pages/feedbacks";
import { fetchReservas } from "./redux/reservas/fetch";
import store from './redux/store.ts'

store.dispatch(fetchReservas());

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<MainLayout />}>
        <Route path="/pacotes-disponiveis" element={<PacotesDisponiveisPage />} />
        <Route path="/minhas-reservas" element={<MinhasReservasPage/>}/>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/informacoes-pacote/:id" element={<InformacoesPacotePage />} />
        <Route path="/confirmar-reserva/:id" element={<ConfirmarReservaPage/>}/>
        <Route path="/pagamento" element={<PagamentoReservaPage/>}/>
        <Route path="/reservas-cliente/:id" element={<ReservasClientePage/>}/>
        <Route path="/reservas" element={<ReservasPage/>}/> 
        <Route path="/clientes" element={<ClientesPage/>}/>
        <Route path="/informacoes-reserva/:id" element={<InformacoesReservasPage />}/>
        <Route path="/enderecos-cliente/:id" element={<EnderecosClientePage/>}/>
        <Route path="/pagamento/:id" element={<PagamentoReservaPage/>}/>
        <Route path="/reserva-confirmada/:id" element={<ReservaConfirmadaPage/>}/>
        <Route path="/perfil" element={<PerfilPage/>}/>
        <Route path="/pacotes" element={<Pacotes/>}/>
        <Route path="/feedbacks" element={<FeedbacksPage/>}/>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
      </Route>
    </Routes>
  );
}
