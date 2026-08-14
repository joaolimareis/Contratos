

import handleResponse from "../utils/handleError.js";

export const createContrato = async (req, res, next) => {
  try {
    
    const newContrato = await createContratoModel(req.body);
    

    handleResponse(res, 201, "Contrato created sucess", newContrato);
  } catch (err) {
    next(err);
  }
};

export const getAllContratos = async (req, res, next) => {
  try {
    const contratos = await getAllContratosModel();

    handleResponse(res, 200, "Contratos fetched sucess", contratos);
  } catch (err) {
    next(err);
  }
};

export const getContratoById = async (req, res, next) => {
  try {
    const contrato = await getContratoByIdModel(req.params.id);

    if (!contrato) {
      return handleResponse(res, 404, "Contrato not found");
    }

    handleResponse(res, 200, "Contrato fetched sucess", contrato);
  } catch (err) {
    next(err);
  }
};

export const updateContrato = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contratoAtualizado = await updateContratoModel(
      id,
      req.body
    );

    if (!contratoAtualizado) {
      return handleResponse(res, 404, "Contrato not found");
    }

    handleResponse(
      res,
      200,
      "Contrato updated sucess",
      contratoAtualizado
    );
  } catch (err) {
    next(err);
  }
};

export const deleteContrato = async (req, res, next) => {
  try {
    const contrato = await deleteContratoModel(req.params.id);

    if (!contrato) {
      return handleResponse(res, 404, "Contrato not found");
    }

    handleResponse(res, 200, "Contrato deleted sucess", contrato);
  } catch (err) {
    next(err);
  }
};

export default {
  createContrato,
  getAllContratos,
  getContratoById,
  updateContrato,
  deleteContrato,
};