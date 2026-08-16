import {
  createRecebimentoService,
  getAllRecebimentosService,
  getRecebimentoByIdService,
  updateRecebimentoService,
  deleteRecebimentoService
} from "../service/recebimentosService.js";

import handleResponse from "../utils/handleError.js";


export const createRecebimentoController = async (req, res, next) => {

  try {

    const {
      contrato_id,
      data_vencimento,
      data_pagamento,
      valor_cobrado,
      valor_recebido,
      status
    } = req.body;


    const newRecebimento = await createRecebimentoService(
      contrato_id,
      data_vencimento,
      data_pagamento,
      valor_cobrado,
      valor_recebido,
      status
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
      status
    } = req.body;


    const updatedRecebimento = await updateRecebimentoService(
      id,
      contrato_id,
      data_vencimento,
      data_pagamento,
      valor_cobrado,
      valor_recebido,
      status
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


export default {
  createRecebimentoController,
  getAllRecebimentosController,
  getRecebimentoByIdController,
  updateRecebimentoController,
  deleteRecebimentoController
};