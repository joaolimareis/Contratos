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
import ProtectedRoute from "./ProtectedRoute";
import Recebimentos from "../pages/Recebimentos/Recebimentos";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/locador" element={<Locador />} />
          <Route path="/locatarios" element={<Locatarios />} /> 
          <Route path="/imoveis" element={<Imoveis />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/recebimentos" element={<Recebimentos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;