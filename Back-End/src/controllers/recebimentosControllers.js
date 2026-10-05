  import {
    createRecebimentoService,
    getAllRecebimentosService,
    getRecebimentoByIdService,
    updateRecebimentoService,
    deleteRecebimentoService,
    getRecebimentoComDadosParaReciboService
  } from "../service/recebimentosService.js";

  // import { generatePdfFromHtml } from "../service/pdfService.js";

  // import { reciboTemplate } from "../templates/recibo.template.js";
import { generatePdf } from "../service/pdfmakeService.js";
import { reciboDocDefinition } from "../templates/recibo.pdfmake.js"; 
  import handleResponse from "../utils/handleError.js";
  import { randomUUID } from "node:crypto";
  import path from "node:path";
  import { uploadFile, deleteFile, getFileUrl } from "../utils/storage.js";

  const CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };


  export const createRecebimentoController = async (req, res, next) => {

    try {

    const {
    contrato_id,
    data_vencimento,
    data_pagamento,
    valor_cobrado,
    valor_recebido,
    status,
    numero_recibo
  } = req.body;

    const newRecebimento = await createRecebimentoService(
    contrato_id,
    data_vencimento,
    data_pagamento,
    valor_cobrado,
    valor_recebido,
    status,
    numero_recibo
  );


      return handleResponse(
        res,
        201,
        "Recebimento created success",
        newRecebimento
      );

    } catch (err) {

      next(err);

    }

  };


  export const getAllRecebimentosController = async (req, res, next) => {

    try {

      const recebimentos = await getAllRecebimentosService();


      return handleResponse(
        res,
        200,
        "Recebimentos fetched success",
        recebimentos
      );

    } catch (err) {

      next(err);

    }

  };


  export const getRecebimentoByIdController = async (req, res, next) => {

    try {

      const recebimento = await getRecebimentoByIdService(
        req.params.id
      );


      if (!recebimento) {

        return handleResponse(
          res,
          404,
          "Recebimento not found"
        );

      }


      return handleResponse(
        res,
        200,
        "Recebimento fetched success",
        recebimento
      );

    } catch (err) {

      next(err);

    }

  };


  export const updateRecebimentoController = async (req, res, next) => {

    try {

      const { id } = req.params;

  const {
    contrato_id,
    data_vencimento,
    data_pagamento,
    valor_cobrado,
    valor_recebido,
    status,
    numero_recibo
  } = req.body;


    const updatedRecebimento = await updateRecebimentoService(
    id,
    contrato_id,
    data_vencimento,
    data_pagamento,
    valor_cobrado,
    valor_recebido,
    status,
    numero_recibo
  );

      if (!updatedRecebimento) {

        return handleResponse(
          res,
          404,
          "Recebimento not found"
        );

      }


      return handleResponse(
        res,
        200,
        "Recebimento updated success",
        updatedRecebimento
      );

    } catch (err) {

      next(err);

    }

  };


  export const deleteRecebimentoController = async (req, res, next) => {

    try {

      const deletedRecebimento = await deleteRecebimentoService(
        req.params.id
      );


      if (!deletedRecebimento) {

        return handleResponse(
          res,
          404,
          "Recebimento not found"
        );

      }
      await deleteFile(deletedRecebimento.comprovante).catch(() => {});
      return handleResponse(
        res,
        200,
        "Recebimento deleted success",
        deletedRecebimento
      );

    } catch (err) {

      next(err);

    }

  };
function nomeArquivoRecibo(recebimento) {
  const numero = recebimento.numero_recibo || recebimento.id;
  const nome = recebimento.contrato?.locatario?.nome_locatario?.trim() || "";

  return `Recibo ${numero}${nome ? ` - ${nome}` : ""}`
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const gerarReciboController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recebimento = await getRecebimentoComDadosParaReciboService(id);

    if (!recebimento) {
      return handleResponse(res, 404, "Recebimento not found");
    }

    if (recebimento.status !== "pago") {
      return handleResponse(
        res,
        400,
        "Só é possível gerar recibo para recebimentos pagos."
      );
    }

    if (!recebimento.valor_recebido) {
      return handleResponse(
        res,
        400,
        "O recebimento não possui valor recebido."
      );
    }

    const pdf = await generatePdf(reciboDocDefinition(recebimento));
    const nomeArquivo = nomeArquivoRecibo(recebimento);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="recibo-${recebimento.id}.pdf"; filename*=UTF-8''${encodeURIComponent(
        `${nomeArquivo}.pdf`
      )}`
    );

    return res.send(pdf);
  } catch (err) {
    console.error("ERRO RECIBO:", err);
    next(err);
  }
};

  export const uploadComprovanteController = async (req, res, next) => {
    try {
      
      const { id } = req.params;

      if (!req.file) {
        return handleResponse(res, 400, "Nenhum arquivo enviado.");
      }

      // valida ANTES de enviar: com memoryStorage nada foi gravado em disco
      const recebimento = await getRecebimentoByIdService(id);

      if (!recebimento) {
        return handleResponse(res, 404, "Recebimento não encontrado.");
      }

      if (recebimento.status !== "pago") {
        return handleResponse(
          res,
          400,
          "Só é possível adicionar comprovante em recebimentos pagos."
        );
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      const key = `comprovantes/${id}/${randomUUID()}${ext}`;
      const oldKey = recebimento.comprovante;

      await uploadFile(
        key,
        req.file.buffer,
        CONTENT_TYPES[ext] || "application/octet-stream"
      );

      try {
        await updateRecebimentoService(
          id,
          undefined, undefined, undefined, undefined,
          undefined, undefined, undefined,
          key
        );
      } catch (dbError) {
        await deleteFile(key).catch(() => {}); // banco falhou: não deixa órfão
        throw dbError;
      }

      // apaga o comprovante anterior
      await deleteFile(oldKey).catch(() => {});

      return handleResponse(res, 200, "Comprovante adicionado com sucesso.", {
        comprovante: key,
      });
     } catch (err) {
    console.error("ERRO COMPROVANTE:", err);
    next(err);
  }
  };
  export const getComprovanteUrlController = async (req, res, next) => {
    try {
      const recebimento = await getRecebimentoByIdService(req.params.id);

      if (!recebimento?.comprovante) {
        return handleResponse(res, 404, "Comprovante não encontrado.");
      }

      const url = await getFileUrl(recebimento.comprovante);
      return res.json({ url });
    } catch (err) {
      next(err);
    }
  };
  export const removeComprovanteController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recebimento = await getRecebimentoByIdService(id);

    if (!recebimento) {
      return handleResponse(res, 404, "Recebimento não encontrado.");
    }

    if (!recebimento.comprovante) {
      return handleResponse(res, 404, "Este recebimento não tem comprovante.");
    }

    const oldKey = recebimento.comprovante;

    // limpa o banco primeiro; se falhar, o arquivo continua no bucket
    await updateRecebimentoService(
      id,
      undefined, undefined, undefined, undefined,
      undefined, undefined, undefined,
      null
    );

    await deleteFile(oldKey).catch(() => {});

    return handleResponse(res, 200, "Comprovante removido com sucesso.");
  } catch (err) {
    console.error("ERRO REMOVER COMPROVANTE:", err);
    next(err);
  }
};
export default {
  createRecebimentoController,
  getAllRecebimentosController,
  getRecebimentoByIdController,
  updateRecebimentoController,
  deleteRecebimentoController,
  gerarReciboController,
  uploadComprovanteController,
  getComprovanteUrlController,
  removeComprovanteController
};