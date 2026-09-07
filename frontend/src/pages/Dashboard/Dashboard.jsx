import { useEffect, useMemo, useState } from "react";
import api from "../../services/api"; // ajuste o caminho se sua instância axios estiver em outro lugar
import "./Dashboard.css";


const ENDPOINTS = {
  imoveis: "/imoveis",
  contratos: "/contratos",
  recebimentos: "/recebimentos",
  locatarios: "/locatarios",
};

const DIAS_A_VENCER = 7;   // janela do KPI "A vencer"
const DIAS_LISTA = 30;     // janela da lista "Próximos vencimentos"

const STATUS_LABEL = {
  em_dia: "Em dia",
  a_vencer: "A vencer",
  atrasado: "Atrasado",
};

const STATUS_BADGE_CLASS = {
  em_dia: "badge-success",
  a_vencer: "badge-warning",
  atrasado: "badge-danger",
};

const PRIORIDADE_STATUS = { atrasado: 2, a_vencer: 1, em_dia: 0 };
const DIA_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// handleResponse devolve { status, message, data } -> pega o array de dentro
function extrairLista(res) {
  const body = res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}


function parseData(valor) {
  if (!valor) return null;
  if (valor instanceof Date) return valor;

  const s = String(valor).trim();

  // YYYY-MM-DD
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  // DD/MM/YYYY
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));

  // DD-MM-YYYY
  m = s.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function diasEntre(de, ate) {
  return Math.floor((ate - de) / DIA_MS);
}

function statusRecebimento(vencimento, hoje) {
  const diff = diasEntre(hoje, vencimento);
  if (diff < 0) return "atrasado";
  if (diff <= DIAS_A_VENCER) return "a_vencer";
  return "em_dia";
}

function normalizar(str) {
  return String(str ?? "").trim().toLowerCase();
}

function formatDiaMes(date) {
  return {
    dia: date.getDate(),
    mes: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
  };
}

function formatMoeda(valor) {
  return Number(valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Monta o "resumo" a partir das listas cruas das suas rotas
function montarResumo({ imoveis, contratos, recebimentos, locatarios }) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // ---- KPI: imóveis ativos ----
  const imoveisAtivos = imoveis.filter(
    (i) => !["inativo", "desativado", "indisponivel", "indisponível"].includes(normalizar(i.status))
  ).length;

  // ---- KPI: contratos vigentes (já corrigido anteriormente) ----
  const contratosVigentes = contratos.filter((c) => {
    const st = normalizar(c.status);
    if (["inativo", "encerrado", "cancelado", "finalizado", "rescindido", "desativado"].includes(st)) {
      return false;
    }
    const inicio = parseData(c.data_inicio || c.inicio || c.dataInicio || c.start_date);
    const fim    = parseData(c.data_fim    || c.fim    || c.dataFim    || c.end_date);
    return (!inicio || inicio <= hoje) && (!fim || fim >= hoje);
  }).length;

  // ---- índices ----
  const contratosPorId = Object.fromEntries(contratos.map((c) => [String(c.id), c]));
  const imoveisPorId   = Object.fromEntries(imoveis.map((i) => [String(i.id), i]));
  const locatariosPorId = Object.fromEntries(locatarios.map((l) => [String(l.id), l]));

  // ---- 1) Recebimentos reais ainda pendentes ----
  const pendentesReais = recebimentos
    .filter((r) => normalizar(r.status) !== "pago" && !r.data_pagamento)
    .map((r) => {
      const vencimento = parseData(r.data_vencimento);
      if (!vencimento) return null;

      const contrato = contratosPorId[String(r.contrato_id)];
      const imovel   = contrato ? imoveisPorId[String(contrato.imovel_id)] : null;
      const locatario = contrato ? locatariosPorId[String(contrato.locatario_id)] : null;

      const enderecoImovel = imovel
        ? [imovel.endereco, imovel.numero].filter(Boolean).join(", ")
        : `Imóvel #${contrato?.imovel_id ?? "?"}`;

      const descContrato = locatario?.nome_locatario
        ? `${locatario.nome_locatario} · Contrato #${contrato.id}`
        : `Contrato #${r.contrato_id}`;

      return {
        id: r.id,
        vencimento,
        valor: Number(r.valor_cobrado ?? contrato?.valor ?? 0),
        status: statusRecebimento(vencimento, hoje),
        imovel: enderecoImovel,
        contrato: descContrato,
        isSynthetic: false,
      };
    })
    .filter(Boolean);

  // ---- 2) Gera vencimentos esperados (mês atual + próximo) para contratos vigentes ----
  const recebimentosPorContrato = {};
  recebimentos.forEach((r) => {
    const cid = String(r.contrato_id);
    if (!recebimentosPorContrato[cid]) recebimentosPorContrato[cid] = [];
    recebimentosPorContrato[cid].push(r);
  });

  const sinteticos = [];

  contratos.forEach((c) => {
    // só contratos realmente vigentes
    const st = normalizar(c.status);
    if (["inativo", "encerrado", "cancelado", "finalizado", "rescindido", "desativado"].includes(st)) return;

    const inicio = parseData(c.data_inicio || c.inicio || c.dataInicio);
    const fim    = parseData(c.data_fim    || c.fim    || c.dataFim);
    if ((inicio && inicio > hoje) || (fim && fim < hoje)) return;

    const lista = recebimentosPorContrato[String(c.id)] || [];
    if (lista.length === 0) return; // sem histórico ainda, não inventa

    // pega o último vencimento real
    const ordenados = lista
      .map((r) => ({ ...r, _venc: parseData(r.data_vencimento) }))
      .filter((r) => r._venc)
      .sort((a, b) => b._venc - a._venc);

    if (ordenados.length === 0) return;

    const ultimo = ordenados[0];
    const diaVencimento = ultimo._venc.getDate();

    // gera para o mês atual e o próximo
    for (let offset = 0; offset <= 1; offset++) {
      const candidato = new Date(hoje.getFullYear(), hoje.getMonth() + offset, diaVencimento);

      // se o dia não existe no mês (ex: 31), ajusta para o último dia
      if (candidato.getDate() !== diaVencimento) {
        candidato.setDate(0); // volta para o último dia do mês anterior
      }

      // já existe algum recebimento neste mês?
      const jaExiste = lista.some((r) => {
        const v = parseData(r.data_vencimento);
        return v && sameMonth(v, candidato);
      });

      if (jaExiste) continue;

      // só mostra se estiver atrasado ou dentro da janela de 30 dias
      const diff = diasEntre(hoje, candidato);
      if (diff < -5 || diff > DIAS_LISTA) continue; // -5 para pegar um pouco de atraso residual

      const imovel   = imoveisPorId[String(c.imovel_id)];
      const locatario = locatariosPorId[String(c.locatario_id)];

      const enderecoImovel = imovel
        ? [imovel.endereco, imovel.numero].filter(Boolean).join(", ")
        : `Imóvel #${c.imovel_id ?? "?"}`;

      const descContrato = locatario?.nome_locatario
        ? `${locatario.nome_locatario} · Contrato #${c.id}`
        : `Contrato #${c.id}`;

      sinteticos.push({
        id: `synth-${c.id}-${candidato.getFullYear()}-${candidato.getMonth()}`,
        vencimento: candidato,
        valor: Number(c.valor ?? ultimo.valor_cobrado ?? 0),
        status: statusRecebimento(candidato, hoje),
        imovel: enderecoImovel,
        contrato: descContrato,
        isSynthetic: true,
      });
    }
  });

  // junta tudo e ordena
  const todosPendentes = [...pendentesReais, ...sinteticos].sort(
    (a, b) => a.vencimento - b.vencimento
  );

  return {
    kpis: {
      imoveisAtivos,
      contratosVigentes,
      pagamentosAVencer: todosPendentes.filter((p) => p.status === "a_vencer").length,
      pagamentosAtrasados: todosPendentes.filter((p) => p.status === "atrasado").length,
    },
    proximosVencimentos: todosPendentes.filter(
      (p) => p.status === "atrasado" || diasEntre(hoje, p.vencimento) <= DIAS_LISTA
    ),
  };
}

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------

function MiniCalendario({ eventos }) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();

  const eventosPorDia = useMemo(() => {
    const mapa = {};
    eventos.forEach((ev) => {
      if (ev.vencimento.getMonth() === mes && ev.vencimento.getFullYear() === ano) {
        const dia = ev.vencimento.getDate();
        const atual = mapa[dia];
        if (!atual || PRIORIDADE_STATUS[ev.status] > PRIORIDADE_STATUS[atual]) {
          mapa[dia] = ev.status;
        }
      }
    });
    return mapa;
  }, [eventos, mes, ano]);

  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null);
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d);

  const nomeMes = hoje.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">{nomeMes}</div>

      <div className="mini-calendar-weekdays">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {celulas.map((dia, i) => {
          const status = dia ? eventosPorDia[dia] : null;
          const isHoje = dia === hoje.getDate();
          return (
            <div
              key={i}
              className={`mini-calendar-cell ${isHoje ? "is-today" : ""} ${!dia ? "is-empty" : ""}`}
            >
              {dia && <span>{dia}</span>}
              {status && <i className={`calendar-dot dot-${status}`} />}
            </div>
          );
        })}
      </div>

      <div className="mini-calendar-legend">
        <span><i className="calendar-dot dot-atrasado" />Atrasado</span>
        <span><i className="calendar-dot dot-a_vencer" />A vencer</span>
        <span><i className="calendar-dot dot-em_dia" />Em dia</span>
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="kpi-row">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="kpi-card">
          <div className="skeleton" style={{ width: "70%", height: "12px" }} />
          <div className="skeleton" style={{ width: "40%", height: "26px", marginTop: "6px" }} />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        // Locatários é opcional (só pra mostrar o nome) — se falhar, não derruba o painel
        const [imoveisRes, contratosRes, recebimentosRes, locatariosRes] = await Promise.all([
          api.get(ENDPOINTS.imoveis),
          api.get(ENDPOINTS.contratos),
          api.get(ENDPOINTS.recebimentos),
          api.get(ENDPOINTS.locatarios).catch(() => ({ data: [] })),
        ]);

        if (!ativo) return;

        setDados(
          montarResumo({
            imoveis: extrairLista(imoveisRes),
            contratos: extrairLista(contratosRes),
            recebimentos: extrairLista(recebimentosRes),
            locatarios: extrairLista(locatariosRes),
          })
        );
      } catch (err) {
        if (!ativo) return;
        console.error("Erro ao carregar dashboard:", err);
        setErro("Não foi possível carregar os dados do painel agora.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Visão geral</h1>
          <p>Panorama dos imóveis, contratos e pagamentos</p>
        </div>
      </header>

      {erro && <div className="form-error" style={{ marginBottom: "1.5rem" }}>{erro}</div>}

      {carregando ? (
        <KpiSkeleton />
      ) : dados ? (
        <section className="kpi-row">
          <div className="kpi-card">
            <span className="kpi-label">Imóveis ativos</span>
            <span className="kpi-value">{dados.kpis.imoveisAtivos}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Contratos vigentes</span>
            <span className="kpi-value">{dados.kpis.contratosVigentes}</span>
          </div>
          <div className="kpi-card kpi-warning">
            <span className="kpi-label">A vencer em {DIAS_A_VENCER} dias</span>
            <span className="kpi-value">{dados.kpis.pagamentosAVencer}</span>
          </div>
          <div className={`kpi-card ${dados.kpis.pagamentosAtrasados > 0 ? "kpi-danger" : ""}`}>
            <span className="kpi-label">Pagamentos em atraso</span>
            <span className="kpi-value">{dados.kpis.pagamentosAtrasados}</span>
          </div>
        </section>
      ) : null}

      {!carregando && dados && (
        <section className="dashboard-columns">
          <div className="content-card vencimentos-card">
            <h2>Próximos vencimentos</h2>

            {dados.proximosVencimentos.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum vencimento nos próximos dias.</p>
              </div>
            ) : (
              <ul className="vencimentos-list">
                {dados.proximosVencimentos.map((item) => {
                  const { dia, mes } = formatDiaMes(item.vencimento);
                  return (
                    <li key={item.id} className="vencimento-item">
                      <div className="vencimento-date">
                        <span className="dia">{dia}</span>
                        <span className="mes">{mes}</span>
                      </div>
                      <div className="vencimento-info">
                        <strong>{item.imovel}</strong>
                        <span>{item.contrato}</span>
                      </div>
                      <div className="vencimento-valor">{formatMoeda(item.valor)}</div>
                      <span className={`badge ${STATUS_BADGE_CLASS[item.status]}`}>
                        {STATUS_LABEL[item.status]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="content-card calendario-card">
            <h2>Agenda do mês</h2>
            <MiniCalendario eventos={dados.proximosVencimentos} />
          </div>
        </section>
      )}
    </div>
  );
}