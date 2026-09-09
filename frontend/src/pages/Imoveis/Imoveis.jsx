import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Imoveis.css";

function Imoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [locadores, setLocadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [locador_id, setLocadorId] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [status, setStatus] = useState(true);

  async function loadImoveis() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/imoveis");
      setImoveis(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os imóveis.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLocadores() {
    try {
      const response = await api.get("/locador");
      setLocadores(response.data.data || response.data || []);
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
    setFieldErrors({});
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
    setStatus(imovel.status !== undefined ? Boolean(imovel.status) : true);
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

    const enderecoTrim = endereco.trim();
    const numeroTrim = numero.trim();
    const errors = {};

    if (!enderecoTrim) {
      errors.endereco = "Informe o endereço.";
    } else if (enderecoTrim.length < 5) {
      errors.endereco = "Endereço muito curto (mínimo 5 caracteres).";
    } else if (enderecoTrim.length > 255) {
      errors.endereco = "Endereço muito longo.";
    } else if (/^\d+$/.test(enderecoTrim)) {
      errors.endereco = "Endereço não pode conter apenas números.";
    }

    if (numeroTrim && !/^[0-9A-Za-z\-\/]+$/.test(numeroTrim)) {
      errors.numero = "Número inválido.";
    }

    const jaExiste = imoveis.some((item) => {
      if (isEditing && item.id === currentId) return false;
      const mesmoEndereco =
        (item.endereco || "").trim().toLowerCase() === enderecoTrim.toLowerCase();
      const mesmoNumero =
        (item.numero || "").trim().toLowerCase() === numeroTrim.toLowerCase();
      return mesmoEndereco && mesmoNumero;
    });

    if (jaExiste) {
      errors.endereco = "Já existe um imóvel com este endereço e número.";
    }

    if (!locador_id) {
      errors.locador_id = "Selecione o locador.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    const payload = {
      locador_id: Number(locador_id),
      endereco: enderecoTrim,
      numero: numeroTrim || null,
      status,
    };

    try {
      if (isEditing) {
        await api.put(`/imoveis/${currentId}`, payload);
        setSuccess("Imóvel atualizado com sucesso.");
      } else {
        await api.post("/imoveis", payload);
        setSuccess("Imóvel criado com sucesso.");
      }
      closeModal();
      loadImoveis();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar o imóvel.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;

    try {
      await api.delete(`/imoveis/${id}`);
      setSuccess("Imóvel excluído com sucesso.");
      loadImoveis();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir o imóvel.");
    }
  }

  function getNomeLocador(locadorId) {
    const locador = locadores.find((l) => String(l.id) === String(locadorId));
    return locador
      ? locador.nome || locador.nome_locador || `Locador #${locadorId}`
      : `Locador #${locadorId}`;
  }

  return (
    <div className="imoveis-page">
      <header className="page-header">
        <div>
          <h1>Imóveis</h1>
          <p>Gerencie os imóveis cadastrados no sistema</p>
        </div>
        <button className="page-header-action" onClick={openCreateModal}>
          + Novo Imóvel
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
        ) : imoveis.length === 0 ? (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 11L12 3L21 11" />
              <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
            </svg>
            <h3>Nenhum imóvel cadastrado</h3>
            <p>Clique em “Novo Imóvel” para começar a cadastrar.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="imoveis-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.5rem" }}>Locador</th>
                  <th>Endereço</th>
                  <th>Número</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {imoveis.map((item) => (
                  <tr key={item.id}>
                    <td style={{ paddingLeft: "1.5rem" }}>
                      {getNomeLocador(item.locador_id)}
                    </td>
                    <td>{item.endereco}</td>
                    <td>{item.numero || "—"}</td>
                    <td>
                      <span
                        className={`badge ${item.status ? "badge-success" : "badge-neutral"}`}
                      >
                        {item.status ? "Ativo" : "Inativo"}
                      </span>
                    </td>
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
              <h2>{isEditing ? "Editar Imóvel" : "Novo Imóvel"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Fechar">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Locador *</label>
                  <select
                    value={locador_id}
                    onChange={(e) => {
                      setLocadorId(e.target.value);
                      if (fieldErrors.locador_id) {
                        setFieldErrors((prev) => ({ ...prev, locador_id: "" }));
                      }
                    }}
                    required
                    disabled={formLoading}
                    className={fieldErrors.locador_id ? "has-error" : ""}
                  >
                    <option value="">Selecione o locador</option>
                    {locadores.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.nome || loc.nome_locador || `Locador #${loc.id}`}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.locador_id && (
                    <span className="form-error-msg">{fieldErrors.locador_id}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Endereço *</label>
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => {
                        setEndereco(e.target.value);
                        if (fieldErrors.endereco) {
                          setFieldErrors((prev) => ({ ...prev, endereco: "" }));
                        }
                      }}
                      maxLength={255}
                      disabled={formLoading}
                      placeholder="Rua, bairro..."
                      className={fieldErrors.endereco ? "has-error" : ""}
                    />
                    {fieldErrors.endereco && (
                      <span className="form-error-msg">{fieldErrors.endereco}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Número</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => {
                        setNumero(e.target.value);
                        if (fieldErrors.numero) {
                          setFieldErrors((prev) => ({ ...prev, numero: "" }));
                        }
                      }}
                      maxLength={20}
                      disabled={formLoading}
                      placeholder="Ex: 254"
                      className={fieldErrors.numero ? "has-error" : ""}
                    />
                    {fieldErrors.numero && (
                      <span className="form-error-msg">{fieldErrors.numero}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-switch">
                    <input
                      type="checkbox"
                      id="status-imovel"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      disabled={formLoading}
                    />
                    <label htmlFor="status-imovel">Imóvel ativo</label>
                  </div>
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
                    : "Criar imóvel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Imoveis;