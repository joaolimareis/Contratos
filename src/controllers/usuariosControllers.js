import { createUsuariosService, getAllUsuariosService, getUsusariosByIdService,updateUsuariosService, deleteUsuariosService} from "../models/usuariosModel.js";

const handleResponse = (res, status, message, data = nuul) => {
  res.status(status).json({
    status,
    message,
    data,
  })
}

export const createUsuarios = async (req, res, next) => {
  const {email, senha, status} = req.body; // Destrutincg
  try{
    const newUsuarios = await createUsuariosService(email, senha, status);
    handleResponse(res, 201, "Usuario cretaed success", newUsuarios)

  }catch(err){
    next(err);

  }

}
export const getAllUsuarios = async (req, res, next) => {
  try{
    const usuarios = await getAllUsuariosService();
    handleResponse(res, 200, "Usuario fetched success", usuarios)

  }catch(err){
    next(err);

  }
}

export const getUsuariosById = async (req, res, next) => {
  try{
    const usuarios = await getUsusariosByIdService(req.params.id);
    if(!usuarios) return handleResponse(res, 404, "Usuarios not found")
    handleResponse(res, 200, "Usuario fetched success", usuarios)

  }catch(err){
    next(err);

  }
}

export const updateUsuarios = async (req, res, next) => {
  const {email, senha, status} = req.body; // Destrutincg
  try{
    const updatedUsuarios = await updateUsuariosService( email, senha, status, req.params.id,);
    if(!updatedUsuarios) return handleResponse(res, 404, "Usuarios not found")
    handleResponse(res, 200, "Usuario updated success", updatedUsuarios)

  }catch(err){
    next(err);

  }
}
export const deleteUsuarios = async (req, res, next) => {
  try{
    const deletedUsuarios = await deleteUsuariosService(req.params.id);
    if(!deletedUsuarios) return handleResponse(res, 404, "Usuarios not found")
    handleResponse(res, 200, "Usuario deletde success", deletedUsuarios)

  }catch(err){
    next(err);

  }
}