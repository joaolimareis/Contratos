import {
  createRecebimentoService,
  getAllRecebimentosService,
  getRecebimentoByIdService,
  updateRecebimentoService,
  deleteRecebimentoService,
  getRecebimentoComDadosParaReciboService
} from "../service/recebimentosService.js";

import { generatePdfFromHtml } from "../service/pdfService.js";

import { reciboTemplate } from "../templates/recibo.template.js";

import handleResponse from "../utils/handleError.js";


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
export const gerarReciboController = async (
  req,
  res,
  next
) => {
  try {

    const { id } = req.params;

    const recebimento =
      await getRecebimentoComDadosParaReciboService(
        id
      );

    if (!recebimento) {

      return handleResponse(
        res,
        404,
        "Recebimento not found"
      );

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

    const html =
      reciboTemplate(recebimento);

    const pdf =
      await generatePdfFromHtml(html);

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="recibo-${recebimento.id}.pdf"`
    );

    res.send(pdf);

  } catch (err) {

    next(err);

  }
};

export default {
  createRecebimentoController,
  getAllRecebimentosController,
  getRecebimentoByIdController,
  updateRecebimentoController,
  deleteRecebimentoController,
  gerarReciboController
};