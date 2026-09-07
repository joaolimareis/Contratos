import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Usuarios.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function loadUsuarios() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  function resetForm() {
    setEmail("");
    setSenha("");
    setCurrentId(null);
    setFieldErrors({});
  }

  function openCreateModal() {
    setIsEditing(false);
    resetForm();
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function openEditModal(usuario) {
    setIsEditing(true);
    setCurrentId(usuario.id);
    setEmail(usuario.email || "");
    setSenha("");
    setFieldErrors({});
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    const errors = {};

    if (!email.trim()) {
      errors.email = "Informe o e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "E-mail inválido.";
    }

    if (!isEditing && !senha.trim()) {
      errors.senha = "Informe a senha.";
    } else if (senha.trim() && senha.trim().length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const payload = { email: email.trim() };
        if (senha.trim()) payload.senha = senha.trim();
        await api.put(`/usuarios/${currentId}`, payload);
        setSuccess("Usuário atualizado com sucesso.");
      } else {
        await api.post("/usuarios", {
          email: email.trim(),
          senha: senha.trim(),
        });
        setSuccess("Usuário criado com sucesso.");
      }
      closeModal();
      loadUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar o usuário.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await api.delete(`/usuarios/${id}`);
      setSuccess("Usuário excluído com sucesso.");
      loadUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir o usuário.");
    }
  }

  return (
    <div className="usuarios-page">
      <header className="page-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie os usuários do sistema</p>
        </div>
        <button className="page-header-action" onClick={openCreateModal}>
          + Novo Usuário
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Fechar">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} aria-label="Fechar">
            ×
          </button>
        </div>
      )}

      <div className="content-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "2.5rem 1.5rem" }}>
            <div className="skeleton" style={{ height: 18, width: "40%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: "55%", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: "65%" }} />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="7" r="3.5" />
              <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
              <circle cx="17" cy="8" r="2.5" />
              <path d="M22 20c0-2.5-1.8-4.5-4.5-5" />
            </svg>
            <h3>Nenhum usuário cadastrado</h3>
            <p>Clique em “Novo Usuário” para começar.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.4rem" }}>ID</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td style={{ paddingLeft: "1.4rem", color: "var(--text-muted)" }}>
                      {usuario.id}
                    </td>
                    <td>{usuario.email}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-table" onClick={() => openEditModal(usuario)}>
                          Editar
                        </button>
                        <button
                          className="btn-table danger"
                          onClick={() => handleDelete(usuario.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? "Editar Usuário" : "Novo Usuário"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Fechar">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>E-mail *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    disabled={formLoading}
                    placeholder="usuario@email.com"
                    className={fieldErrors.email ? "has-error" : ""}
                  />
                  {fieldErrors.email && (
                    <span className="form-error-msg">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Senha {isEditing && <span className="label-hint">(deixe em branco para não alterar)</span>}
                    {!isEditing && " *"}
                  </label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      if (fieldErrors.senha) {
                        setFieldErrors((prev) => ({ ...prev, senha: "" }));
                      }
                    }}
                    disabled={formLoading}
                    placeholder={isEditing ? "Nova senha (opcional)" : "Digite a senha"}
                    className={fieldErrors.senha ? "has-error" : ""}
                  />
                  {fieldErrors.senha && (
                    <span className="form-error-msg">{fieldErrors.senha}</span>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading
                    ? "Salvando..."
                    : isEditing
                    ? "Salvar alterações"
                    : "Criar usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;