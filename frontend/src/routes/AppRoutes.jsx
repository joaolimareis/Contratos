import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Usuarios from "../pages/Usuarios/Usuarios";
import Locador from "../pages/Locador/Locador";
import Locatarios from "../pages/Locatarios/Locatarios";
import Imoveis from "../pages/Imoveis/Imoveis";
import Contratos from "../pages/Contratos/Contratos";
import Recebimentos from "../pages/Recebimentos/Recebimentos";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../componentes/Layout/Layout.jsx"; // ← adicione isto

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login fica fora do Layout */}
        <Route path="/" element={<Login />} />

        {/* Todas as rotas protegidas usam o Layout (com Navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/locador" element={<Locador />} />
            <Route path="/locatarios" element={<Locatarios />} />
            <Route path="/imoveis" element={<Imoveis />} />
            <Route path="/contratos" element={<Contratos />} />
            <Route path="/recebimentos" element={<Recebimentos />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;