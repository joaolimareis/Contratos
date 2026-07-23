import {
  createLocatariosService,
  getAllLocatariosByIDService,
  getAllLocatariosService,
  deleteLocatariosService,
  updateLocatariosService
} from "../models/locatarioModel.js";

import handleResponse  from "../middlewares/handleError.js";

export const createLocatarios = async (req, res, next) => {
  try{
    const newLocatario = await createLocatariosService(req.body)
    handleResponse(res, 201, "Locatario created success", newLocatario)


  } catch(err){
    next(err)

  } 

}

export const getAllLocatarios = async (req, res, next) => {
  try {
    const locatarios = await getAllLocatariosService();

    console.log(locatarios);

    handleResponse(res, 200, "locatarios fetched success", locatarios);
  } catch (err) {
    next(err);
  }
};

export const getLocatarioById = async (req, res, next) => {
  try{
      const locatarios = await getAllLocatariosByIDService(req.params.id)
      if(!locatarios)return handleResponse(res, 404, "Locatarios not found")
      handleResponse(res, 200, "Locatario fetched sucess", locatarios)
  }catch(err){
    next(err)

  }
}

export const updateLocatarios = async (req, res, next) =>{
  try{
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const updateLocatario = await updateLocatariosService(id, dadosAtualizados)

    if (!updateLocatario){
      return handleResponse(res, 404, "Locatarios not found", updateLocatario)
    }
    handleResponse(res, 200, "locatario updated success", updateLocatario)


  }catch(err){
    next(err)

  }
}

export const deleteLocatarios = async(req, res, next ) => {
  try{
    const deleteLocatarios = await deleteLocatariosService(req.params.id)
    if(!deleteLocatarios){
      return handleResponse(res, 404, "Locatarios not found")
    }
    handleResponse(res, 200, "locatario delete sucess", deleteLocatarios)
  }catch(err){
  next(err)

}  

}

export default {
  createLocatarios,
  getAllLocatarios,
  getLocatarioById,
  updateLocatarios,
  deleteLocatarios

}