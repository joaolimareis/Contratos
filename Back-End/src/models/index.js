import sequelize from "../config/db.js";
import initModels from "./init-models.js";

const models = initModels(sequelize);

export const { Usuarios } = models;