import {
  createRecebimentoService,
  getAllRecebimentosService,
  getRecebimentoByIdService,
  updateRecebimentoService,
  deleteRecebimentoService
} from "../models/recebimentosModel.js";

import handleResponse from "../middlewares/handleError.js";

export const createRecebimento = async (req, res, next) => {
  try {
    const newRecebimento = await createRecebimentoService(req.body);

    handleResponse(
      res,
      201,
      "Recebimento created sucess",
      newRecebimento
    );
  } catch (err) {
    next(err);
  }
};

export const getAllRecebimentos = async (req, res, next) => {
  try {
    const recebimentos = await getAllRecebimentosService();

    handleResponse(
      res,
      200,
      "Recebimentos fetched sucess",
      recebimentos
    );
  } catch (err) {
    next(err);
  }
};

export const getRecebimentoById = async (req, res, next) => {
  try {
    const recebimento = await getRecebimentoByIdService(req.params.id);

    if (!recebimento) {
      return handleResponse(res, 404, "Recebimento not found");
    }

    handleResponse(
      res,
      200,
      "Recebimento fetched sucess",
      recebimento
    );
  } catch (err) {
    next(err);
  }
};

export const updateRecebimento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recebimentoAtualizado =
      await updateRecebimentoService(id, req.body);

    if (!recebimentoAtualizado) {
      return handleResponse(res, 404, "Recebimento not found");
    }

    handleResponse(
      res,
      200,
      "Recebimento updated sucess",
      recebimentoAtualizado
    );
  } catch (err) {
    next(err);
  }
};

export const deleteRecebimento = async (req, res, next) => {
  try {
    const recebimento = await deleteRecebimentoService(req.params.id);

    if (!recebimento) {
      return handleResponse(res, 404, "Recebimento not found");
    }

    handleResponse(
      res,
      200,
      "Recebimento deleted sucess",
      recebimento
    );
  } catch (err) {
    next(err);
  }
};

export default {
  createRecebimento,
  getAllRecebimentos,
  getRecebimentoById,
  updateRecebimento,
  deleteRecebimento,
};