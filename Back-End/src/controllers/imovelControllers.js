import {
  createImovelService,
  getAllImovelService,
  getImovelByIdService,
  updateImovelService,
  deleteImovelService
} from "../service/imovelService.js";

import handleResponse from "../utils/handleError.js";


export const createImovelController = async (req, res, next) => {

  try {

    const {
      locador_id,
      endereco,
      numero,
      status
    } = req.body;


    const newImovel = await createImovelService(
      locador_id,
      endereco,
      numero,
      status
    );


    return handleResponse(
      res,
      201,
      "Imovel created success",
      newImovel
    );

  } catch (err) {

    next(err);

  }

};


export const getAllImovelController = async (req, res, next) => {

  try {

    const imoveis = await getAllImovelService();

    return handleResponse(
      res,
      200,
      "Imoveis fetched success",
      imoveis
    );

  } catch (err) {

    next(err);

  }

};


export const getImovelByIdController = async (req, res, next) => {

  try {

    const imovel = await getImovelByIdService(
      req.params.id
    );


    if (!imovel) {

      return handleResponse(
        res,
        404,
        "Imovel not found"
      );

    }


    return handleResponse(
      res,
      200,
      "Imovel fetched success",
      imovel
    );

  } catch (err) {

    next(err);

  }

};


export const updateImovelController = async (req, res, next) => {

  try {

    const { id } = req.params;

    const {
      locador_id,
      endereco,
      numero,
      status
    } = req.body;


    const updatedImovel = await updateImovelService(
      id,
      locador_id,
      endereco,
      numero,
      status
    );


    if (!updatedImovel) {

      return handleResponse(
        res,
        404,
        "Imovel not found"
      );

    }


    return handleResponse(
      res,
      200,
      "Imovel updated success",
      updatedImovel
    );

  } catch (err) {

    next(err);

  }

};


export const deleteImovelController = async (req, res, next) => {
  try {
    const resultado = await deleteImovelService(req.params.id);

    if (resultado.reason === "NOT_FOUND") {
      return handleResponse(
        res,
        404,
        "Imóvel não encontrado"
      );
    }

    if (resultado.reason === "HAS_CONTRACTS") {
      return handleResponse(
        res,
        409,
        "Não é possível excluir o imóvel porque existem contratos vinculados a ele"
      );
    }

    return handleResponse(
      res,
      200,
      "Imóvel excluído com sucesso"
    );

  } catch (err) {
    console.error("ERRO AO DELETAR IMÓVEL:");
    console.error(err);

    next(err);
  }
};


export default {
  createImovelController,
  getAllImovelController,
  getImovelByIdController,
  updateImovelController,
  deleteImovelController
};