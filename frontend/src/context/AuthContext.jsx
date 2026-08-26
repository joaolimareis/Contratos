import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  async function verificarUsuario() {
    try {
      const response = await api.get("/me");

      setUsuario(response.data.usuario);

    } catch (error) {
      setUsuario(null);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verificarUsuario();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        verificarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}