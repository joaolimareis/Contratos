import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

import Usuarios from "./usuarios.js";
import Imoveis from "./imoveis.js";
import Contratos from "./contratos.js";
import Locador from "./locador.js";
import Locatarios from "./locatarios.js";
import Recebimentos from "./recebimentos.js";


Usuarios.init(sequelize, DataTypes);
Locador.init(sequelize, DataTypes);
Locatarios.init(sequelize, DataTypes);
Imoveis.init(sequelize, DataTypes);
Contratos.init(sequelize, DataTypes);
Recebimentos.init(sequelize, DataTypes);


const models = {
  Usuarios,
  Imoveis,
  Contratos,
  Locador,
  Locatarios,
  Recebimentos
};


Object.values(models).forEach((model) => {

  if (typeof model.associate === "function") {
    model.associate(models);
  }

});


export {
  sequelize,
  Usuarios,
  Imoveis,
  Contratos,
  Locador,
  Locatarios,
  Recebimentos
};