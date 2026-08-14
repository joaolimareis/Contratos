import { createLocadorService,
    getAllLocadorService,
    getByIdLocadorService,
    updateLocadorService,
    deleteLocadorService} from "../service/locadorService.js"

import handleResponse  from "../utils/handleError.js";

export const createLocadorController = async (req, res, next) => {
  try{
    const newLocador = await createLocadorService(req.body)
    handleResponse(res, 201, "locoador created success", newLocador)


  } catch(err){
    next(err)

  } 

}

export const getAllLocadorController = async (req, res, next) => {

    console.log("ENTROU NO CONTROLLER DE LOCADOR");

    try {

        const locador = await getAllLocadorService();

    
        handleResponse(
            res,
            200,
            "locador fetched success",
            locador
        );

    } catch (err) {

        console.log("ERRO NO CONTROLLER:");
        console.log(err);

        next(err);
    }
};

export const getLocadorByIdController = async (req, res, next) => {
  try{
      const locador = await getByIdLocadorService(req.params.id)
      if(!locador)return handleResponse(res, 404, "locador not found")
      handleResponse(res, 200, "locador fetched sucess", locador)
  }catch(err){
    next(err)

  }
}

export const updateLocadorController = async (req, res, next) =>{
  try{
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const updateLocador = await updateLocadorService(id, dadosAtualizados)

    if (!updateLocador){
      return handleResponse(res, 404, "locador not found", updateLocador)
    }
    handleResponse(res, 200, "locatario updated success", updateLocador)


  }catch(err){
    next(err)

  }
}

export const deleteLocadorController = async (req, res, next) => {
    try {
        const deletedLocador = await deleteLocadorService(req.params.id);

        if (deletedLocador === 0) {
            return handleResponse(
                res,
                404,
                "locador not found"
            );
        }

        return handleResponse(
            res,
            200,
            "locador deleted successfully"
        );

    } catch (err) {
        next(err);
    }
};

export default {
  createLocadorController,
  getAllLocadorController,
  getLocadorByIdController,
  updateLocadorController,
  deleteLocadorController

}