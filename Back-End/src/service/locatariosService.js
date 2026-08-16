import Locatarios from "../models/locatarios.js";

export const createLocatariosService = async (
  nome_locatario,
  tel_locatario,
  rua_locatario,
  bairro_locatario,
  cep_locatario,
  cpf_locatario,
  rg_locatario,
  uf_locatario
) => {
  const newLocatario = await Locatarios.create({
    nome_locatario,
    tel_locatario,
    rua_locatario,
    bairro_locatario,
    cep_locatario,
    cpf_locatario,
    rg_locatario,
    uf_locatario
  });

  return newLocatario;
};

export const getAllLocatariosService = async () => {
  const locatarios = await Locatarios.findAll();

  return locatarios;
};

export const getLocatariosByIdService = async (id) => {
  const locatario = await Locatarios.findByPk(id);

  return locatario;
};

export const updateLocatariosService = async (
  id,
  nome_locatario,
  tel_locatario,
  rua_locatario,
  bairro_locatario,
  cep_locatario,
  cpf_locatario,
  rg_locatario,
  uf_locatario
) => {
  const locatario = await Locatarios.findByPk(id);

  if (!locatario) {
    return null;
  }

  await locatario.update({
    nome_locatario,
    tel_locatario,
    rua_locatario,
    bairro_locatario,
    cep_locatario,
    cpf_locatario,
    rg_locatario,
    uf_locatario
  });

  return locatario;
};

export const deleteLocatariosService = async (id) => {
  const locatario = await Locatarios.findByPk(id);

  if (!locatario) {
    return null;
  }

  await locatario.destroy();

  return locatario;
};

export default {
  createLocatariosService,
  getAllLocatariosService,
  getLocatariosByIdService,
  updateLocatariosService,
  deleteLocatariosService
};