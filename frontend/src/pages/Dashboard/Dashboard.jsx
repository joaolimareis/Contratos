import { memo, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";

// ─── Constantes ────────────────────────────────────────────────────────────────
const ENDPOINTS = {
  imoveis:      "/imoveis",
  contratos:    "/contratos",
  recebimentos: "/recebimentos",
  locatarios:   "/locatarios",
};

const DIAS_A_VENCER = 7;
const DIAS_LISTA    = 30;
const DIA_MS        = 24 * 60 * 60 * 1000;

const STATUS_LABEL = {
  em_dia:    "Em dia",
  a_vencer:  "A vencer",
  atrasado:  "Atrasado",
};

const STATUS_BADGE_CLASS = {
  em_dia:   "badge-success",
  a_vencer: "badge-warning",
  atrasado: "badge-danger",
};

const PRIORIDADE_STATUS = { atrasado: 2, a_vencer: 1, em_dia: 0 };

// Sets para lookup O(1) — Array.includes é O(n) e roda milhares de vezes
const STATUS_IMOVEL_INATIVOS   = new Set(["inativo", "desativado", "indisponivel", "indisponível"]);
const STATUS_CONTRATO_INATIVOS = new Set(["inativo", "encerrado", "cancelado", "finalizado", "rescindido", "desativado"]);

// ─── Formatadores singleton ─────────────────────────────────────────────────────
// Instanciar Intl é operação cara — crie uma vez e reutilize
const fmtMoeda  = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmtMes    = new Intl.DateTimeFormat("pt-BR", { month: "short" });
const fmtMesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

// ─── Cache de parseData ─────────────────────────────────────────────────────────
// Evita re-parsear as mesmas strings em cada re-render / chamada de montarResumo
const _parseCache = new Map();

function parseData(valor) {
  if (!valor) return null;
  if (valor instanceof Date) return valor;

  const s = String(valor).trim();
  if (_parseCache.has(s)) return _parseCache.get(s);

  let result = null;
  let m;

  if      ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)))
    result = new Date(+m[1], +m[2] - 1, +m[3]);
  else if ((m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/)))
    result = new Date(+m[3], +m[2] - 1, +m[1]);
  else if ((m = s.match(/^(\d{2})-(\d{2})-(\d{4})/)))
    result = new Date(+m[3], +m[2] - 1, +m[1]);
  else {
    const d = new Date(s);
    result = Number.isNaN(d.getTime()) ? null : d;
  }

  // Limite de cache para evitar vazamento de memória em sessões longas
  if (_parseCache.size > 2000) _parseCache.clear();
  _parseCache.set(s, result);
  return result;
}

// ─── Utilitários puros ──────────────────────────────────────────────────────────
function extrairLista(res) {
  const body = res?.data;
  if (Array.isArray(body))       return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function diasEntre(de, ate) {
  return Math.floor((ate - de) / DIA_MS);
}

function statusRecebimento(vencimento, hoje) {
  const diff = diasEntre(hoje, vencimento);
  if (diff < 0)             return "atrasado";
  if (diff <= DIAS_A_VENCER) return "a_vencer";
  return "em_dia";
}

function normalizar(str) {
  return String(str ?? "").trim().toLowerCase();
}

function formatDiaMes(date) {
  return {
    dia: date.getDate(),
    mes: fmtMes.format(date).replace(".", "").toUpperCase(),
  };
}

function formatMoeda(valor) {
  const n = Number(valor);
  return fmtMoeda.format(Number.isFinite(n) ? n : 0);
}

// Sanitiza strings vindas da API antes de exibir
function sanitize(str) {
  return String(str ?? "").replace(/[<>"']/g, "");
}

// ─── Lógica pesada (roda fora do React — sem custo de re-render) ────────────────
function montarResumo({ imoveis, contratos, recebimentos, locatarios }) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Maps para lookup O(1)
  const contratosPorId   = new Map(contratos.map((c) => [String(c.id), c]));
  const imoveisPorId     = new Map(imoveis.map((i)   => [String(i.id), i]));
  const locatariosPorId  = new Map(locatarios.map((l) => [String(l.id), l]));

  // KPI: imóveis ativos
  let imoveisAtivos = 0;
  for (const i of imoveis) {
    if (!STATUS_IMOVEL_INATIVOS.has(normalizar(i.status))) imoveisAtivos++;
  }

  // KPI: contratos vigentes
  let contratosVigentes = 0;
  for (const c of contratos) {
    if (STATUS_CONTRATO_INATIVOS.has(normalizar(c.status))) continue;
    const inicio = parseData(c.data_inicio || c.inicio || c.dataInicio || c.start_date);
    const fim    = parseData(c.data_fim    || c.fim    || c.dataFim    || c.end_date);
    if ((!inicio || inicio <= hoje) && (!fim || fim >= hoje)) contratosVigentes++;
  }

  // Recebimentos reais pendentes
  const pendentesReais = [];
  for (const r of recebimentos) {
    if (normalizar(r.status) === "pago" || r.data_pagamento) continue;
    const vencimento = parseData(r.data_vencimento);
    if (!vencimento) continue;

    const contrato  = contratosPorId.get(String(r.contrato_id));
    const imovel    = contrato ? imoveisPorId.get(String(contrato.imovel_id))    : null;
    const locatario = contrato ? locatariosPorId.get(String(contrato.locatario_id)) : null;

    const enderecoImovel = imovel
      ? sanitize([imovel.endereco, imovel.numero].filter(Boolean).join(", "))
      : `Imóvel #${contrato?.imovel_id ?? "?"}`;

    const descContrato = locatario?.nome_locatario
      ? `${sanitize(locatario.nome_locatario)} · Contrato #${contrato.id}`
      : `Contrato #${r.contrato_id}`;

    pendentesReais.push({
      id: r.id,
      vencimento,
      valor:        Number(r.valor_cobrado ?? contrato?.valor ?? 0),
      status:       statusRecebimento(vencimento, hoje),
      imovel:       enderecoImovel,
      contrato:     descContrato,
      isSynthetic:  false,
    });
  }

  // Agrupar recebimentos por contrato (Map é mais rápido que objeto literal para muitas chaves)
  const recebimentosPorContrato = new Map();
  for (const r of recebimentos) {
    const cid = String(r.contrato_id);
    const lista = recebimentosPorContrato.get(cid);
    if (lista) lista.push(r);
    else recebimentosPorContrato.set(cid, [r]);
  }

  // Sintéticos — detecta meses sem recebimento em contratos ativos
// Sintéticos — detecta meses sem recebimento em contratos ativos
const sinteticos = [];
for (const c of contratos) {
  if (STATUS_CONTRATO_INATIVOS.has(normalizar(c.status))) continue;

  const inicio = parseData(c.data_inicio || c.inicio || c.dataInicio);
  const fim    = parseData(c.data_fim    || c.fim    || c.dataFim);
  if ((inicio && inicio > hoje) || (fim && fim < hoje)) continue;

  const lista = recebimentosPorContrato.get(String(c.id));
  if (!lista || lista.length === 0) continue;

  // Achar o recebimento mais recente em uma só passagem (sem sort)
  let ultimoVenc = null;
  let ultimoR    = null;
  for (const r of lista) {
    const v = parseData(r.data_vencimento);
    if (v && (!ultimoVenc || v > ultimoVenc)) { ultimoVenc = v; ultimoR = r; }
  }
  if (!ultimoVenc) continue;

  const diaVencimento = ultimoVenc.getDate();

  // Verifica se o contrato ainda tem algum recebimento em atraso
  const temAtrasoNoContrato = lista.some((r) => {
    if (normalizar(r.status) === "pago" || r.data_pagamento) return false;
    const v = parseData(r.data_vencimento);
    return v && diasEntre(hoje, v) < 0;
  });

  for (let offset = 0; offset <= 1; offset++) {
    // Não gera o próximo mês se ainda existir atraso no contrato
    if (offset === 1 && temAtrasoNoContrato) continue;

    const candidato = new Date(hoje.getFullYear(), hoje.getMonth() + offset, diaVencimento);
    // Corrige meses sem o dia exato (ex: dia 31 em fevereiro)
    if (candidato.getDate() !== diaVencimento) candidato.setDate(0);

    const jaExiste = lista.some((r) => {
      const v = parseData(r.data_vencimento);
      return v && sameMonth(v, candidato);
    });
    if (jaExiste) continue;

    const diff = diasEntre(hoje, candidato);
    if (diff < -5 || diff > DIAS_LISTA) continue;

    const imovel    = imoveisPorId.get(String(c.imovel_id));
    const locatario = locatariosPorId.get(String(c.locatario_id));

    const enderecoImovel = imovel
      ? sanitize([imovel.endereco, imovel.numero].filter(Boolean).join(", "))
      : `Imóvel #${c.imovel_id ?? "?"}`;

    const descContrato = locatario?.nome_locatario
      ? `${sanitize(locatario.nome_locatario)} · Contrato #${c.id}`
      : `Contrato #${c.id}`;

    sinteticos.push({
      id:          `synth-${c.id}-${candidato.getFullYear()}-${candidato.getMonth()}`,
      vencimento:  candidato,
      valor:       Number(c.valor ?? ultimoR?.valor_cobrado ?? 0),
      status:      statusRecebimento(candidato, hoje),
      imovel:      enderecoImovel,
      contrato:    descContrato,
      isSynthetic: true,
    });
  }
}

    const todosPendentes = [...pendentesReais, ...sinteticos].sort(
    (a, b) => a.vencimento - b.vencimento
  );

  // Contratos que ainda têm atraso (qualquer item atrasado)
  const contratosComAtraso = new Set(
    todosPendentes
      .filter((p) => p.status === "atrasado")
      .map((p) => {
        // extrai o id do contrato a partir da descrição ou do id do item
        // (funciona tanto para real quanto sintético)
        const match = String(p.contrato).match(/Contrato #(\d+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );

  // Se o contrato tem atraso, só mostra os itens atrasados dele
  // (esconde os futuros até o atraso ser quitado)
  const proximosVencimentos = todosPendentes.filter((p) => {
    const match = String(p.contrato).match(/Contrato #(\d+)/);
    const contratoId = match ? match[1] : null;

    if (contratoId && contratosComAtraso.has(contratoId)) {
      // só deixa passar se for atrasado
      return p.status === "atrasado";
    }

    // contratos sem atraso: mostra normalmente (atrasado / a vencer / em dia dentro do limite)
    return p.status === "atrasado" || diasEntre(hoje, p.vencimento) <= DIAS_LISTA;
  });

  return {
    kpis: {
      imoveisAtivos,
      contratosVigentes,
      pagamentosAVencer:   todosPendentes.filter((p) => p.status === "a_vencer").length,
      pagamentosAtrasados: todosPendentes.filter((p) => p.status === "atrasado").length,
    },
    proximosVencimentos,
  };
}

// ─── Sub-componentes memoizados ─────────────────────────────────────────────────

// Cada item da lista só re-renderiza se seus dados mudarem
const VencimentoItem = memo(function VencimentoItem({ item }) {
  const { dia, mes } = formatDiaMes(item.vencimento);
  return (
    <li className="vencimento-item">
      <div className="vencimento-date" aria-label={`${dia} de ${mes}`}>
        <span className="dia">{dia}</span>
        <span className="mes">{mes}</span>
      </div>
      <div className="vencimento-info">
        <strong title={item.imovel}>{item.imovel}</strong>
        <span>{item.contrato}</span>
      </div>
      <div className="vencimento-valor">{formatMoeda(item.valor)}</div>
      <span className={`badge ${STATUS_BADGE_CLASS[item.status]}`}>
        {STATUS_LABEL[item.status]}
      </span>
    </li>
  );
});

// MiniCalendario só re-renderiza quando a lista de eventos mudar
const MiniCalendario = memo(function MiniCalendario({ eventos }) {
  // hoje é estável durante a vida do componente — não precisa ser state
  const hoje = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const ano      = hoje.getFullYear();
  const mes      = hoje.getMonth();
  const diaHoje  = hoje.getDate();

  // Células do calendário e nome do mês — dependem só de ano/mes (estáveis)
  const { celulas, nomeMes } = useMemo(() => {
    const diasNoMes        = new Date(ano, mes + 1, 0).getDate();
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const nomeMes          = fmtMesAno.format(hoje);

    const celulas = [];
    for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null);
    for (let d = 1; d <= diasNoMes; d++)        celulas.push(d);
    return { celulas, nomeMes };
  }, [ano, mes, hoje]);

  // Mapa dia → status — recalcula só quando eventos mudar
  const eventosPorDia = useMemo(() => {
    const mapa = {};
    for (const ev of eventos) {
      if (ev.vencimento.getMonth() !== mes || ev.vencimento.getFullYear() !== ano) continue;
      const dia   = ev.vencimento.getDate();
      const atual = mapa[dia];
      if (!atual || PRIORIDADE_STATUS[ev.status] > PRIORIDADE_STATUS[atual]) {
        mapa[dia] = ev.status;
      }
    }
    return mapa;
  }, [eventos, mes, ano]);

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">{nomeMes}</div>

      <div className="mini-calendar-weekdays" aria-hidden="true">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {celulas.map((dia, i) => {
          const status = dia ? eventosPorDia[dia] : null;
          const isHoje = dia === diaHoje;
          return (
            <div
              key={i}
              className={`mini-calendar-cell${isHoje ? " is-today" : ""}${!dia ? " is-empty" : ""}`}
              aria-label={dia ? (isHoje ? `Hoje, dia ${dia}` : `Dia ${dia}`) : undefined}
            >
              {dia && <span>{dia}</span>}
              {status && <i className={`calendar-dot dot-${status}`} aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      <div className="mini-calendar-legend" aria-label="Legenda">
        <span><i className="calendar-dot dot-atrasado" aria-hidden="true" />Atrasado</span>
        <span><i className="calendar-dot dot-a_vencer" aria-hidden="true" />A vencer</span>
        <span><i className="calendar-dot dot-em_dia"   aria-hidden="true" />Em dia</span>
      </div>
    </div>
  );
});

function KpiSkeleton() {
  return (
    <div className="kpi-row" aria-busy="true" aria-label="Carregando indicadores">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="kpi-card">
          <div className="skeleton" style={{ width: "70%", height: "12px" }} />
          <div className="skeleton" style={{ width: "40%", height: "26px", marginTop: "6px" }} />
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const [dados,      setDados]      = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState("");

  useEffect(() => {
    // AbortController cancela as requisições HTTP ao trocar de página —
    // elimina o delay causado por respostas chegando depois do unmount
    const controller = new AbortController();
    const { signal } = controller;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const [imoveisRes, contratosRes, recebimentosRes, locatariosRes] =
          await Promise.all([
            api.get(ENDPOINTS.imoveis,      { signal }),
            api.get(ENDPOINTS.contratos,    { signal }),
            api.get(ENDPOINTS.recebimentos, { signal }),
            // locatários é opcional — falha silenciosa
            api.get(ENDPOINTS.locatarios,   { signal }).catch(() => ({ data: [] })),
          ]);

        // montarResumo é pura e não toca o DOM — seguro chamar aqui
        setDados(
          montarResumo({
            imoveis:      extrairLista(imoveisRes),
            contratos:    extrairLista(contratosRes),
            recebimentos: extrairLista(recebimentosRes),
            locatarios:   extrairLista(locatariosRes),
          })
        );
      } catch (err) {
        // Ignora cancelamentos (troca de página / StrictMode)
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        console.error("Erro ao carregar dashboard:", err);
        setErro("Não foi possível carregar os dados do painel agora.");
      } finally {
        if (!signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controller.abort();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Visão geral</h1>
          <p>Panorama dos imóveis, contratos e pagamentos</p>
        </div>
      </header>

      {erro && (
        <div className="form-error" role="alert" style={{ marginBottom: "1.5rem" }}>
          {erro}
        </div>
      )}

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
          <div className={`kpi-card${dados.kpis.pagamentosAtrasados > 0 ? " kpi-danger" : ""}`}>
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
                {dados.proximosVencimentos.map((item) => (
                  <VencimentoItem key={item.id} item={item} />
                ))}
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
