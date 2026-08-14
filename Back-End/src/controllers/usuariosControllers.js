import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAllUsuariosService,createUsuariosService, getUsuariosByIdService, getEmailsUsuariosService, updateUsuariosService} from "../service/usuariosService.js"
import loginService from "../service/loginService.js"
import handleResponse from "../utils/handleError.js";




export const createUsuariosController = async (req, res, next) => {

 
  try{

    const {email, senha} = req.body

     if (!email || !senha) {
    throw new Error("Email e a senha sao obrigatorios");
  }

    const usuarioExistente = await getEmailsUsuariosService(email);

  if (usuarioExistente) {
    throw new Error("Este email ja esta sendo usado");
  }

  const senhaHash = await bcrypt.hash(senha, 10)

    const newUsuarios = await createUsuariosService(email, senhaHash);
    
    return handleResponse(res, 201, "Usuario cretaed success", newUsuarios)

  }catch(err){
    next(err);

  }

}
export const getAllUsuariosController = async (req, res, next) =>{
  try{
    const usuarios = await getAllUsuariosService()
    return res.status(200).json({
      status: 200,
      message: "Usuarios encontrados com sucesso",
      data: usuarios
    })
  }catch(error){
    next(error)
  }
};
export const getUsuariosByIdController = async (req, res, next) => {
  try{
    const usuarios = await getUsuariosByIdService(req.params.id)
    if(!usuarios) return handleResponse(res, 404, "Usuarios not found")
    handleResponse(res, 200, "Usuario fetched success", usuarios)

  }catch(err){
    next(err);

  }
}
export const updateUsuariosController = async (req, res, next) => {
  const {email, senha, status} = req.body; // Destrutincg
  try{
    const updatedUsuarios = await updateUsuariosService( req.params.id, email, senha, status)
    if(!updatedUsuarios) return handleResponse(res, 404, "error update") //trocar o nome e status code do error
    handleResponse(res, 200, "Usuario updated success", updatedUsuarios)

  }catch(err){
    next(err);

  }
}
export const deleteUsuarios = async (req, res, next) => {
  try{
    const deletedUsuarios = await deleteUsuariosModel(req.params.id);
    if(!deletedUsuarios) return handleResponse(res, 404, "Usuarios not found")
    handleResponse(res, 200, "Usuario deletde success", deletedUsuarios)

  }catch(err){
    next(err);

  }
}
export const updateUsuariosParcial = async (req, res, next ) => {
  try{
    console.log(req.body);
console.log(req.params);
    const { id } = req.params
    const updateUsuarioPartial =  await updateParcialModel(id, req.body)
    if (!updateUsuarioPartial) {
      return handleResponse(res, 404, "Usuário não encontrado ou nenhum campo informado");
    }

    handleResponse(res, 200, "Usuário atualizado com sucesso", updateUsuarioPartial);

    
  }catch(err){
    next(err)
  }
}

export default {  
  createUsuariosController,
  getAllUsuariosController,
  getUsuariosByIdController,
  updateUsuariosController,
  deleteUsuarios,
  updateUsuariosParcial
}