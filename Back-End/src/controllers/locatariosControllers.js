import {
  createLocatariosService,
  getAllLocatariosService,
  getLocatariosByIdService,
  updateLocatariosService,
  deleteLocatariosService
} from "../service/locatariosService.js";

import handleResponse from "../utils/handleError.js";


export const createLocatariosController = async (req, res, next) => {
  try {
    const {
      nome_locatario,
      tel_locatario,
      rua_locatario,
      bairro_locatario,
      cep_locatario,
      cpf_locatario,
      rg_locatario,
      uf_locatario
    } = req.body;

    const newLocatario = await createLocatariosService(
      nome_locatario,
      tel_locatario,
      rua_locatario,
      bairro_locatario,
      cep_locatario,
      cpf_locatario,
      rg_locatario,
      uf_locatario
    );

    return handleResponse(
      res,
      201,
      "Locatario created success",
      newLocatario
    );

  } catch (err) {
    next(err);
  }
};


export const getAllLocatariosController = async (req, res, next) => {
  try {
    const locatarios = await getAllLocatariosService();

    return handleResponse(
      res,
      200,
      "Locatarios fetched success",
      locatarios
    );

  } catch (err) {
    next(err);
  }
};


export const getLocatariosByIdController = async (req, res, next) => {
  try {
    const locatario = await getLocatariosByIdService(req.params.id);

    if (!locatario) {
      return handleResponse(
        res,
        404,
        "Locatario not found"
      );
    }

    return handleResponse(
      res,
      200,
      "Locatario fetched success",
      locatario
    );

  } catch (err) {
    next(err);
  }
};


export const updateLocatariosController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      nome_locatario,
      tel_locatario,
      rua_locatario,
      bairro_locatario,
      cep_locatario,
      cpf_locatario,
      rg_locatario,
      uf_locatario
    } = req.body;

    const updatedLocatario = await updateLocatariosService(
      id,
      nome_locatario,
      tel_locatario,
      rua_locatario,
      bairro_locatario,
      cep_locatario,
      cpf_locatario,
      rg_locatario,
      uf_locatario
    );

    if (!updatedLocatario) {
      return handleResponse(
        res,
        404,
        "Locatario not found"
      );
    }

    return handleResponse(
      res,
      200,
      "Locatario updated success",
      updatedLocatario
    );

  } catch (err) {
    next(err);
  }
};


export const deleteLocatariosController = async (req, res, next) => {
  try {
    const deletedLocatario = await deleteLocatariosService(
      req.params.id
    );

    if (!deletedLocatario) {
      return handleResponse(
        res,
        404,
        "Locatario not found"
      );
    }

    return handleResponse(
      res,
      200,
      "Locatario deleted success",
      deletedLocatario
    );

  } catch (err) {
    next(err);
  }
};


export default {
  createLocatariosController,
  getAllLocatariosController,
  getLocatariosByIdController,
  updateLocatariosController,
  deleteLocatariosController
};