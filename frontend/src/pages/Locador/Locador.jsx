import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Locador.css";

function Locador() {
  const navigate = useNavigate();

  // Lista de locadores
  const [locadores, setLocadores] = useState([]);

  // Estados da página
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Campos do formulário
  const [nome_locador, setNomeLocador] = useState("");
  const [tel_locador, setTelLocador] = useState("");
  const [cpf_locador, setCpfLocador] = useState("");
  const [rua_locador, setRuaLocador] = useState("");
  const [bairro_locador, setBairroLocador] = useState("");
  const [cep_locador, setCepLocador] = useState("");
  const [rg_locador, setRgLocador] = useState("");
  const [uf_locador, setUfLocador] = useState("");

  // Estado do envio do formulário
  const [formLoading, setFormLoading] = useState(false);

  // =========================================================
  // CARREGAR LOCADORES
  // =========================================================

  async function loadLocadores() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/locador");

      console.log("Resposta da API:", response.data);

      // Seu backend retorna:
      // {
      //   status: 200,
      //   message: "...",
      //   data: [...]
      // }

      setLocadores(response.data.data);
    } catch (err) {
      console.error("Erro ao carregar locadores:", err);

      setError(
        err.response?.data?.message ||
          "Erro ao carregar locadores."
      );
    } finally {
      setLoading(false);
    }
  }

  // Carrega os locadores quando a página abre
  useEffect(() => {
    loadLocadores();
  }, []);

  // =========================================================
  // LIMPAR FORMULÁRIO
  // =========================================================

  function clearForm() {
    setNomeLocador("");
    setTelLocador("");
    setCpfLocador("");
    setRuaLocador("");
    setBairroLocador("");
    setCepLocador("");
    setRgLocador("");
    setUfLocador("");
  }

  // =========================================================
  // ABRIR MODAL PARA CRIAR
  // =========================================================

  function openCreateModal() {
    setIsEditing(false);
    setCurrentId(null);

    clearForm();

    setError("");
    setSuccess("");

    setShowModal(true);
  }

  // =========================================================
  // ABRIR MODAL PARA EDITAR
  // =========================================================

  function openEditModal(locador) {
    setIsEditing(true);
    setCurrentId(locador.id);

    // Preenche o formulário com os dados vindos da API
    setNomeLocador(locador.nome_locador || "");
    setTelLocador(locador.tel_locador || "");
    setCpfLocador(locador.cpf_locador || "");
    setRuaLocador(locador.rua_locador || "");
    setBairroLocador(locador.bairro_locador || "");
    setCepLocador(locador.cep_locador || "");
    setRgLocador(locador.rg_locador || "");
    setUfLocador(locador.uf_locador || "");

    setError("");
    setSuccess("");

    setShowModal(true);
  }

  // =========================================================
  // FECHAR MODAL
  // =========================================================

  function closeModal() {
    setShowModal(false);
    setCurrentId(null);

    clearForm();
  }

  // =========================================================
  // CRIAR / EDITAR LOCADOR
  // =========================================================

  async function handleSubmit(e) {
    e.preventDefault();

    setFormLoading(true);
    setError("");
    setSuccess("");

    // Os nomes aqui precisam ser exatamente
    // os nomes esperados pelo backend/Joi.
    const payload = {
      nome_locador,
      tel_locador,
      rua_locador,
      bairro_locador,
      cep_locador,
      cpf_locador,
      rg_locador,
      uf_locador,
    };

    console.log("PAYLOAD ENVIADO:", payload);

    try {
      if (isEditing) {
        // EDITAR
        await api.put(
          `/locador/${currentId}`,
          payload
        );

        setSuccess(
          "Locador atualizado com sucesso!"
        );
      } else {
        // CRIAR
        await api.post(
          "/locador",
          payload
        );

        setSuccess(
          "Locador criado com sucesso!"
        );
      }

      closeModal();

      // Atualiza a tabela
      await loadLocadores();

    } catch (err) {
      console.error(
        "Erro ao salvar locador:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Erro ao salvar locador."
      );
    } finally {
      setFormLoading(false);
    }
  }

  // =========================================================
  // EXCLUIR LOCADOR
  // =========================================================

  async function handleDelete(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este locador?"
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/locador/${id}`);

      setSuccess(
        "Locador excluído com sucesso!"
      );

      await loadLocadores();

    } catch (err) {
      console.error(
        "Erro ao excluir locador:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Erro ao excluir locador."
      );
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    navigate("/");
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="locador-page min-vh-100">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">

          <span className="navbar-brand fw-bold mb-0">
            Meu Sistema
          </span>

          <div className="d-flex gap-2">

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
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Sair
            </button>

          </div>
        </div>
      </nav>

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div className="container py-4">

        {/* Cabeçalho */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold mb-1">
              Locadores
            </h2>

            <p className="text-muted mb-0">
              Gerencie os locadores do sistema
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Novo Locador
          </button>

        </div>

        {/* =================================================
            ALERTA DE ERRO
        ================================================== */}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}

            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {/* =================================================
            ALERTA DE SUCESSO
        ================================================== */}

        {success && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {success}

            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess("")}
            ></button>
          </div>
        )}

        {/* =================================================
            TABELA
        ================================================== */}

        <div className="card shadow-sm border-0">

          <div className="card-body p-0">

            {/* Carregando */}

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

            ) : locadores.length === 0 ? (

              /* Nenhum locador */

              <div className="text-center py-5 text-muted">
                Nenhum locador encontrado.
              </div>

            ) : (

              /* Tabela */

              <div className="table-responsive">

                <table className="table table-hover mb-0 align-middle">

                  <thead className="table-light">

                    <tr>

                      <th className="ps-4">
                        ID
                      </th>

                      <th>
                        Nome
                      </th>

                      <th>
                        Telefone
                      </th>

                      <th>
                        CPF
                      </th>

                      <th>
                        RG
                      </th>

                      <th>
                        Cidade/UF
                      </th>

                      <th className="text-end pe-4">
                        Ações
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {locadores.map((locador) => (

                      <tr key={locador.id}>

                        <td className="ps-4">
                          {locador.id}
                        </td>

                        <td>
                          {locador.nome_locador}
                        </td>

                        <td>
                          {locador.tel_locador}
                        </td>

                        <td>
                          {locador.cpf_locador}
                        </td>

                        <td>
                          {locador.rg_locador}
                        </td>

                        <td>
                          {locador.uf_locador}
                        </td>

                        <td className="text-end pe-4">

                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>
                              openEditModal(locador)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(
                                locador.id
                              )
                            }
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

      {/* =====================================================
          MODAL
      ====================================================== */}

      {showModal && (

        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered modal-lg">

            <div className="modal-content border-0 shadow">

              {/* Cabeçalho do modal */}

              <div className="modal-header">

                <h5 className="modal-title fw-bold">

                  {isEditing
                    ? "Editar Locador"
                    : "Novo Locador"}

                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={formLoading}
                ></button>

              </div>

              {/* Formulário */}

              <form onSubmit={handleSubmit}>

                <div className="modal-body">

                  <div className="row">

                    {/* Nome */}

                    <div className="col-md-8 mb-3">

                      <label className="form-label">
                        Nome
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={nome_locador}
                        onChange={(e) =>
                          setNomeLocador(
                            e.target.value
                          )
                        }
                        required
                        disabled={formLoading}
                        placeholder="Nome completo"
                      />

                    </div>

                    {/* Telefone */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        Telefone
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={tel_locador}
                        onChange={(e) =>
                          setTelLocador(
                            e.target.value
                          )
                        }
                        required
                        disabled={formLoading}
                        placeholder="(91) 99999-9999"
                      />

                    </div>

                    {/* CPF */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        CPF
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={cpf_locador}
                        onChange={(e) =>
                          setCpfLocador(
                            e.target.value
                          )
                        }
                        required
                        disabled={formLoading}
                        placeholder="000.000.000-00"
                      />

                    </div>

                    {/* RG */}

                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        RG
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={rg_locador}
                        onChange={(e) =>
                          setRgLocador(
                            e.target.value
                          )
                        }
                        disabled={formLoading}
                        placeholder="Número do RG"
                      />

                    </div>

                    {/* Rua */}

                    <div className="col-md-8 mb-3">

                      <label className="form-label">
                        Rua
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={rua_locador}
                        onChange={(e) =>
                          setRuaLocador(
                            e.target.value
                          )
                        }
                        disabled={formLoading}
                        placeholder="Rua e número"
                      />

                    </div>

                    {/* Bairro */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        Bairro
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={bairro_locador}
                        onChange={(e) =>
                          setBairroLocador(
                            e.target.value
                          )
                        }
                        disabled={formLoading}
                        placeholder="Bairro"
                      />

                    </div>

                    {/* CEP */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        CEP
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={cep_locador}
                        onChange={(e) =>
                          setCepLocador(
                            e.target.value
                          )
                        }
                        disabled={formLoading}
                        placeholder="00000-000"
                      />

                    </div>

                    {/* UF */}

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        UF
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={uf_locador}
                        onChange={(e) =>
                          setUfLocador(
                            e.target.value
                          )
                        }
                        maxLength={2}
                        disabled={formLoading}
                        placeholder="PA"
                      />

                    </div>

                  </div>

                </div>

                {/* Rodapé */}

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

                      "Criar Locador"

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

export default Locador;