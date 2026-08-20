import { Usuarios } from "../models/index.js";
import loginService from "../service/loginService.js"
import bcrypt from "bcrypt";

export const createUsuariosService = async (email, senha) => {
  const usuariosCreate = await Usuarios.create({email, senha})

  const usuarioResponse = {
    id: usuariosCreate.id,
    email: usuariosCreate.email
  }
  return usuarioResponse
};

export const getAllUsuariosService = async () =>{
  try {
  const allUsuarios =  await Usuarios.findAll({
    attributes:['id', 'email']
  })
  return allUsuarios
  } catch (error) {
    throw new Error("Erro ao buscar usuários: " + error.message);
  }
};


export const getUsuariosByIdService = async (id) =>{
    const usuariosId = await Usuarios.findByPk(id, {
      attributes: ["id", "email"]
    })
    return usuariosId

};

export const getEmailsUsuariosService = async (email) => {
  const usuarios = await Usuarios.findOne({
    where: {
      email
    },
    attributes: ['email']
  });

};



export const updateUsuariosService = async (
  id,
  email,
  senha,
  status
) => {
  const dadosAtualizacao = {
    email,
    status,
  };

  if (senha) {
    dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
  }

  const [quantidadeAtualizada] = await Usuarios.update(
    dadosAtualizacao,
    {
      where: {
        id,
      },
    }
  );

  if (quantidadeAtualizada === 0) {
    throw new Error("Usuário não encontrado");
  }

  const usuarioAtualizado = await Usuarios.findByPk(id, {
    attributes: ["id", "email", "status"],
  });

  return usuarioAtualizado;
};
export const deleteUsuariosServices = async(id) => {
  const deleteIdUser = await Usuarios.destroy( {
    where:{
      id
    }
  })
  return deleteIdUser

}



export default {
  getAllUsuariosService,
  getUsuariosByIdService,
  createUsuariosService,
  getEmailsUsuariosService,
  updateUsuariosService,
  deleteUsuariosServices
};