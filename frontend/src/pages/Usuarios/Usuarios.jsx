import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Usuarios.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function loadUsuarios() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  function openCreateModal() {
    setIsEditing(false);
    setCurrentId(null);
    setEmail("");
    setSenha("");
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function openEditModal(usuario) {
    setIsEditing(true);
    setCurrentId(usuario.id);
    setEmail(usuario.email || "");
    setSenha("");
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function closeModal() {
    setShowModal(false);
    setEmail("");
    setSenha("");
    setCurrentId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        const payload = { email };
        if (senha.trim() !== "") {
          payload.senha = senha;
        }
        await api.put(`/usuarios/${currentId}`, payload);
        setSuccess("Usuário atualizado com sucesso!");
      } else {
        await api.post("/usuarios", { email, senha });
        setSuccess("Usuário criado com sucesso!");
      }
      closeModal();
      loadUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar usuário.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }
    try {
      await api.delete(`/usuarios/${id}`);
      setSuccess("Usuário excluído com sucesso!");
      loadUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir usuário.");
    }
  }

  return (
    <div className="usuarios-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie os usuários do sistema</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          + Novo Usuário
        </button>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button className="alert-close" onClick={() => setSuccess("")}>
            ×
          </button>
        </div>
      )}

      {/* Tabela */}
      <div className="table-card">
        {loading ? (
          <div className="table-empty">
            <div className="spinner" />
            <span>Carregando...</span>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="table-empty">
            <span>Nenhum usuário encontrado.</span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>E-mail</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="id-cell">{usuario.id}</td>
                    <td>{usuario.email}</td>
                    <td className="text-right">
                      <div className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => openEditModal(usuario)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
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

      {/* Modal */}

{showModal && (
  <div className="app-modal-overlay" onClick={closeModal}>
    <div className="app-modal" onClick={(e) => e.stopPropagation()}>
      <div className="app-modal-header">
        <h2>{isEditing ? "Editar Usuário" : "Novo Usuário"}</h2>
        <button type="button" className="app-modal-close" onClick={closeModal}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="app-modal-body">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={formLoading}
              placeholder="usuario@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              Senha{" "}
              {isEditing && (
                <span className="label-hint">(deixe em branco para não alterar)</span>
              )}
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required={!isEditing}
              disabled={formLoading}
              placeholder={isEditing ? "Nova senha (opcional)" : "Digite a senha"}
            />
          </div>
        </div>

        <div className="app-modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={closeModal}
            disabled={formLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={formLoading}
          >
            {formLoading ? (
              <>
                <span className="spinner-sm" />
                Salvando...
              </>
            ) : isEditing ? (
              "Salvar Alterações"
            ) : (
              "Criar Usuário"
            )}
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