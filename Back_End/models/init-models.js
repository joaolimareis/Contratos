var DataTypes = require("sequelize").DataTypes;
var _casas = require("./casas");
var _locador = require("./locador");
var _locatario = require("./locatario");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var casas = _casas(sequelize, DataTypes);
  var locador = _locador(sequelize, DataTypes);
  var locatario = _locatario(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  locador.belongsTo(casas, { as: "id_casa_casa", foreignKey: "id_casa"});
  casas.hasMany(locador, { as: "locadors", foreignKey: "id_casa"});
  locatario.belongsTo(casas, { as: "id_casa_casa", foreignKey: "id_casa"});
  casas.hasMany(locatario, { as: "locatarios", foreignKey: "id_casa"});

  return {
    casas,
    locador,
    locatario,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
