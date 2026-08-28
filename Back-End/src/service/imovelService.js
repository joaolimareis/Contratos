import Imoveis from "../models/imoveis.js";
import Locador from "../models/locador.js";
import Contratos from "../models/contratos.js";

export const createImovelService = async (
  locador_id,
  endereco,
  numero,
  status
) => {

  const locador = await Locador.findByPk(locador_id);

  if (!locador) {
    throw new Error("Locador not found");
  }

  const newImovel = await Imoveis.create({
    locador_id,
    endereco,
    numero,
    status
  });

  return newImovel;
};


export const getAllImovelService = async () => {

  const imoveis = await Imoveis.findAll({
    include: [
      {
        model: Locador,
        as: "locador"
      }
    ]
  });

  return imoveis;
};


export const getImovelByIdService = async (id) => {

  const imovel = await Imoveis.findByPk(id, {
    include: [
      {
        model: Locador,
        as: "locador"
      }
    ]
  });

  return imovel;
};


export const updateImovelService = async (
  id,
  locador_id,
  endereco,
  numero,
  status
) => {

  const imovel = await Imoveis.findByPk(id);

  if (!imovel) {
    return null;
  }

  if (locador_id !== undefined) {

    const locador = await Locador.findByPk(locador_id);

    if (!locador) {
      throw new Error("Locador not found");
    }
  }

  await imovel.update({
    locador_id,
    endereco,
    numero,
    status
  });

  return imovel;
};


export const deleteImovelService = async (id) => {
  const imovel = await Imoveis.findByPk(id);

  if (!imovel) {
    return {
      deleted: false,
      reason: "NOT_FOUND"
    };
  }

  const contratos = await Contratos.count({
    where: {
      imovel_id: id
    }
  });

  if (contratos > 0) {
    return {
      deleted: false,
      reason: "HAS_CONTRACTS",
      contratos
    };
  }

  await imovel.destroy();

  return {
    deleted: true,
    reason: null
  };
};

export default {
  createImovelService,
  getAllImovelService,
  getImovelByIdService,
  updateImovelService,
  deleteImovelService
};