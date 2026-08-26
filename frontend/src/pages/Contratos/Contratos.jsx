import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Contratos.css";

function Contratos() {
  const navigate = useNavigate();

  const [contratos, setContratos] = useState([]);
  const [locatarios, setLocatarios] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Campos do formulário
  const [locatario_id, setLocatarioId] = useState("");
  const [imovel_id, setImovelId] = useState("");
  const [data_inicio, setDataInicio] = useState("");
  const [data_fim, setDataFim] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState(true);

  async function loadContratos() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/contratos");
      setContratos(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar contratos.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLocatarios() {
    try {
      const response = await api.get("/locatarios");
      setLocatarios(response.data.data || response.data);
    } catch (err) {
      console.error("Erro ao carregar locatários:", err);
    }
  }

  async function loadImoveis() {
    try {
      const response = await api.get("/imoveis");
      setImoveis(response.data.data || response.data);
    } catch (err) {
      console.error("Erro ao carregar imóveis:", err);
    }
  }

  useEffect(() => {
    loadContratos();
    loadLocatarios();
    loadImoveis();
  }, []);

  function resetForm() {
    setLocatarioId("");
    setImovelId("");
    setDataInicio("");
    setDataFim("");
    setValor("");
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

  function openEditModal(contrato) {
    setIsEditing(true);
    setCurrentId(contrato.id);
    setLocatarioId(contrato.locatario_id || "");
    setImovelId(contrato.imovel_id || "");
    setDataInicio(contrato.data_inicio || "");
    setDataFim(contrato.data_fim || "");
    setValor(contrato.valor || "");
    setStatus(contrato.status !== undefined ? contrato.status : true);
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
      locatario_id: Number(locatario_id),
      imovel_id: Number(imovel_id),
      data_inicio,
      data_fim: data_fim || null,
      valor: Number(valor),
      status,
    };

    try {
      if (isEditing) {
        await api.put(`/contratos/${currentId}`, payload);
        setSuccess("Contrato atualizado com sucesso!");
      } else {
        await api.post("/contratos", payload);
        setSuccess("Contrato criado com sucesso!");
      }

      closeModal();
      loadContratos();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar contrato.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este contrato?")) return;

    try {
      await api.delete(`/contratos/${id}`);
      setSuccess("Contrato excluído com sucesso!");
      loadContratos();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir contrato.");
    }
  }

  function handleLogout() {
    navigate("/");
  }

  function getNomeLocatario(id) {
    const item = locatarios.find((l) => l.id === id);
    return item ? item.nome_locatario : `ID ${id}`;
  }

  function getEnderecoImovel(id) {
    const item = imoveis.find((i) => i.id === id);
    return item ? `${item.endereco}${item.numero ? `, ${item.numero}` : ""}` : `ID ${id}`;
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  }

  return (
    <div className="contratos-page min-vh-100">
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
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/imoveis")}>
              Imóveis
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
            <h2 className="fw-bold mb-1">Contratos</h2>
            <p className="text-muted mb-0">Gerencie os contratos de locação</p>
          </div>

          <button className="btn btn-primary" onClick={openCreateModal}>
            + Novo Contrato
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
            ) : contratos.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Nenhum contrato encontrado.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Locatário</th>
                      <th>Imóvel</th>
                      <th>Início</th>
                      <th>Fim</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contratos.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">{item.id}</td>
                        <td>{getNomeLocatario(item.locatario_id)}</td>
                        <td>{getEnderecoImovel(item.imovel_id)}</td>
                        <td>{formatDate(item.data_inicio)}</td>
                        <td>{formatDate(item.data_fim)}</td>
                        <td>{formatCurrency(item.valor)}</td>
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? "Editar Contrato" : "Novo Contrato"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Locatário */}
                    <div className="col-md-6">
                      <label className="form-label">Locatário *</label>
                      <select
                        className="form-select"
                        value={locatario_id}
                        onChange={(e) => setLocatarioId(e.target.value)}
                        required
                        disabled={formLoading}
                      >
                        <option value="">Selecione o locatário</option>
                        {locatarios.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nome_locatario}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Imóvel */}
                    <div className="col-md-6">
                      <label className="form-label">Imóvel *</label>
                      <select
                        className="form-select"
                        value={imovel_id}
                        onChange={(e) => setImovelId(e.target.value)}
                        required
                        disabled={formLoading}
                      >
                        <option value="">Selecione o imóvel</option>
                        {imoveis.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.endereco}{item.numero ? `, ${item.numero}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Data Início */}
                    <div className="col-md-4">
                      <label className="form-label">Data Início *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={data_inicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                        disabled={formLoading}
                      />
                    </div>

                    {/* Data Fim */}
                    <div className="col-md-4">
                      <label className="form-label">Data Fim</label>
                      <input
                        type="date"
                        className="form-control"
                        value={data_fim}
                        onChange={(e) => setDataFim(e.target.value)}
                        disabled={formLoading}
                      />
                    </div>

                    {/* Valor */}
                    <div className="col-md-4">
                      <label className="form-label">Valor (R$) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        disabled={formLoading}
                        placeholder="0,00"
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
                          Contrato Ativo
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
                      "Criar Contrato"
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

export default Contratos;