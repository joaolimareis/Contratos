import {
  createContratoService,
  getAllContratosService,
  getContratoByIdService,
  updateContratoService,
  deleteContratoService,
  uploadContratoPdfService,
  removeContratoPdfService
} from "../service/contratosService.js";

import handleResponse from "../utils/handleError.js";


export const createContratoController = async (req, res, next) => {

  try {

    const {
      locatario_id,
      imovel_id,
      data_inicio,
      data_fim,
      valor,
      status
    } = req.body;


    const newContrato = await createContratoService(
      locatario_id,
      imovel_id,
      data_inicio,
      data_fim,
      valor,
      status
    );


    return handleResponse(
      res,
      201,
      "Contrato created success",
      newContrato
    );

  } catch (err) {

    next(err);

  }

};


export const getAllContratosController = async (req, res, next) => {

  try {

    const contratos = await getAllContratosService();


    return handleResponse(
      res,
      200,
      "Contratos fetched success",
      contratos
    );

  } catch (err) {

    next(err);

  }

};


export const getContratoByIdController = async (req, res, next) => {

  try {

    const contrato = await getContratoByIdService(
      req.params.id
    );


    if (!contrato) {

      return handleResponse(
        res,
        404,
        "Contrato not found"
      );

    }


    return handleResponse(
      res,
      200,
      "Contrato fetched success",
      contrato
    );

  } catch (err) {

    next(err);

  }

};


export const updateContratoController = async (req, res, next) => {

  try {

    const { id } = req.params;

    const {
      locatario_id,
      imovel_id,
      data_inicio,
      data_fim,
      valor,
      status
    } = req.body;


    const updatedContrato = await updateContratoService(
      id,
      locatario_id,
      imovel_id,
      data_inicio,
      data_fim,
      valor,
      status
    );


    if (!updatedContrato) {

      return handleResponse(
        res,
        404,
        "Contrato not found"
      );

    }


    return handleResponse(
      res,
      200,
      "Contrato updated success",
      updatedContrato
    );

  } catch (err) {

    next(err);

  }

};


export const deleteContratoController = async (req, res, next) => {

  try {

    const deletedContrato = await deleteContratoService(
      req.params.id
    );


    if (!deletedContrato) {

      return handleResponse(
        res,
        404,
        "Contrato not found"
      );

    }


    return handleResponse(
      res,
      200,
      "Contrato deleted success",
      deletedContrato
    );

  } catch (err) {

    next(err);

  }

};

export const uploadContratoPdfController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo PDF enviado." });
    }

    // Caminho relativo que será salvo no banco
    const caminho = `/uploads/contratos/${req.file.filename}`;

    const contrato = await uploadContratoPdfService(id, caminho);

    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    return res.status(200).json({
      message: "PDF enviado com sucesso.",
      arquivo_pdf: caminho,
      data: contrato,
    });
  } catch (error) {
    next(error);
  }
};
export const removeContratoPdfController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contrato = await removeContratoPdfService(id);

    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    return res.status(200).json({
      message: "PDF removido com sucesso.",
      data: contrato,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  createContratoController,
  getAllContratosController,
  getContratoByIdController,
  updateContratoController,
  deleteContratoController
};