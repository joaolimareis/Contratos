import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Locador.css";

function Locador() {
  const [locadores, setLocadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [nome_locador, setNomeLocador] = useState("");
  const [tel_locador, setTelLocador] = useState("");
  const [cpf_locador, setCpfLocador] = useState("");
  const [rua_locador, setRuaLocador] = useState("");
  const [bairro_locador, setBairroLocador] = useState("");
  const [cep_locador, setCepLocador] = useState("");
  const [rg_locador, setRgLocador] = useState("");
  const [uf_locador, setUfLocador] = useState("");

  async function loadLocadores() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/locador");
      setLocadores(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os locadores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocadores();
  }, []);

  function clearForm() {
    setNomeLocador("");
    setTelLocador("");
    setCpfLocador("");
    setRuaLocador("");
    setBairroLocador("");
    setCepLocador("");
    setRgLocador("");
    setUfLocador("");
    setFieldErrors({});
  }

  function openCreateModal() {
    setIsEditing(false);
    setCurrentId(null);
    clearForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function openEditModal(locador) {
    setIsEditing(true);
    setCurrentId(locador.id);
    setNomeLocador(locador.nome_locador || "");
    setTelLocador(locador.tel_locador || "");
    setCpfLocador(locador.cpf_locador || "");
    setRuaLocador(locador.rua_locador || "");
    setBairroLocador(locador.bairro_locador || "");
    setCepLocador(locador.cep_locador || "");
    setRgLocador(locador.rg_locador || "");
    setUfLocador(locador.uf_locador || "");
    setFieldErrors({});
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setCurrentId(null);
    clearForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    const errors = {};

    if (!nome_locador.trim()) errors.nome_locador = "Informe o nome.";
    if (!tel_locador.trim()) errors.tel_locador = "Informe o telefone.";
    if (!cpf_locador.trim()) errors.cpf_locador = "Informe o CPF.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    const payload = {
      nome_locador: nome_locador.trim(),
      tel_locador: tel_locador.trim(),
      cpf_locador: cpf_locador.trim(),
      rua_locador: rua_locador.trim() || null,
      bairro_locador: bairro_locador.trim() || null,
      cep_locador: cep_locador.trim() || null,
      rg_locador: rg_locador.trim() || null,
      uf_locador: uf_locador.trim().toUpperCase() || null,
    };

    try {
      if (isEditing) {
        await api.put(`/locador/${currentId}`, payload);
        setSuccess("Locador atualizado com sucesso.");
      } else {
        await api.post("/locador", payload);
        setSuccess("Locador criado com sucesso.");
      }
      closeModal();
      loadLocadores();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar o locador.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este locador?")) return;

    try {
      await api.delete(`/locador/${id}`);
      setSuccess("Locador excluído com sucesso.");
      loadLocadores();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir o locador.");
    }
  }

  return (
    <div className="locador-page">
      <header className="page-header">
        <div>
          <h1>Locadores</h1>
          <p>Gerencie os locadores do sistema</p>
        </div>
        <button className="page-header-action" onClick={openCreateModal}>
          + Novo Locador
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
        ) : locadores.length === 0 ? (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="3.5" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
            </svg>
            <h3>Nenhum locador cadastrado</h3>
            <p>Clique em “Novo Locador” para começar.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="locador-table">
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
                {locadores.map((locador) => (
                  <tr key={locador.id}>
                    <td style={{ paddingLeft: "1.4rem", color: "var(--text-muted)" }}>
                      {locador.id}
                    </td>
                    <td>{locador.nome_locador}</td>
                    <td>{locador.tel_locador || "—"}</td>
                    <td>{locador.cpf_locador || "—"}</td>
                    <td>{locador.rg_locador || "—"}</td>
                    <td>{locador.uf_locador || "—"}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-table" onClick={() => openEditModal(locador)}>
                          Editar
                        </button>
                        <button
                          className="btn-table danger"
                          onClick={() => handleDelete(locador.id)}
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
              <h2>{isEditing ? "Editar Locador" : "Novo Locador"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Fechar">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Nome *</label>
                    <input
                      type="text"
                      value={nome_locador}
                      onChange={(e) => {
                        setNomeLocador(e.target.value);
                        if (fieldErrors.nome_locador) {
                          setFieldErrors((prev) => ({ ...prev, nome_locador: "" }));
                        }
                      }}
                      disabled={formLoading}
                      placeholder="Nome completo"
                      className={fieldErrors.nome_locador ? "has-error" : ""}
                    />
                    {fieldErrors.nome_locador && (
                      <span className="form-error-msg">{fieldErrors.nome_locador}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input
                      type="text"
                      value={tel_locador}
                      onChange={(e) => {
                        setTelLocador(e.target.value);
                        if (fieldErrors.tel_locador) {
                          setFieldErrors((prev) => ({ ...prev, tel_locador: "" }));
                        }
                      }}
                      disabled={formLoading}
                      placeholder="(91) 99999-9999"
                      className={fieldErrors.tel_locador ? "has-error" : ""}
                    />
                    {fieldErrors.tel_locador && (
                      <span className="form-error-msg">{fieldErrors.tel_locador}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>CPF *</label>
                    <input
                      type="text"
                      value={cpf_locador}
                      onChange={(e) => {
                        setCpfLocador(e.target.value);
                        if (fieldErrors.cpf_locador) {
                          setFieldErrors((prev) => ({ ...prev, cpf_locador: "" }));
                        }
                      }}
                      disabled={formLoading}
                      placeholder="000.000.000-00"
                      className={fieldErrors.cpf_locador ? "has-error" : ""}
                    />
                    {fieldErrors.cpf_locador && (
                      <span className="form-error-msg">{fieldErrors.cpf_locador}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>RG</label>
                    <input
                      type="text"
                      value={rg_locador}
                      onChange={(e) => setRgLocador(e.target.value)}
                      disabled={formLoading}
                      placeholder="Número do RG"
                    />
                  </div>

                  <div className="form-group">
                    <label>UF</label>
                    <input
                      type="text"
                      value={uf_locador}
                      onChange={(e) => setUfLocador(e.target.value.toUpperCase())}
                      maxLength={2}
                      disabled={formLoading}
                      placeholder="PA"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rua</label>
                    <input
                      type="text"
                      value={rua_locador}
                      onChange={(e) => setRuaLocador(e.target.value)}
                      disabled={formLoading}
                      placeholder="Rua e número"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bairro</label>
                    <input
                      type="text"
                      value={bairro_locador}
                      onChange={(e) => setBairroLocador(e.target.value)}
                      disabled={formLoading}
                      placeholder="Bairro"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>CEP</label>
                  <input
                    type="text"
                    value={cep_locador}
                    onChange={(e) => setCepLocador(e.target.value)}
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
                    : "Criar locador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Locador;