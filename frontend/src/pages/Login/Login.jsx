import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
const backgroundImages = [
  "/imagens/predio1.jpg", // a primeira foto
  "/imagens/predio2.jpg", // a segunda foto
  "/imagens/predio3.jpg", // a terceira foto
  "/imagens/predio4.jpg", // a quarta foto
  "/imagens/predio5.jpg", // a quinta foto

];
function Login() {
   const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Carrossel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // troca a cada 6 segundos

    return () => clearInterval(interval);
  }, []);

async function handleSubmit(e) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    await login(email, password);

    navigate("/dashboard");
  } catch (err) {
    console.error("ERRO NO LOGIN:", err);

    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (status === 401) {
      setError(message || "E-mail ou senha inválidos.");
    } else if (status === 400) {
      setError(message || "E-mail e senha são obrigatórios.");
    } else if (status >= 500) {
      setError(
        "Erro interno do servidor. Tente novamente mais tarde."
      );
    } else if (err.request) {
      setError(
        "Não foi possível conectar ao servidor."
      );
    } else {
      setError(
        "Ocorreu um erro ao fazer login."
      );
    }
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="login-page">
      {/* ===== Background Carousel ===== */}
      <div className="login-bg">
        {backgroundImages.map((src, index) => (
          <div
            key={index}
            className={`login-bg-slide ${index === currentImage ? "active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="login-bg-overlay" />
      </div>

      {/* ===== Formulário ===== */}
      <div className="login-form-wrapper">
        <div className="login-card">
          <div className="login-header">
          <div className="brand-icon">
  <img src="/logo-J.svg" alt="Contratos" className="logo-img" />
</div>
            <h1>Bem-vindo</h1>
            <p>Acesse o sistema de gestão de contratos</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
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
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
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