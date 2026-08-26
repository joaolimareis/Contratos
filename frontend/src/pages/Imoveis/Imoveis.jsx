import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Imoveis.css";

function Imoveis() {
  const navigate = useNavigate();

  const [imoveis, setImoveis] = useState([]);
  const [locadores, setLocadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Campos do formulário (conforme o model)
  const [locador_id, setLocadorId] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [status, setStatus] = useState(true);

  async function loadImoveis() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/imoveis");
      setImoveis(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar imóveis.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLocadores() {
    try {
      const response = await api.get("/locador");
      setLocadores(response.data.data || response.data);
    } catch (err) {
      console.error("Erro ao carregar locadores:", err);
    }
  }

  useEffect(() => {
    loadImoveis();
    loadLocadores();
  }, []);

  function resetForm() {
    setLocadorId("");
    setEndereco("");
    setNumero("");
    setStatus(true);
    setCurrentId(null);
  }

  function openCreateModal() {
    setIsEditing(false);
    resetForm();
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function openEditModal(imovel) {
    setIsEditing(true);
    setCurrentId(imovel.id);
    setLocadorId(imovel.locador_id || "");
    setEndereco(imovel.endereco || "");
    setNumero(imovel.numero || "");
    setStatus(imovel.status !== undefined ? imovel.status : true);
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

    const payload = {
      locador_id: Number(locador_id),
      endereco,
      numero: numero || null,
      status,
    };

    try {
      if (isEditing) {
        await api.put(`/imoveis/${currentId}`, payload);
        setSuccess("Imóvel atualizado com sucesso!");
      } else {
        await api.post("/imoveis", payload);
        setSuccess("Imóvel criado com sucesso!");
      }

      closeModal();
      loadImoveis();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar imóvel.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;

    try {
      await api.delete(`/imoveis/${id}`);
      setSuccess("Imóvel excluído com sucesso!");
      loadImoveis();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir imóvel.");
    }
  }

  function handleLogout() {
    navigate("/");
  }

  // Função auxiliar para mostrar o nome do locador
  function getNomeLocador(locadorId) {
    const locador = locadores.find((l) => l.id === locadorId);
    return locador ? (locador.nome || locador.nome_locador || `ID ${locadorId}`) : `ID ${locadorId}`;
  }

  return (
    <div className="imoveis-page min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold mb-0">Meu Sistema</span>

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/usuarios")}>
              Usuários
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/locador")}>
              Locadores
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/locatarios")}>
              Locatários
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Imóveis</h2>
            <p className="text-muted mb-0">Gerencie os imóveis do sistema</p>
          </div>

          <button className="btn btn-primary" onClick={openCreateModal}>
            + Novo Imóvel
          </button>
        </div>

        {/* Alertas */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
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
            ) : imoveis.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Nenhum imóvel encontrado.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Locador</th>
                      <th>Endereço</th>
                      <th>Número</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imoveis.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">{item.id}</td>
                        <td>{getNomeLocador(item.locador_id)}</td>
                        <td>{item.endereco}</td>
                        <td>{item.numero || "-"}</td>
                        <td>
                          <span className={`badge ${item.status ? "bg-success" : "bg-secondary"}`}>
                            {item.status ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => openEditModal(item)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
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
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Locador */}
                    <div className="col-12">
                      <label className="form-label">Locador *</label>
                      <select
                        className="form-select"
                        value={locador_id}
                        onChange={(e) => setLocadorId(e.target.value)}
                        required
                        disabled={formLoading}
                      >
                        <option value="">Selecione o locador</option>
                        {locadores.map((locador) => (
                          <option key={locador.id} value={locador.id}>
                            {locador.nome || locador.nome_locador || `Locador #${locador.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Endereço */}
                    <div className="col-md-8">
                      <label className="form-label">Endereço *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        required
                        maxLength={255}
                        disabled={formLoading}
                      />
                    </div>

                    {/* Número */}
                    <div className="col-md-4">
                      <label className="form-label">Número</label>
                      <input
                        type="text"
                        className="form-control"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        maxLength={20}
                        disabled={formLoading}
                      />
                    </div>

                    {/* Status */}
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="status"
                          checked={status}
                          onChange={(e) => setStatus(e.target.checked)}
                          disabled={formLoading}
                        />
                        <label className="form-check-label" htmlFor="status">
                          Imóvel Ativo
                        </label>
                      </div>
                    </div>
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
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Salvando...
                      </>
                    ) : isEditing ? (
                      "Salvar Alterações"
                    ) : (
                      "Criar Imóvel"
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

export default Imoveis;