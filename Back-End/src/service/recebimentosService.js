import {
  Recebimentos,
  Contratos,
  Locatarios,
  Imoveis,
  Locador
} from "../models/index.js";

export const createRecebimentoService = async (
  contrato_id,
  data_vencimento,
  data_pagamento,
  valor_cobrado,
  valor_recebido,
  status,
  numero_recibo
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
  status,
  numero_recibo
});

  return newRecebimento;
};


export const getAllRecebimentosService = async () => {

  const recebimentos = await Recebimentos.findAll({
    include: [
      {
        model: Contratos,
        as: "contrato",
        include: [
          {
            model: Locatarios,
            as: "locatario",
            attributes: ["id", "nome_locatario"]
          }
        ]
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
  status,
  numero_recibo
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
  status,
  numero_recibo
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
export async function getRecebimentoComDadosParaReciboService(id) {

  const recebimento = await Recebimentos.findByPk(id, {

    include: [

      {
        model: Contratos,
        as: "contrato",

        include: [

          {
            model: Locatarios,
            as: "locatario",

            attributes: [
              "id",
              "nome_locatario"
            ]
          },

          {
            model: Imoveis,
            as: "imovel",

            attributes: [
              "id",
              "endereco",
              "numero"
            ],

            include: [

              {
                model: Locador,
                as: "locador",

                attributes: [
                  "id",
                  "nome_locador"
                ]
              }

            ]

          }

        ]

      }

    ]

  });

  return recebimento;
}


export default {
  createRecebimentoService,
  getAllRecebimentosService,
  getRecebimentoByIdService,
  updateRecebimentoService,
  deleteRecebimentoService
};