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

  async function login(email, senha) {
    await api.post("/login", {
      email,
      senha,
    });

    await verificarUsuario();
  }

  async function logout() {
    try {
      await api.post("/logout");
    } finally {
      setUsuario(null);
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
        login,
        logout,
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