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

    const deletedImovel = await deleteImovelService(
      req.params.id
    );


    if (!deletedImovel) {

      return handleResponse(
        res,
        404,
        "Imovel not found"
      );

    }


    return handleResponse(
      res,
      200,
      "Imovel deleted success",
      deletedImovel
    );

  } catch (err) {

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