import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Usuarios from  "./usuarios.js";

export default function initModels(sequelize) {
  const Usuarios = _Usuarios.init(sequelize, DataTypes);


  return {
    Usuarios,
  };
}
