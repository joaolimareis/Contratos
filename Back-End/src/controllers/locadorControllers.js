

import handleResponse  from "../utils/handleError.js";

export const createLocador = async (req, res, next) => {
  try{
    const newLocador = await createlocadorModel(req.body)
    handleResponse(res, 201, "locoador created success", newLocador)


  } catch(err){
    next(err)

  } 

}

export const getAllLocador = async (req, res, next) => {
  try {
    const locador = await getAlllocadorModel();

    console.log(locador);

    handleResponse(res, 200, "locador fetched success", locador);
  } catch (err) {
    next(err);
  }
};

export const getLocadorById = async (req, res, next) => {
  try{
      const locador = await getAlllocadorByIDModel(req.params.id)
      if(!locador)return handleResponse(res, 404, "locador not found")
      handleResponse(res, 200, "locador fetched sucess", locador)
  }catch(err){
    next(err)

  }
}

export const updateLocador = async (req, res, next) =>{
  try{
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const updateLocador = await updatelocadorModel(id, dadosAtualizados)

    if (!updateLocador){
      return handleResponse(res, 404, "locador not found", updateLocador)
    }
    handleResponse(res, 200, "locatario updated success", updateLocador)


  }catch(err){
    next(err)

  }
}

export const deleteLocador = async(req, res, next ) => {
  try{
    const deletelocador = await deletelocadorModel(req.params.id)
    if(!deletelocador){
      return handleResponse(res, 404, "locador not found")
    }
    handleResponse(res, 200, "locatario delete sucess", deletelocador)
  }catch(err){
  next(err)

}  

}

export default {
  createLocador,
  getAllLocador,
  getLocadorById,
  updateLocador,
  deleteLocador

}