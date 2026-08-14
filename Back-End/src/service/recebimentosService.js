import Recebimentos from "../models/recebimentos.js";
import Contratos from "../models/contratos.js";


export const createRecebimentoService = async (
  contrato_id,
  data_vencimento,
  data_pagamento,
  valor_cobrado,
  valor_recebido,
  status
) => {

  const contrato = await Contratos.findByPk(contrato_id);

  if (!contrato) {
    throw new Error("Contrato not found");
  }

  const newRecebimento = await Recebimentos.create({
    contrato_id,
    data_vencimento,
    data_pagamento,
    valor_cobrado,
    valor_recebido,
    status
  });

  return newRecebimento;
};


export const getAllRecebimentosService = async () => {

  const recebimentos = await Recebimentos.findAll({
    include: [
      {
        model: Contratos,
        as: "contrato"
      }
    ]
  });

  return recebimentos;
};


export const getRecebimentoByIdService = async (id) => {

  const recebimento = await Recebimentos.findByPk(id, {
    include: [
      {
        model: Contratos,
        as: "contrato"
      }
    ]
  });

  return recebimento;
};


export const updateRecebimentoService = async (
  id,
  contrato_id,
  data_vencimento,
  data_pagamento,
  valor_cobrado,
  valor_recebido,
  status
) => {

  const recebimento = await Recebimentos.findByPk(id);

  if (!recebimento) {
    return null;
  }


  if (contrato_id !== undefined) {

    const contrato = await Contratos.findByPk(contrato_id);

    if (!contrato) {
      throw new Error("Contrato not found");
    }

  }


  await recebimento.update({
    contrato_id,
    data_vencimento,
    data_pagamento,
    valor_cobrado,
    valor_recebido,
    status
  });


  return recebimento;
};


export const deleteRecebimentoService = async (id) => {

  const recebimento = await Recebimentos.findByPk(id);

  if (!recebimento) {
    return null;
  }

  await recebimento.destroy();

  return recebimento;
};


export default {
  createRecebimentoService,
  getAllRecebimentosService,
  getRecebimentoByIdService,
  updateRecebimentoService,
  deleteRecebimentoService
};