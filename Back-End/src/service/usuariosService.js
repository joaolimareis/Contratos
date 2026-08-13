import { Usuarios } from "../models/index.js";


export const createUsuariosService = async (email, senha) => {
  const usuariosCreate = await Usuarios.create({email, senha})

  const usuarioResponse = {
    id: usuariosCreate.id,
    email: usuariosCreate.email
  }
  return usuarioResponse
};

export const getAllUsuariosService = async () =>{
  const allUsuarios =  await Usuarios.findAll({
    attributes:['id', 'email']
  })
  return allUsuarios
};


export const getUsuariosByIdService = async () =>{
    return await Usuarios.findByPk(1)

};

export const getEmailsUsuariosService = async (email) => {
  const usuarios = await Usuarios.findOne({
    where: {
      email
    },
    attributes: ['email']
  });

};





export default {
  getAllUsuariosService,
  getUsuariosByIdService,
  createUsuariosService,
  getEmailsUsuariosService
};