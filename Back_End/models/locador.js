const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('locador', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_casa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'casas',
        key: 'id'
      }
    },
    nome_completo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: "locador_cpf_key"
    },
    rg: {
      type: DataTypes.STRING(7),
      allowNull: false,
      unique: "locador_rg_key"
    },
    cep: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    cidade: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: "locador_telefone_key"
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'locador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "locador_cpf_key",
        unique: true,
        fields: [
          { name: "cpf" },
        ]
      },
      {
        name: "locador_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "locador_rg_key",
        unique: true,
        fields: [
          { name: "rg" },
        ]
      },
      {
        name: "locador_telefone_key",
        unique: true,
        fields: [
          { name: "telefone" },
        ]
      },
    ]
  });
};
