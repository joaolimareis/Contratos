import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

import Usuarios from "./usuarios.js";
import Imoveis from "./imoveis.js";
import Contratos from "./contratos.js";
import Locador  from "./locador.js";
import Locatarios from "./locatarios.js";
import Recebimentos from "./recebimentos.js";



// Inicializa os Models
Usuarios.init(sequelize, DataTypes);

// Exporta os Models
export {
    sequelize,
    Usuarios,
    Imoveis,
    Contratos,
    Locador,
    Locatarios,
    Recebimentos
};