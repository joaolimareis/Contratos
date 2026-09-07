import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Recebimentos.css";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR");
}

function formatMoney(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Recebimentos() {
  const [recebimentos, setRecebimentos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [reciboLoading, setReciboLoading] = useState(null); // id do recibo que está gerando

  // campos do formulário
  const [contrato_id, setContratoId] = useState("");
  const [numero_recibo, setNumeroRecibo] = useState("");
  const [data_vencimento, setDataVencimento] = useState("");
  const [data_pagamento, setDataPagamento] = useState("");
  const [valor_cobrado, setValorCobrado] = useState("");
  const [valor_recebido, setValorRecebido] = useState("");
  const [status, setStatus] = useState("pendente");

  async function loadRecebimentos() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/recebimentos");
      setRecebimentos(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os recebimentos.");
    } finally {
      setLoading(false);
    }
  }

  async function loadContratos() {
    try {
      const response = await api.get("/contratos");
      setContratos(response.data.data || response.data || []);
    } catch (err) {
      console.error("Erro ao carregar contratos:", err);
    }
  }

  useEffect(() => {
    loadRecebimentos();
    loadContratos();
  }, []);

  function resetForm() {
    setContratoId("");
    setNumeroRecibo("");
    setDataVencimento("");
    setDataPagamento("");
    setValorCobrado("");
    setValorRecebido("");
    setStatus("pendente");
    setCurrentId(null);
  }

  function openCreateModal() {
    setIsEditing(false);
    resetForm();
    setShowModal(true);
    setError("");
    setSuccess("");
  }

  function openEditModal(item) {
    setIsEditing(true);
    setCurrentId(item.id);
    setContratoId(item.contrato_id || "");
    setNumeroRecibo(item.numero_recibo || item.n_recibo || "");
    setDataVencimento(item.data_vencimento ? String(item.data_vencimento).slice(0, 10) : "");
    setDataPagamento(item.data_pagamento ? String(item.data_pagamento).slice(0, 10) : "");
    setValorCobrado(item.valor_cobrado ?? "");
    setValorRecebido(item.valor_recebido ?? "");
    setStatus(item.status || "pendente");
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
      contrato_id: Number(contrato_id),
      numero_recibo: numero_recibo || null,
      data_vencimento: data_vencimento || null,
      data_pagamento: data_pagamento || null,
      valor_cobrado: Number(valor_cobrado) || 0,
      valor_recebido: Number(valor_recebido) || 0,
      status,
    };

    try {
      if (isEditing) {
        await api.put(`/recebimentos/${currentId}`, payload);
        setSuccess("Recebimento atualizado com sucesso.");
      } else {
        await api.post("/recebimentos", payload);
        setSuccess("Recebimento criado com sucesso.");
      }
      closeModal();
      loadRecebimentos();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar o recebimento.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este recebimento?")) return;

    try {
      await api.delete(`/recebimentos/${id}`);
      setSuccess("Recebimento excluído com sucesso.");
      loadRecebimentos();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir o recebimento.");
    }
  }

  // ===== GERAR RECIBO (PDF) =====
  async function handleGerarRecibo(item) {
    setReciboLoading(item.id);
    setError("");

    try {
      const response = await api.get(`/recebimentos/${item.id}/recibo`, {
        responseType: "blob", // importante para PDF
      });

      // Cria URL do blob e abre em nova aba
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Também oferece download com nome amigável
      const numero = item.numero_recibo || item.id;
      link.download = `recibo-${numero}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libera a memória
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Erro ao gerar recibo:", err);

      if (err.response?.status === 404) {
        setError("Rota de recibo não encontrada no servidor (404).");
      } else {
        setError(
          err.response?.data?.message ||
            "Não foi possível gerar o recibo. Tente novamente."
        );
      }
    } finally {
      setReciboLoading(null);
    }
  }

  function getContratoLabel(contratoId) {
    const c = contratos.find((x) => String(x.id) === String(contratoId));
    if (!c) return `Contrato #${contratoId}`;
    return `Contrato #${c.id}`;
  }

  function getLocatarioNome(contratoId) {
    const c = contratos.find((x) => String(x.id) === String(contratoId));
    return c?.locatario?.nome_locatario || c?.nome_locatario || "—";
  }

  function statusBadge(status) {
    const s = String(status || "").toLowerCase();
    if (s === "pago") return "badge-success";
    if (s === "atrasado") return "badge-danger";
    if (s === "a_vencer" || s === "pendente") return "badge-warning";
    return "badge-neutral";
  }

  return (
    <div className="recebimentos-page">
      <header className="page-header">
        <div>
          <h1>Recebimentos</h1>
          <p>Gerencie os recebimentos dos contratos</p>
        </div>
        <button className="page-header-action" onClick={openCreateModal}>
          + Novo Recebimento
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
        ) : recebimentos.length === 0 ? (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M6 15h4" />
            </svg>
            <h3>Nenhum recebimento cadastrado</h3>
            <p>Clique em “Novo Recebimento” para começar.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="recebimentos-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.4rem" }}>ID</th>
                  <th>Nº Recibo</th>
                  <th>Contrato</th>
                  <th>Locatário</th>
                  <th>Vencimento</th>
                  <th>Pagamento</th>
                  <th>Valor Cobrado</th>
                  <th>Valor Recebido</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right", paddingRight: "1.4rem" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recebimentos.map((item) => (
                  <tr key={item.id}>
                    <td style={{ paddingLeft: "1.4rem", color: "var(--text-muted)" }}>
                      {item.id}
                    </td>
                    <td>{item.numero_recibo || item.n_recibo || "—"}</td>
                    <td>{getContratoLabel(item.contrato_id)}</td>
                    <td>{getLocatarioNome(item.contrato_id)}</td>
                    <td>{formatDate(item.data_vencimento)}</td>
                    <td>{formatDate(item.data_pagamento)}</td>
                    <td>{formatMoney(item.valor_cobrado)}</td>
                    <td>{formatMoney(item.valor_recebido)}</td>
                    <td>
                      <span className={`badge ${statusBadge(item.status)}`}>
                        {item.status || "—"}
                      </span>
                    </td>
                    <td style={{ paddingRight: "1.4rem" }}>
                      <div className="actions">
                        <button
                          className="btn-table primary"
                          title="Gerar recibo"
                          onClick={() => handleGerarRecibo(item)}
                          disabled={reciboLoading === item.id}
                        >
                          {reciboLoading === item.id ? "Gerando..." : "Recibo"}
                        </button>
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
              <h2>{isEditing ? "Editar Recebimento" : "Novo Recebimento"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Fechar">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Contrato *</label>
                  <select
                    value={contrato_id}
                    onChange={(e) => setContratoId(e.target.value)}
                    required
                    disabled={formLoading}
                  >
                    <option value="">Selecione o contrato</option>
                    {contratos.map((c) => (
                      <option key={c.id} value={c.id}>
                        Contrato #{c.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nº do Recibo</label>
                    <input
                      type="text"
                      value={numero_recibo}
                      onChange={(e) => setNumeroRecibo(e.target.value)}
                      disabled={formLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={formLoading}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="atrasado">Atrasado</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Data de Vencimento</label>
                    <input
                      type="date"
                      value={data_vencimento}
                      onChange={(e) => setDataVencimento(e.target.value)}
                      disabled={formLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Data de Pagamento</label>
                    <input
                      type="date"
                      value={data_pagamento}
                      onChange={(e) => setDataPagamento(e.target.value)}
                      disabled={formLoading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Valor Cobrado</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valor_cobrado}
                      onChange={(e) => setValorCobrado(e.target.value)}
                      disabled={formLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Valor Recebido</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valor_recebido}
                      onChange={(e) => setValorRecebido(e.target.value)}
                      disabled={formLoading}
                    />
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
                    : "Criar recebimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recebimentos;