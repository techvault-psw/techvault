import { Route, Routes } from "react-router";
import { AuthLayout } from "./components/layouts/auth-layout";
import { MainLayout } from "./components/layouts/main-layout";
import HomePage from "./pages/home";
import PacotesDisponiveisPage from "./pages/pacotes-disponiveis";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<MainLayout />}>
        <Route path="/pacotes-disponiveis" element={<PacotesDisponiveisPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
