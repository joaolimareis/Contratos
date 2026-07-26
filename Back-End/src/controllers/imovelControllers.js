import { getAllImovelModel, createImovelModel,updateImovelModel,getAllImovelByIdModel,deleteImovelModel } from "../models/imovelsModel.js";
import handleResponse from "../utils/handleError.js";


export const createImovel = async (req, res, next) => {
  try{
    const newImovel = await createImovelModel(req.body)
    handleResponse(res, 201, "imovel created sucess", newImovel)

  }catch(err){
    next(err)
  }

}

export const getAllImovel = async (req, res, next) => {
  try{
    const imovel = await getAllImovelModel()
    handleResponse(res, 200, "imoveis fetched sucessd", imovel)

  }catch(err){
    next(err)
  }
}

export const getAllImovelById = async (req, res, next) => {
  
  try{
    const imovel = await getAllImovelByIdModel(req.params.id)
    if(!imovel) return handleResponse(res, 404, "Imovel not found")
    handleResponse(res, 200, "Imovel fetched sucess", imovel)

  }catch(err){
    next(err)

  }
}

export const updateImovel = async (req, res, next) => {

  try{
    const {id} = req.params;
    const dadosAtulziados = req.body
    const updateImovel = await updateImovelModel(id, dadosAtulziados)

    if (!updateImovel){
      return handleResponse(res, 404, "Imovel not found")
    }
    handleResponse(res, 200, "imovel updated sucess", updateImovel)
    } catch(err){
      next(err)
    }
}

export const deleteImovel = async(req, res, next) => {
  try{
      const deleteImovel = await deleteImovelModel(req.params.id)
      if(!deleteImovel){
        return handleResponse(res, 404, "imovel not found")
      }
      handleResponse(res, 200, "Imovel deleted sucess", deleteImovel)

  }catch(err){
    next(err)

  }
}

export default {
  createImovel,
  getAllImovel,
  getAllImovelById,
  updateImovel,
  deleteImovel
}