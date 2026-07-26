import bcrypt from "bcrypt";
import { createUsuariosModel, getUsusariosByIdModel } from "../models/usuariosModel.js";
import jwt from "jsonwebtoken";


export const createUsuariosService = async (email, senha) => {

  if (!email || !senha) {
    throw new Error("Email e a senha sao obrigatorios");
  }


  const usuarioExistente = await getUsusariosByIdModel(email);


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



export const loginService = async (email, senha) => {


  const usuario = await getUsusariosByIdModel(email);


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

    token

  };

};


export default {
  createUsuariosService,
  loginService
};