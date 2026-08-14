import { Locador } from "../models/index.js"


export const createLocadorService = async (dadosLocador) => {
    const createLocador = await Locador.create(dadosLocador)

    return createLocador
}

export const getAllLocadorService = async () =>{
    return await Locador.findAll({
        attributes: ["id","nome_locador"]
    })

}

export const getByIdLocadorService = async (id) => {
    const locadorId = await Locador.findByPk(id, {
        attributes: ["id", "nome_locador"]
    })
    return locadorId
};

export const updateLocadorService = async ( dadosLocador) => {
  const updateLocador = await Locador.update(dadosLocador,{
    where: {
        id,
    }
  });
  return updateLocador
};

export const deleteLocadorService = async (id) => {
    const deleteLocadorId = await Locador.destroy({
        where: {
            id
        }
    })
}

export default {
    createLocadorService,
    getAllLocadorService,
    getByIdLocadorService,
    updateLocadorService,
    deleteLocadorService
}


