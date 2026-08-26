import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Locatarios.css";

function Locatarios() {
  const navigate = useNavigate();

  const [locatarios, setLocatarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Campos do formulário (conforme o model)
  const [nome_locatario, setNomeLocatario] = useState("");
  const [tel_locatario, setTelLocatario] = useState("");
  const [rua_locatario, setRuaLocatario] = useState("");
  const [bairro_locatario, setBairroLocatario] = useState("");
  const [cep_locatario, setCepLocatario] = useState("");
  const [cpf_locatario, setCpfLocatario] = useState("");
  const [rg_locatario, setRgLocatario] = useState("");
  const [uf_locatario, setUfLocatario] = useState("");

  async function loadLocatarios() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/locatarios");
      setLocatarios(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar locatários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocatarios();
  }, []);

  function resetForm() {
    setNomeLocatario("");
    setTelLocatario("");
    setRuaLocatario("");
    setBairroLocatario("");
    setCepLocatario("");
    setCpfLocatario("");
    setRgLocatario("");
    setUfLocatario("");
    setCurrentId(null);
  }

  function openCreateModal() {
    setIsEditing(false);
    resetForm();
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function openEditModal(locatario) {
    setIsEditing(true);
    setCurrentId(locatario.id);
    setNomeLocatario(locatario.nome_locatario || "");
    setTelLocatario(locatario.tel_locatario || "");
    setRuaLocatario(locatario.rua_locatario || "");
    setBairroLocatario(locatario.bairro_locatario || "");
    setCepLocatario(locatario.cep_locatario || "");
    setCpfLocatario(locatario.cpf_locatario || "");
    setRgLocatario(locatario.rg_locatario || "");
    setUfLocatario(locatario.uf_locatario || "");
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
      nome_locatario,
      tel_locatario,
      rua_locatario: rua_locatario || null,
      bairro_locatario: bairro_locatario || null,
      cep_locatario: cep_locatario || null,
      cpf_locatario,
      rg_locatario: rg_locatario || null,
      uf_locatario: uf_locatario || null,
    };

    try {
      if (isEditing) {
        await api.put(`/locatarios/${currentId}`, payload);
        setSuccess("Locatário atualizado com sucesso!");
      } else {
        await api.post("/locatarios", payload);
        setSuccess("Locatário criado com sucesso!");
      }

      closeModal();
      loadLocatarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar locatário.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este locatário?")) return;

    try {
      await api.delete(`/locatarios/${id}`);
      setSuccess("Locatário excluído com sucesso!");
      loadLocatarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir locatário.");
    }
  }

  function handleLogout() {
    navigate("/");
  }

  return (
    <div className="locatarios-page min-vh-100">
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
            <h2 className="fw-bold mb-1">Locatários</h2>
            <p className="text-muted mb-0">Gerencie os locatários do sistema</p>
          </div>

          <button className="btn btn-primary" onClick={openCreateModal}>
            + Novo Locatário
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
            ) : locatarios.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Nenhum locatário encontrado.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Nome</th>
                      <th>Telefone</th>
                      <th>CPF</th>
                      <th>RG</th>
                      <th>UF</th>
                      <th className="text-end pe-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locatarios.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4">{item.id}</td>
                        <td>{item.nome_locatario}</td>
                        <td>{item.tel_locatario}</td>
                        <td>{item.cpf_locatario}</td>
                        <td>{item.rg_locatario || "-"}</td>
                        <td>{item.uf_locatario || "-"}</td>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? "Editar Locatário" : "Novo Locatário"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Nome */}
                    <div className="col-md-8">
                      <label className="form-label">Nome *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nome_locatario}
                        onChange={(e) => setNomeLocatario(e.target.value)}
                        required
                        maxLength={150}
                        disabled={formLoading}
                      />
                    </div>

                    {/* Telefone */}
                    <div className="col-md-4">
                      <label className="form-label">Telefone *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={tel_locatario}
                        onChange={(e) => setTelLocatario(e.target.value)}
                        required
                        maxLength={14}
                        disabled={formLoading}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    {/* CPF */}
                    <div className="col-md-4">
                      <label className="form-label">CPF *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cpf_locatario}
                        onChange={(e) => setCpfLocatario(e.target.value)}
                        required
                        maxLength={20}
                        disabled={formLoading}
                      />
                    </div>

                    {/* RG */}
                    <div className="col-md-4">
                      <label className="form-label">RG</label>
                      <input
                        type="text"
                        className="form-control"
                        value={rg_locatario}
                        onChange={(e) => setRgLocatario(e.target.value)}
                        maxLength={100}
                        disabled={formLoading}
                      />
                    </div>

                    {/* UF */}
                    <div className="col-md-4">
                      <label className="form-label">UF</label>
                      <input
                        type="text"
                        className="form-control"
                        value={uf_locatario}
                        onChange={(e) => setUfLocatario(e.target.value.toUpperCase())}
                        maxLength={2}
                        disabled={formLoading}
                        placeholder="Ex: SP"
                      />
                    </div>

                    {/* Rua */}
                    <div className="col-md-8">
                      <label className="form-label">Rua</label>
                      <input
                        type="text"
                        className="form-control"
                        value={rua_locatario}
                        onChange={(e) => setRuaLocatario(e.target.value)}
                        maxLength={150}
                        disabled={formLoading}
                      />
                    </div>

                    {/* Bairro */}
                    <div className="col-md-4">
                      <label className="form-label">Bairro</label>
                      <input
                        type="text"
                        className="form-control"
                        value={bairro_locatario}
                        onChange={(e) => setBairroLocatario(e.target.value)}
                        maxLength={20}
                        disabled={formLoading}
                      />
                    </div>

                    {/* CEP */}
                    <div className="col-md-4">
                      <label className="form-label">CEP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cep_locatario}
                        onChange={(e) => setCepLocatario(e.target.value)}
                        maxLength={10}
                        disabled={formLoading}
                        placeholder="00000-000"
                      />
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
                      "Criar Locatário"
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

export default Locatarios;