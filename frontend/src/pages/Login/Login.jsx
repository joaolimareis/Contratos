import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import bgImage from "../../assets/teste5.jpg"; // salve a imagem com esse nome ou ajuste o caminho
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/login", {
        email,
        senha: password,
      });

      const me = await api.get("/me");
      console.log("USUÁRIO AUTENTICADO:", me.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("ERRO COMPLETO:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 404) {
        setError(message || "Usuário não encontrado.");
      } else if (status === 401) {
        setError(message || "Email ou senha inválidos.");
      } else if (status === 400) {
        setError(message || "Dados inválidos.");
      } else if (status >= 500) {
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      } else if (err.request) {
        setError("Não foi possível conectar ao servidor.");
      } else {
        setError("Ocorreu um erro ao fazer login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Lado esquerdo - Visual */}
      <div
        className="login-visual"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="login-visual-overlay">
          <div className="login-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7v10l9 5 9-5V7l-9-5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12L3 7m9 5l9-5m-9 5v10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>Contratos</h2>
            <p>Gerenciamento de contratos imobiliários.</p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="login-form-side">
        <div className="login-form-container">
          <header className="login-header">
            <h1>Entrar</h1>
            <p>Preencha seus dados para continuar</p>
          </header>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M3.5 6.5l8.5 6 8.5-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M8 10V7a4 4 0 118 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={loading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkbox-custom" />
                <span>Lembrar de mim</span>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;