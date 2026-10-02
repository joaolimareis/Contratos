import { Locador } from "../models/index.js"


export const createLocadorService = async (dadosLocador) => {
    const createLocador = await Locador.create(dadosLocador)

    return createLocador
}

export const getAllLocadorService = async () => {
    return await Locador.findAll();
}

export const getByIdLocadorService = async (id) => {
    return await Locador.findByPk(id);
};
export const updateLocadorService = async (id, dadosLocador) => {
    const updateLocador = await Locador.update(dadosLocador, {
        where: {
            id
        }
    });

    return updateLocador;
};

export const deleteLocadorService = async (id) => {
    const deleteLocadorId = await Locador.destroy({
        where: {
            id
        }
    });

    return deleteLocadorId;
};

export default {
    createLocadorService,
    getAllLocadorService,
    getByIdLocadorService,
    updateLocadorService,
    deleteLocadorService
}


