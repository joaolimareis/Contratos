import { getAllImovelService, createImovelService,updateImovelService,getAllImovelByIdService,deleteImovelService } from "../models/imovelsModel.js";
import handleResponse from "../middlewares/handleError.js";


export const createImovel = async (req, res, next) => {
  try{
    const newImovel = await createImovelService(req.body)
    handleResponse(res, 201, "imovel created sucess", newImovel)

  }catch(err){
    next(err)
  }

}

export const getAllImovel = async (req, res, next) => {
  try{
    const imovel = await getAllImovelService()
    handleResponse(res, 200, "imoveis fetched sucessd", imovel)

  }catch(err){
    next(err)
  }
}

export const getAllImovelById = async (req, res, next) => {
  
  try{
    const imovel = await getAllImovelByIdService(req.params.id)
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
    const updateImovel = await updateImovelService(id, dadosAtulziados)

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
      const deleteImovel = await deleteImovelService(req.params.id)
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