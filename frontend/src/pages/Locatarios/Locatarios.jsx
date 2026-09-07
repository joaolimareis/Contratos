import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Locatarios.css";

function Locatarios() {
  const [locatarios, setLocatarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

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
      setLocatarios(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os locatários.");
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
    setFieldErrors({});
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

    if (!nome_locatario.trim()) errors.nome_locatario = "Informe o nome.";
    if (!tel_locatario.trim()) errors.tel_locatario = "Informe o telefone.";
    if (!cpf_locatario.trim()) errors.cpf_locatario = "Informe o CPF.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    const payload = {
      nome_locatario: nome_locatario.trim(),
      tel_locatario: tel_locatario.trim(),
      cpf_locatario: cpf_locatario.trim(),
      rua_locatario: rua_locatario.trim() || null,
      bairro_locatario: bairro_locatario.trim() || null,
      cep_locatario: cep_locatario.trim() || null,
      rg_locatario: rg_locatario.trim() || null,
      uf_locatario: uf_locatario.trim().toUpperCase() || null,
    };

    try {
      if (isEditing) {
        await api.put(`/locatarios/${currentId}`, payload);
        setSuccess("Locatário atualizado com sucesso.");
      } else {
        await api.post("/locatarios", payload);
        setSuccess("Locatário criado com sucesso.");
      }
      closeModal();
      loadLocatarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar o locatário.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este locatário?")) return;

    try {
      await api.delete(`/locatarios/${id}`);
      setSuccess("Locatário excluído com sucesso.");
      loadLocatarios();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir o locatário.");
    }
  }

  return (
    <div className="locatarios-page">
      <header className="page-header">
        <div>
          <h1>Locatários</h1>
          <p>Gerencie os locatários do sistema</p>
        </div>
        <button className="page-header-action" onClick={openCreateModal}>
          + Novo Locatário
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
        ) : locatarios.length === 0 ? (
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
            <h3>Nenhum locatário cadastrado</h3>
            <p>Clique em “Novo Locatário” para começar.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="locatarios-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.4rem" }}>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>RG</th>
                  <th>UF</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {locatarios.map((item) => (
                  <tr key={item.id}>
                    <td style={{ paddingLeft: "1.4rem", color: "var(--text-muted)" }}>
                      {item.id}
                    </td>
                    <td>{item.nome_locatario}</td>
                    <td>{item.tel_locatario || "—"}</td>
                    <td>{item.cpf_locatario || "—"}</td>
                    <td>{item.rg_locatario || "—"}</td>
                    <td>{item.uf_locatario || "—"}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-table" onClick={() => openEditModal(item)}>
                          Editar
                        </button>
                        <button
                          className="btn-table danger"
                          onClick={() => handleDelete(item.id)}
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
              <h2>{isEditing ? "Editar Locatário" : "Novo Locatário"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Fechar">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    value={nome_locatario}
                    onChange={(e) => {
                      setNomeLocatario(e.target.value);
                      if (fieldErrors.nome_locatario) {
                        setFieldErrors((prev) => ({ ...prev, nome_locatario: "" }));
                      }
                    }}
                    maxLength={150}
                    disabled={formLoading}
                    placeholder="Nome completo"
                    className={fieldErrors.nome_locatario ? "has-error" : ""}
                  />
                  {fieldErrors.nome_locatario && (
                    <span className="form-error-msg">{fieldErrors.nome_locatario}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input
                      type="text"
                      value={tel_locatario}
                      onChange={(e) => {
                        setTelLocatario(e.target.value);
                        if (fieldErrors.tel_locatario) {
                          setFieldErrors((prev) => ({ ...prev, tel_locatario: "" }));
                        }
                      }}
                      maxLength={14}
                      disabled={formLoading}
                      placeholder="(00) 00000-0000"
                      className={fieldErrors.tel_locatario ? "has-error" : ""}
                    />
                    {fieldErrors.tel_locatario && (
                      <span className="form-error-msg">{fieldErrors.tel_locatario}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>CPF *</label>
                    <input
                      type="text"
                      value={cpf_locatario}
                      onChange={(e) => {
                        setCpfLocatario(e.target.value);
                        if (fieldErrors.cpf_locatario) {
                          setFieldErrors((prev) => ({ ...prev, cpf_locatario: "" }));
                        }
                      }}
                      maxLength={20}
                      disabled={formLoading}
                      placeholder="000.000.000-00"
                      className={fieldErrors.cpf_locatario ? "has-error" : ""}
                    />
                    {fieldErrors.cpf_locatario && (
                      <span className="form-error-msg">{fieldErrors.cpf_locatario}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>RG</label>
                    <input
                      type="text"
                      value={rg_locatario}
                      onChange={(e) => setRgLocatario(e.target.value)}
                      maxLength={100}
                      disabled={formLoading}
                      placeholder="Número do RG"
                    />
                  </div>

                  <div className="form-group">
                    <label>UF</label>
                    <input
                      type="text"
                      value={uf_locatario}
                      onChange={(e) => setUfLocatario(e.target.value.toUpperCase())}
                      maxLength={2}
                      disabled={formLoading}
                      placeholder="Ex: SP"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rua</label>
                    <input
                      type="text"
                      value={rua_locatario}
                      onChange={(e) => setRuaLocatario(e.target.value)}
                      maxLength={150}
                      disabled={formLoading}
                      placeholder="Rua e número"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bairro</label>
                    <input
                      type="text"
                      value={bairro_locatario}
                      onChange={(e) => setBairroLocatario(e.target.value)}
                      maxLength={50}
                      disabled={formLoading}
                      placeholder="Bairro"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>CEP</label>
                  <input
                    type="text"
                    value={cep_locatario}
                    onChange={(e) => setCepLocatario(e.target.value)}
                    maxLength={10}
                    disabled={formLoading}
                    placeholder="00000-000"
                    style={{ maxWidth: "180px" }}
                  />
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
                    : "Criar locatário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Locatarios;