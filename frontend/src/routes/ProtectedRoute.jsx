import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <p>Verificando autenticação...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;