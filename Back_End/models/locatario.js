const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('locatario', {
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
      unique: "locatario_cpf_key"
    },
    rg: {
      type: DataTypes.STRING(7),
      allowNull: false,
      unique: "locatario_rg_key"
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
      unique: "locatario_telefone_key"
    },
    data_incio_contrato: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dia_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'locatario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "locatario_cpf_key",
        unique: true,
        fields: [
          { name: "cpf" },
        ]
      },
      {
        name: "locatario_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "locatario_rg_key",
        unique: true,
        fields: [
          { name: "rg" },
        ]
      },
      {
        name: "locatario_telefone_key",
        unique: true,
        fields: [
          { name: "telefone" },
        ]
      },
    ]
  });
};
