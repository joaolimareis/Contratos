import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Recebimentos.css";

function Recebimentos() {
  const navigate = useNavigate();

  const [recebimentos, setRecebimentos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Campos do formulário
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

      setRecebimentos(
        response.data.data || response.data
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erro ao carregar recebimentos."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadContratos() {
    try {
      const response = await api.get("/contratos");

      setContratos(
        response.data.data || response.data
      );

    } catch (err) {
      console.error(
        "Erro ao carregar contratos:",
        err
      );
    }
  }

  async function handleGerarRecibo(recebimento) {
    try {
      setError("");

      const response = await api.get(
        `/recebimentos/${recebimento.id}/recibo`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);

    } catch (err) {
      console.error(
        "Erro ao gerar recibo:",
        err
      );

      setError(
        "Erro ao gerar recibo."
      );
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

  function openEditModal(recebimento) {
    setIsEditing(true);

    setCurrentId(
      recebimento.id
    );

    setContratoId(
      recebimento.contrato_id || ""
    );

    setNumeroRecibo(
      recebimento.numero_recibo || ""
    );

    setDataVencimento(
      recebimento.data_vencimento || ""
    );

    setDataPagamento(
      recebimento.data_pagamento || ""
    );

    setValorCobrado(
      recebimento.valor_cobrado || ""
    );

    setValorRecebido(
      recebimento.valor_recebido || ""
    );

    setStatus(
      recebimento.status || "pendente"
    );

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

      numero_recibo:
        numero_recibo || null,

      data_vencimento,

      data_pagamento:
        data_pagamento || null,

      valor_cobrado:
        Number(valor_cobrado),

      valor_recebido:
        valor_recebido
          ? Number(valor_recebido)
          : null,

      status,
    };

    try {

      if (isEditing) {

        await api.put(
          `/recebimentos/${currentId}`,
          payload
        );

        setSuccess(
          "Recebimento atualizado com sucesso!"
        );

      } else {

        await api.post(
          "/recebimentos",
          payload
        );

        setSuccess(
          "Recebimento criado com sucesso!"
        );
      }

      closeModal();

      loadRecebimentos();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Erro ao salvar recebimento."
      );

    } finally {

      setFormLoading(false);

    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este recebimento?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/recebimentos/${id}`
      );

      setSuccess(
        "Recebimento excluído com sucesso!"
      );

      loadRecebimentos();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Erro ao excluir recebimento."
      );

    }
  }

  function handleLogout() {
    navigate("/");
  }

  // Agora recebe o item completo (com contrato e locatário já
  // aninhados pelo backend), em vez de buscar em arrays separados.
  function getContratoLabel(item) {
    if (!item.contrato) {
      return `ID ${item.contrato_id}`;
    }

    return `Contrato #${item.contrato.id}`;
  }

  function getLocatarioLabel(item) {
    const locatario = item.contrato?.locatario;

    if (!locatario) {
      return "-";
    }

    return (
      locatario.nome_locatario ||
      `Locatário #${locatario.id}`
    );
  }

  function formatCurrency(value) {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return Number(value).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  function formatDate(date) {

    if (!date) {
      return "-";
    }

    return new Date(
      date + "T00:00:00"
    ).toLocaleDateString(
      "pt-BR"
    );
  }

  function getStatusBadge(status) {

    const statusMap = {
      pendente:
        "bg-warning text-dark",

      pago:
        "bg-success",

      atrasado:
        "bg-danger",

      cancelado:
        "bg-secondary",
    };

    return (
      statusMap[status] ||
      "bg-secondary"
    );
  }

  return (
    <div className="recebimentos-page min-vh-100">

      {/* Navbar */}

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

        <div className="container">

          <span className="navbar-brand fw-bold mb-0">
            Meu Sistema
          </span>

          <div className="d-flex gap-2 flex-wrap">

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Dashboard
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate("/usuarios")
              }
            >
              Usuários
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate("/locador")
              }
            >
              Locadores
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate("/locatarios")
              }
            >
              Locatários
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate("/imoveis")
              }
            >
              Imóveis
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                navigate("/contratos")
              }
            >
              Contratos
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

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

          <div>

            <h2 className="fw-bold mb-1">
              Recebimentos
            </h2>

            <p className="text-muted mb-0">
              Gerencie os recebimentos dos contratos
            </p>

          </div>

          <button
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Novo Recebimento
          </button>

        </div>


        {/* Alertas */}

        {error && (

          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >

            {error}

            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setError("")
              }
            />

          </div>

        )}


        {success && (

          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >

            {success}

            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setSuccess("")
              }
            />

          </div>

        )}


        {/* Tabela */}

        <div className="card shadow-sm border-0">

          <div className="card-body p-0">

            {loading ? (

              <div className="text-center py-5">

                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    Carregando...
                  </span>
                </div>

              </div>

            ) : recebimentos.length === 0 ? (

              <div className="text-center py-5 text-muted">

                Nenhum recebimento encontrado.

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-hover mb-0 align-middle">

                  <thead className="table-light">

                    <tr>

                      <th className="ps-4">
                        ID
                      </th>

                      <th>
                        Nº Recibo
                      </th>

                      <th>
                        Contrato
                      </th>

                      <th>
                        Locatário
                      </th>

                      <th>
                        Vencimento
                      </th>

                      <th>
                        Pagamento
                      </th>

                      <th>
                        Valor Cobrado
                      </th>

                      <th>
                        Valor Recebido
                      </th>

                      <th>
                        Status
                      </th>

                      <th className="text-end pe-4">
                        Ações
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recebimentos.map(
                      (item) => (

                        <tr
                          key={item.id}
                        >

                          <td className="ps-4">
                            {item.id}
                          </td>

                          <td>
                            {item.numero_recibo || "-"}
                          </td>

                          <td>
                            {getContratoLabel(item)}
                          </td>

                          <td>
                            {getLocatarioLabel(item)}
                          </td>

                          <td>
                            {formatDate(
                              item.data_vencimento
                            )}
                          </td>

                          <td>
                            {formatDate(
                              item.data_pagamento
                            )}
                          </td>

                          <td>
                            {formatCurrency(
                              item.valor_cobrado
                            )}
                          </td>

                          <td>
                            {formatCurrency(
                              item.valor_recebido
                            )}
                          </td>

                          <td>

                            <span
                              className={`badge ${getStatusBadge(
                                item.status
                              )}`}
                            >
                              {item.status ||
                                "pendente"}
                            </span>

                          </td>


                          <td className="text-end pe-4">

                            {item.status ===
                              "pago" && (

                              <button
                                className="btn btn-sm btn-outline-success me-2"
                                onClick={() =>
                                  handleGerarRecibo(
                                    item
                                  )
                                }
                              >
                                Recibo
                              </button>

                            )}


                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() =>
                                openEditModal(
                                  item
                                )
                              }
                            >
                              Editar
                            </button>


                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                            >
                              Excluir
                            </button>

                          </td>

                        </tr>

                      )
                    )}

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
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)"
          }}
        >

          <div className="modal-dialog modal-dialog-centered modal-lg">

            <div className="modal-content border-0 shadow">

              <div className="modal-header">

                <h5 className="modal-title fw-bold">

                  {isEditing
                    ? "Editar Recebimento"
                    : "Novo Recebimento"}

                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />

              </div>


              <form
                onSubmit={handleSubmit}
              >

                <div className="modal-body">

                  <div className="row g-3">

                    {/* Contrato */}

                    <div className="col-12">

                      <label className="form-label">
                        Contrato *
                      </label>

                      <select
                        className="form-select"
                        value={contrato_id}
                        onChange={(e) =>
                          setContratoId(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          formLoading
                        }
                      >

                        <option value="">
                          Selecione o contrato
                        </option>

                        {contratos.map(
                          (item) => (

                            <option
                              key={item.id}
                              value={item.id}
                            >
                              Contrato #
                              {item.id} -
                              Valor:{" "}
                              {formatCurrency(
                                item.valor
                              )}
                            </option>

                          )
                        )}

                      </select>

                    </div>


                    {/* Número do Recibo */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Número do Recibo
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          numero_recibo
                        }
                        onChange={(e) =>
                          setNumeroRecibo(
                            e.target.value
                          )
                        }
                        disabled={
                          formLoading
                        }
                        placeholder="Ex: REC-0001"
                        maxLength={50}
                      />

                    </div>


                    {/* Data Vencimento */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Data de Vencimento *
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        value={
                          data_vencimento
                        }
                        onChange={(e) =>
                          setDataVencimento(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          formLoading
                        }
                      />

                    </div>


                    {/* Data Pagamento */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Data de Pagamento
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        value={
                          data_pagamento
                        }
                        onChange={(e) =>
                          setDataPagamento(
                            e.target.value
                          )
                        }
                        disabled={
                          formLoading
                        }
                      />

                    </div>


                    {/* Valor Cobrado */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Valor Cobrado (R$) *
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        value={
                          valor_cobrado
                        }
                        onChange={(e) =>
                          setValorCobrado(
                            e.target.value
                          )
                        }
                        required
                        min="0"
                        step="0.01"
                        disabled={
                          formLoading
                        }
                        placeholder="0,00"
                      />

                    </div>


                    {/* Valor Recebido */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Valor Recebido (R$)
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        value={
                          valor_recebido
                        }
                        onChange={(e) =>
                          setValorRecebido(
                            e.target.value
                          )
                        }
                        min="0"
                        step="0.01"
                        disabled={
                          formLoading
                        }
                        placeholder="0,00"
                      />

                    </div>


                    {/* Status */}

                    <div className="col-md-6">

                      <label className="form-label">
                        Status
                      </label>

                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) =>
                          setStatus(
                            e.target.value
                          )
                        }
                        disabled={
                          formLoading
                        }
                      >

                        <option value="pendente">
                          Pendente
                        </option>

                        <option value="pago">
                          Pago
                        </option>

                        <option value="atrasado">
                          Atrasado
                        </option>

                        <option value="cancelado">
                          Cancelado
                        </option>

                      </select>

                    </div>

                  </div>

                </div>


                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                    disabled={
                      formLoading
                    }
                  >
                    Cancelar
                  </button>


                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      formLoading
                    }
                  >

                    {formLoading ? (

                      <>

                        <span className="spinner-border spinner-border-sm me-2"></span>

                        Salvando...

                      </>

                    ) : isEditing ? (

                      "Salvar Alterações"

                    ) : (

                      "Criar Recebimento"

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

export default Recebimentos;