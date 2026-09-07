function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "R$ 0,00";
  }

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "pt-BR"
  );
}

function formatMonth(date) {
  if (!date) {
    return "-";
  }

  const value = new Date(`${date}T00:00:00`);

  return value.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function reciboTemplate(recebimento) {
  const contrato = recebimento.contrato;
  const locatario = contrato?.locatario;
  const imovel = contrato?.imovel;
  const locador = imovel?.locador;

  const nomeLocatario =
    locatario?.nome_locatario ||
    "Locatário não informado";

  const nomeLocador =
    locador?.nome_locador ||
    "Locador não informado";

  const enderecoImovel = [
    imovel?.endereco,
    imovel?.numero
      ? `nº ${imovel.numero}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const valorPago =
    recebimento.valor_recebido ??
    recebimento.valor_cobrado;

  const valorFormatado =
    formatCurrency(valorPago);

  const mesReferencia =
    formatMonth(
      recebimento.data_vencimento
    );

  const dataPagamento =
    formatDate(
      recebimento.data_pagamento
    );

  const dataVencimento =
    formatDate(
      recebimento.data_vencimento
    );

  const dataEmissao =
    new Date().toLocaleDateString("pt-BR");

  // Prioriza numero_recibo, senão usa id
  const numeroRecibo =
    recebimento.numero_recibo ||
    recebimento.id ||
    "-";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Recibo ${escapeHtml(numeroRecibo)}</title>
<style>
* {
  box-sizing: border-box;
}

@page {
  size: A4;
  margin: 15mm;
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #1a3a5c;
  background: #fff;
}

.recibo {
  width: 100%;
  border: 3px solid #00a0e3;
  border-radius: 6px;
  padding: 36px 42px;
  min-height: 700px;
  background: #fff;
  position: relative;
}

/* =========================
   CABEÇALHO
========================= */

.header {
  text-align: center;
  border-bottom: 2px solid #00a0e3;
  padding-bottom: 22px;
  margin-bottom: 32px;
}

.titulo {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 3px;
  color: #00a0e3;
}

.subtitulo {
  margin-top: 8px;
  font-size: 13px;
  color: #5a8ab0;
}

.numero {
  margin-top: 14px;
  font-size: 12px;
  color: #00a0e3;
  font-weight: 600;
}

/* =========================
   DESTINATÁRIO
========================= */

.recebemos {
  margin-bottom: 28px;
  padding: 14px 16px;
  background: #e8f6fc;
  border-left: 4px solid #00a0e3;
  border-radius: 4px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-size: 11px;
  color: #00a0e3;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 600;
}

.nome {
  font-size: 18px;
  font-weight: bold;
  color: #1a3a5c;
}

/* =========================
   DADOS
========================= */

.dados {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 28px;
}

.campo {
  padding: 10px 12px;
  background: #f5fbfe;
  border: 1px solid #b3e0f5;
  border-radius: 4px;
}

.valor-campo {
  font-size: 14px;
  font-weight: 500;
  color: #1a3a5c;
}

/* =========================
   IMÓVEL
========================= */

.imovel {
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid #00a0e3;
  background: #e8f6fc;
  border-radius: 4px;
}

.imovel-endereco {
  font-size: 14px;
  font-weight: 500;
  color: #1a3a5c;
}

/* =========================
   VALOR
========================= */

.valor-box {
  margin: 32px 0;
  padding: 22px;
  text-align: center;
  background: linear-gradient(135deg, #e8f6fc 0%, #d0effa 100%);
  border: 2px solid #00a0e3;
  border-radius: 6px;
}

.valor-label {
  font-size: 11px;
  color: #00a0e3;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 600;
}

.valor {
  margin-top: 8px;
  font-size: 32px;
  font-weight: bold;
  color: #0077b3;
}

/* =========================
   TEXTO
========================= */

.descricao {
  font-size: 13px;
  line-height: 1.7;
  color: #2c4a6a;
  text-align: justify;
  padding: 16px;
  background: #f8fcfe;
  border-radius: 4px;
  border: 1px solid #d0eaf5;
}

/* =========================
   ASSINATURA
========================= */

.assinatura {
  margin-top: 80px;
  text-align: center;
}

.linha-assinatura {
  width: 280px;
  margin: 0 auto 10px;
  border-top: 2px solid #00a0e3;
}

.nome-assinante {
  font-size: 14px;
  font-weight: bold;
  color: #1a3a5c;
}

.cargo-assinante {
  margin-top: 4px;
  font-size: 11px;
  color: #5a8ab0;
}

/* =========================
   RODAPÉ
========================= */

.footer {
  margin-top: 40px;
  padding-top: 12px;
  border-top: 1px solid #b3e0f5;
  text-align: center;
  font-size: 10px;
  color: #5a8ab0;
}
</style>
</head>
<body>
<div class="recibo">

  <div class="header">
    <div class="titulo">
      RECIBO DE PAGAMENTO
    </div>
    <div class="subtitulo">
      Comprovante de pagamento de aluguel
    </div>
    <div class="numero">
      Recibo nº ${escapeHtml(numeroRecibo)}
    </div>
  </div>

  <div class="recebemos">
    <span class="label">
      Recebemos de
    </span>
    <div class="nome">
      ${escapeHtml(nomeLocatario)}
    </div>
  </div>

  <div class="dados">
    <div class="campo">
      <span class="label">
        REFERENTE AO MÊS
      </span>
      <div class="valor-campo">
        ${escapeHtml(mesReferencia)}
      </div>
    </div>

    <div class="campo">
      <span class="label">
        Data do pagamento
      </span>
      <div class="valor-campo">
        ${escapeHtml(dataPagamento)}
      </div>
    </div>

    <div class="campo">
      <span class="label">
        Data de vencimento
      </span>
      <div class="valor-campo">
        ${escapeHtml(dataVencimento)}
      </div>
    </div>

    <div class="campo">
      <span class="label">
        Contrato
      </span>
      <div class="valor-campo">
        #${escapeHtml(
          contrato?.id ??
          recebimento.contrato_id
        )}
      </div>
    </div>
  </div>

  ${
    enderecoImovel
      ? `
        <div class="imovel">
          <span class="label">
            Imóvel
          </span>
          <div class="imovel-endereco">
            ${escapeHtml(enderecoImovel)}
          </div>
        </div>
      `
      : ""
  }

  <div class="valor-box">
    <div class="valor-label">
      Valor pago
    </div>
    <div class="valor">
      ${escapeHtml(valorFormatado)}
    </div>
  </div>

  <div class="descricao">
    Declaramos, para os devidos fins, que
    recebemos de
    <strong>
      ${escapeHtml(nomeLocatario)}
    </strong>,
    o valor de
    <strong>
      ${escapeHtml(valorFormatado)}
    </strong>,
    referente ao pagamento do aluguel
    correspondente ao mês de
    <strong>
      ${escapeHtml(mesReferencia)}
    </strong>.
  </div>

  <div class="assinatura">
    <div class="linha-assinatura"></div>
    <div class="nome-assinante">
      ${escapeHtml(nomeLocador)}
    </div>
    <div class="cargo-assinante">
      Locador / Responsável pelo recebimento
    </div>
  </div>

  <div class="footer">
    Recibo emitido em
    ${escapeHtml(dataEmissao)}
  </div>

</div>
</body>
</html>
`;
}