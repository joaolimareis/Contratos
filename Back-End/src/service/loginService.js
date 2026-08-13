import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEmailsUsuariosService } from "./usuariosService.js"
import { Usuarios } from "../models/index.js";


export const findUsuarioByEmailService = async (email) => {

  const usuario = await Usuarios.findOne({
    where:{
        email
    },
    attributes: ['id', 'email', 'senha']
  })
  return usuario
};


export const loginService = async (email, senha) => {
    const usuario = await findUsuarioByEmailService(email)
    if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha
  );

  if (!senhaValida) {
    throw new Error("Senha inválida");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  return {
    usuario: {
      id: usuario.id,
      email: usuario.email
    },
    token
  };
}
export default loginService