import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Contratos.css";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value.includes("T") ? value : value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR");
}

function formatMoney(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [locatarios, setLocatarios] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  const [locatario_id, setLocatarioId] = useState("");
  const [imovel_id, setImovelId] = useState("");
  const [data_inicio, setDataInicio] = useState("");
  const [data_fim, setDataFim] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState(true);

  const API_BASE = api.defaults.baseURL || "http://localhost:3001/api";
  const BACKEND_URL = API_BASE.replace(/\/api\/?$/, "");

  async function loadContratos() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/contratos");
      setContratos(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os contratos.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLocatarios() {
    try {
      const response = await api.get("/locatarios");
      setLocatarios(response.data.data || response.data || []);
    } catch (err) {
      console.error("Erro ao carregar locatários:", err);
    }
  }

  async function loadImoveis() {
    try {
      const response = await api.get("/imoveis");
      setImoveis(response.data.data || response.data || []);
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
    setFieldErrors({});
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
    setDataInicio(contrato.data_inicio ? String(contrato.data_inicio).slice(0, 10) : "");
    setDataFim(contrato.data_fim ? String(contrato.data_fim).slice(0, 10) : "");
    setValor(contrato.valor ?? "");
    setStatus(contrato.status !== undefined ? Boolean(contrato.status) : true);
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

    if (!locatario_id) errors.locatario_id = "Selecione o locatário.";
    if (!imovel_id) errors.imovel_id = "Selecione o imóvel.";
    if (!data_inicio) errors.data_inicio = "Informe a data de início.";
    if (!valor || Number(valor) <= 0) errors.valor = "Informe um valor válido.";

    if (data_inicio && data_fim && data_fim < data_inicio) {
      errors.data_fim = "A data fim não pode ser anterior à data de início.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

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
        setSuccess("Contrato atualizado com sucesso.");
      } else {
        await api.post("/contratos", payload);
        setSuccess("Contrato criado com sucesso.");
      }
      closeModal();
      loadContratos();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar o contrato.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este contrato?")) return;

    try {
      await api.delete(`/contratos/${id}`);
      setSuccess("Contrato excluído com sucesso.");
      loadContratos();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir o contrato.");
    }
  }

  // ===== UPLOAD DO PDF (sem recarregar a lista → não sobe/desce a página) =====
  async function handleUploadPdf(contratoId, file) {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Envie apenas arquivos PDF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("O arquivo deve ter no máximo 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", file);

    setUploadingId(contratoId);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(`/contratos/${contratoId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const arquivoPdf =
        response.data?.arquivo_pdf ||
        response.data?.data?.arquivo_pdf ||
        null;

      // Atualiza só o item na lista (sem loadContratos → sem jump de scroll)
      setContratos((prev) =>
        prev.map((c) =>
          c.id === contratoId ? { ...c, arquivo_pdf: arquivoPdf } : c
        )
      );

      setSuccess("PDF enviado com sucesso.");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao enviar o PDF.");
    } finally {
      setUploadingId(null);
    }
  }

  // ===== REMOVER PDF =====
  async function handleRemovePdf(contratoId) {
    if (!window.confirm("Tem certeza que deseja remover o PDF deste contrato?")) {
      return;
    }

    setUploadingId(contratoId);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/contratos/${contratoId}/upload`);

      // Atualiza só o item na lista
      setContratos((prev) =>
        prev.map((c) =>
          c.id === contratoId ? { ...c, arquivo_pdf: null } : c
        )
      );

      setSuccess("PDF removido com sucesso.");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao remover o PDF.");
    } finally {
      setUploadingId(null);
    }
  }

  function getNomeLocatario(id) {
    const item = locatarios.find((l) => String(l.id) === String(id));
    return item ? item.nome_locatario || item.nome || `Locatário #${id}` : `Locatário #${id}`;
  }

  function getEnderecoImovel(id) {
    const item = imoveis.find((i) => String(i.id) === String(id));
    if (!item) return `Imóvel #${id}`;
    return `${item.endereco}${item.numero ? `, ${item.numero}` : ""}`;
  }

  return (
    <div className="contratos-page">
      <header className="page-header">
        <div>
          <h1>Contratos</h1>
          <p>Gerencie os contratos de locação</p>
        </div>
        <button className="page-header-action" onClick={openCreateModal}>
          + Novo Contrato
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
        ) : contratos.length === 0 ? (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
              <path d="M14 3v5h5" />
              <path d="M9 13h6M9 17h4" />
            </svg>
            <h3>Nenhum contrato cadastrado</h3>
            <p>Clique em “Novo Contrato” para começar.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="contratos-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.4rem" }}>Locatário</th>
                  <th>Imóvel</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((item) => (
                  <tr key={item.id}>
                    <td style={{ paddingLeft: "1.4rem" }}>
                      {getNomeLocatario(item.locatario_id)}
                    </td>
                    <td>{getEnderecoImovel(item.imovel_id)}</td>
                    <td>{formatDate(item.data_inicio)}</td>
                    <td>{formatDate(item.data_fim)}</td>
                    <td>{formatMoney(item.valor)}</td>
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

                        {/* Upload PDF */}
                        <label
                          className="btn-table"
                          style={{
                            cursor: uploadingId === item.id ? "wait" : "pointer",
                            margin: 0,
                            opacity: uploadingId === item.id ? 0.6 : 1,
                          }}
                        >
                          {uploadingId === item.id ? "Enviando..." : "Upload PDF"}
                          <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            disabled={uploadingId === item.id}
                            onChange={(e) => {
                              handleUploadPdf(item.id, e.target.files[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>

                        {/* Ver PDF */}
                        {item.arquivo_pdf && (
                          <a
                            className="btn-table"
                            href={`${BACKEND_URL}${item.arquivo_pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver PDF
                          </a>
                        )}

                        {/* Remover PDF */}
                        {item.arquivo_pdf && (
                          <button
                            className="btn-table danger"
                            disabled={uploadingId === item.id}
                            onClick={() => handleRemovePdf(item.id)}
                          >
                            Remover PDF
                          </button>
                        )}

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
              <h2>{isEditing ? "Editar Contrato" : "Novo Contrato"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Fechar">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Locatário *</label>
                    <select
                      value={locatario_id}
                      onChange={(e) => {
                        setLocatarioId(e.target.value);
                        if (fieldErrors.locatario_id) {
                          setFieldErrors((prev) => ({ ...prev, locatario_id: "" }));
                        }
                      }}
                      disabled={formLoading}
                      className={fieldErrors.locatario_id ? "has-error" : ""}
                    >
                      <option value="">Selecione o locatário</option>
                      {locatarios.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nome_locatario || item.nome || `Locatário #${item.id}`}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.locatario_id && (
                      <span className="form-error-msg">{fieldErrors.locatario_id}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Imóvel *</label>
                    <select
                      value={imovel_id}
                      onChange={(e) => {
                        setImovelId(e.target.value);
                        if (fieldErrors.imovel_id) {
                          setFieldErrors((prev) => ({ ...prev, imovel_id: "" }));
                        }
                      }}
                      disabled={formLoading}
                      className={fieldErrors.imovel_id ? "has-error" : ""}
                    >
                      <option value="">Selecione o imóvel</option>
                      {imoveis.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.endereco}
                          {item.numero ? `, ${item.numero}` : ""}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.imovel_id && (
                      <span className="form-error-msg">{fieldErrors.imovel_id}</span>
                    )}
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Data Início *</label>
                    <input
                      type="date"
                      value={data_inicio}
                      onChange={(e) => {
                        setDataInicio(e.target.value);
                        if (fieldErrors.data_inicio) {
                          setFieldErrors((prev) => ({ ...prev, data_inicio: "" }));
                        }
                      }}
                      disabled={formLoading}
                      className={fieldErrors.data_inicio ? "has-error" : ""}
                    />
                    {fieldErrors.data_inicio && (
                      <span className="form-error-msg">{fieldErrors.data_inicio}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Data Fim</label>
                    <input
                      type="date"
                      value={data_fim}
                      onChange={(e) => {
                        setDataFim(e.target.value);
                        if (fieldErrors.data_fim) {
                          setFieldErrors((prev) => ({ ...prev, data_fim: "" }));
                        }
                      }}
                      disabled={formLoading}
                      className={fieldErrors.data_fim ? "has-error" : ""}
                    />
                    {fieldErrors.data_fim && (
                      <span className="form-error-msg">{fieldErrors.data_fim}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={valor}
                      onChange={(e) => {
                        setValor(e.target.value);
                        if (fieldErrors.valor) {
                          setFieldErrors((prev) => ({ ...prev, valor: "" }));
                        }
                      }}
                      disabled={formLoading}
                      placeholder="0,00"
                      className={fieldErrors.valor ? "has-error" : ""}
                    />
                    {fieldErrors.valor && (
                      <span className="form-error-msg">{fieldErrors.valor}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-switch">
                    <input
                      type="checkbox"
                      id="status-contrato"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      disabled={formLoading}
                    />
                    <label htmlFor="status-contrato">Contrato ativo</label>
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
                    : "Criar contrato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contratos;