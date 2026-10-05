const UNIDADES = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito",
  "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis",
  "dezessete", "dezoito", "dezenove",
];
const DEZENAS = [
  "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
  "oitenta", "noventa",
];
const CENTENAS = [
  "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
  "seiscentos", "setecentos", "oitocentos", "novecentos",
];

// ---------- valor por extenso ----------

function ate999(n) {
  if (n === 0) return "";
  if (n === 100) return "cem";

  const c = Math.floor(n / 100);
  const resto = n % 100;
  const partes = [];

  if (c) partes.push(CENTENAS[c]);

  if (resto) {
    if (resto < 20) {
      partes.push(UNIDADES[resto]);
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      partes.push(u ? `${DEZENAS[d]} e ${UNIDADES[u]}` : DEZENAS[d]);
    }
  }

  return partes.join(" e ");
}

function inteiroPorExtenso(n) {
  if (n === 0) return "zero";

  const milhoes = Math.floor(n / 1_000_000);
  const milhares = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;

  const grupos = [];

  if (milhoes) {
    grupos.push({
      n: milhoes,
      t: milhoes === 1 ? "um milhão" : `${ate999(milhoes)} milhões`,
    });
  }
  if (milhares) {
    grupos.push({
      n: milhares,
      t: milhares === 1 ? "mil" : `${ate999(milhares)} mil`,
    });
  }
  if (resto) {
    grupos.push({ n: resto, t: ate999(resto) });
  }

  return grupos
    .map((g, i) => {
      if (i === 0) return g.t;
      const usaE = g.n < 100 || g.n % 100 === 0;
      return `${usaE ? " e " : " "}${g.t}`;
    })
    .join("");
}

export function valorPorExtenso(valor) {
  const totalCentavos = Math.round(Number(valor || 0) * 100);
  const reais = Math.floor(totalCentavos / 100);
  const centavos = totalCentavos % 100;

  const partes = [];

  if (reais > 0) {
    const sufixo =
      reais === 1 ? "real" : reais % 1_000_000 === 0 ? "de reais" : "reais";
    partes.push(`${inteiroPorExtenso(reais)} ${sufixo}`);
  }

  if (centavos > 0) {
    partes.push(
      `${inteiroPorExtenso(centavos)} ${centavos === 1 ? "centavo" : "centavos"}`
    );
  }

  return partes.length ? partes.join(" e ") : "zero reais";
}

// ---------- formatação ----------

function formatNumber(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMonth(date) {
  if (!date) return "-";
  return new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );
}

function formatDateLong(date) {
  const base = date ? new Date(`${String(date).slice(0, 10)}T00:00:00`) : new Date();
  return base.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// valor preenchido: negrito e sublinhado pontilhado, como na linha do modelo
function campo(texto) {
  return {
    text: ` ${texto} `,
    bold: true,
    decoration: "underline",
    decorationStyle: "dotted",
  };
}

// ---------- documento ----------

export function reciboDocDefinition(recebimento) {
  const contrato = recebimento.contrato;
  const locatario = contrato?.locatario;
  const imovel = contrato?.imovel;
  const locador = imovel?.locador;

  const nomeLocatario = locatario?.nome_locatario?.trim() || "Locatário não informado";
  const nomeLocador = locador?.nome_locador?.trim() || "Locador não informado";

  const enderecoImovel = [
    imovel?.endereco?.trim(),
    imovel?.numero ? `nº ${imovel.numero}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const valor = recebimento.valor_recebido ?? recebimento.valor_cobrado;
  const valorNumerico = formatNumber(valor);
  const valorExtenso = valorPorExtenso(valor);

  const mesReferencia = formatMonth(recebimento.data_vencimento);
  const dataPagamento = formatDateLong(recebimento.data_pagamento);
  const numeroRecibo = recebimento.numero_recibo || recebimento.id || "-";

  // sem cidade configurada, deixa uma linha para preencher à mão
  const cidade = process.env.RECIBO_CIDADE?.trim() || "..............................";

  const referente = enderecoImovel
    ? `aluguel do mês de ${mesReferencia}, do imóvel situado em ${enderecoImovel}`
    : `aluguel do mês de ${mesReferencia}`;

  return {
    pageSize: "A4",
    pageMargins: [60, 60, 60, 60],
    info: { title: `Recibo ${numeroRecibo}` },
    defaultStyle: { font: "Helvetica", fontSize: 12, color: "#000000" },

    content: [
      {
        text: `Nº ${numeroRecibo}`,
        alignment: "right",
        fontSize: 10,
        color: "#555555",
      },
      {
        text: "Recibo",
        alignment: "center",
        fontSize: 40,
        bold: true,
        margin: [0, 10, 0, 50],
      },

      {
        alignment: "justify",
        lineHeight: 1.9,
        text: [
          "Recebi(emos) de",
          campo(nomeLocatario),
          ", a quantia de R$",
          campo(valorNumerico),
          "(",
          campo(valorExtenso),
          "), correspondente a",
          campo(referente),
          ", e para clareza firmo(amos) o presente na cidade de",
          campo(cidade),
          ", no dia",
          campo(dataPagamento),
          ".",
        ],
      },

      // Assinatura
      {
        margin: [0, 70, 0, 0],
        columns: [
          { width: "auto", text: "Assinatura", margin: [0, 0, 8, 0] },
          {
            width: "*",
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 12,
                x2: 300,
                y2: 12,
                lineWidth: 1,
                dash: { length: 2, space: 3 },
              },
            ],
          },
        ],
      },
      {
        margin: [0, 22, 0, 0],
        text: ["Nome por extenso", campo(nomeLocador)],
      },
    ],
  };
}