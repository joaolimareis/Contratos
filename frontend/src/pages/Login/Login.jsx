import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import "./Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        senha: password,
      });

      const me = await api.get("/me");
      console.log("USUÁRIO AUTENTICADO:", me.data);

      navigate("/dashboard");
    } catch (error) {
      console.error("ERRO COMPLETO:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Erro ao fazer login. Verifique seus dados."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
            <div className="card login-card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                {/* Título */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1">Bem-vindo</h2>
                  <p className="text-muted mb-0">Faça login para continuar</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* E-mail */}
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                    <label htmlFor="email">E-mail</label>
                  </div>

                  {/* Senha */}
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <label htmlFor="password">Senha</label>
                  </div>

                  {/* Mensagem de erro */}
                  {error && (
                    <div className="alert alert-danger py-2 small mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Botão */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Rodapé opcional */}
            <p className="text-center text-muted small mt-4 mb-0">
              © {new Date().getFullYear()} Seu Sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;