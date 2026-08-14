import Contratos from "../models/contratos.js";
import Locatarios from "../models/locatarios.js";
import Imoveis from "../models/imoveis.js";


export const createContratoService = async (
  locatario_id,
  imovel_id,
  data_inicio,
  data_fim,
  valor,
  status
) => {

  const locatario = await Locatarios.findByPk(locatario_id);

  if (!locatario) {
    throw new Error("Locatario not found");
  }


  const imovel = await Imoveis.findByPk(imovel_id);

  if (!imovel) {
    throw new Error("Imovel not found");
  }


  const newContrato = await Contratos.create({
    locatario_id,
    imovel_id,
    data_inicio,
    data_fim,
    valor,
    status
  });


  return newContrato;
};


export const getAllContratosService = async () => {

  const contratos = await Contratos.findAll({
    include: [
      {
        model: Locatarios,
        as: "locatario"
      },
      {
        model: Imoveis,
        as: "imovel"
      }
    ]
  });


  return contratos;
};


export const getContratoByIdService = async (id) => {

  const contrato = await Contratos.findByPk(id, {
    include: [
      {
        model: Locatarios,
        as: "locatario"
      },
      {
        model: Imoveis,
        as: "imovel"
      }
    ]
  });


  return contrato;
};


export const updateContratoService = async (
  id,
  locatario_id,
  imovel_id,
  data_inicio,
  data_fim,
  valor,
  status
) => {

  const contrato = await Contratos.findByPk(id);

  if (!contrato) {
    return null;
  }


  if (locatario_id !== undefined) {

    const locatario = await Locatarios.findByPk(locatario_id);

    if (!locatario) {
      throw new Error("Locatario not found");
    }

  }


  if (imovel_id !== undefined) {

    const imovel = await Imoveis.findByPk(imovel_id);

    if (!imovel) {
      throw new Error("Imovel not found");
    }

  }


  await contrato.update({
    locatario_id,
    imovel_id,
    data_inicio,
    data_fim,
    valor,
    status
  });


  return contrato;
};


export const deleteContratoService = async (id) => {

  const contrato = await Contratos.findByPk(id);

  if (!contrato) {
    return null;
  }


  await contrato.destroy();

  return contrato;
};


export default {
  createContratoService,
  getAllContratosService,
  getContratoByIdService,
  updateContratoService,
  deleteContratoService
};