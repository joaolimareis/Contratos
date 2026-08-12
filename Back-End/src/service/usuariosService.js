import bcrypt from "bcrypt";
import { createUsuariosModel, getUsusariosByIdModel, loginUsuarioModel } from "../models/usuariosModel.js";
import jwt from "jsonwebtoken";
import { getAllUsuariosController } from "../controllers/usuariosControllers.js";
import { Usuarios } from "../models/index.js";
export const createUsuariosService = async (email, senha) => {

  if (!email || !senha) {
    throw new Error("Email e a senha sao obrigatorios");
  }

  const usuarioExistente = await loginUsuarioModel(email);


  if (usuarioExistente) {
    throw new Error("Este email ja esta sendo usado");
  }


  const senhaHash = await bcrypt.hash(senha, 10);


  const usuario = await createUsuariosModel(
    email,
    senhaHash
  );
  return usuario;

};

export const getAllUsuariosService = async () =>{
  return await Usuarios.findAll()
}

export const loginService = async (email, senha) => {

  const usuario = await loginUsuarioModel(email);

  console.log(usuario)
  if (!usuario) {
    throw new Error("Usuario nao encontrado");
  }


  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha
  );


  if (!senhaValida) {
    throw new Error("Senha invalida");
  }


  const token = jwt.sign(

    {
      id: usuario.id,
      email: usuario.email
    },

    process.env.JWT_SECRET,

    {
      expiresIn:"1h"
    }

  );


  return {

    usuario:{
      id:usuario.id,
      email:usuario.email
    },

    // token

  };

};


export default {
  getAllUsuariosService,
  createUsuariosService,
  loginService
};