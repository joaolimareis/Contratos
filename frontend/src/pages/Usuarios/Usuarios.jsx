import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Usuarios.css";

function Usuarios() {
  const navigate = useNavigate();

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

  // Carregar usuários
  async function loadUsuarios() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/usuarios");
    //   console.log("Resposta da API:", response.data);

      setUsuarios(response.data.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erro ao carregar usuários."
      );
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
    setSenha(""); // senha não vem do backend normalmente
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
        // Atualizar
        const payload = { email };
        if (senha.trim() !== "") {
          payload.senha = senha;
        }
        await api.put(`/usuarios/${currentId}`, payload);
        setSuccess("Usuário atualizado com sucesso!");
      } else {
        // Criar
        await api.post("/usuarios", { email, senha });
        setSuccess("Usuário criado com sucesso!");
      }

      closeModal();
      loadUsuarios();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erro ao salvar usuário."
      );
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
      setError(
        err.response?.data?.message ||
        "Erro ao excluir usuário."
      );
    }
  }

  function handleLogout() {
    navigate("/");
  }

  return (
    <div className="usuarios-page min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold mb-0">Meu Sistema</span>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Usuários</h2>
            <p className="text-muted mb-0">Gerencie os usuários do sistema</p>
          </div>

          <button className="btn btn-primary" onClick={openCreateModal}>
            + Novo Usuário
          </button>
        </div>

        {/* Alertas */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess("")}
            ></button>
          </div>
        )}

        {/* Tabela */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4">ID</th>
                      <th scope="col">E-mail</th>
                      <th scope="col" className="text-end pe-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td className="ps-4">{usuario.id}</td>
                        <td>{usuario.email}</td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => openEditModal(usuario)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(usuario.id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? "Editar Usuário" : "Novo Usuário"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={formLoading}
                      placeholder="usuario@email.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Senha {isEditing && <small className="text-muted">(deixe em branco para não alterar)</small>}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required={!isEditing}
                      disabled={formLoading}
                      placeholder={isEditing ? "Nova senha (opcional)" : "Digite a senha"}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
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
        </div>
      )}
    </div>
  );
}

export default Usuarios;