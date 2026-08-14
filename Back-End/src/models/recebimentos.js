import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Recebimentos extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contratos',
        key: 'id'
      }
    },
    data_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    data_pagamento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valor_cobrado: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    valor_recebido: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pendente"
    }
  }, {
    sequelize,
    tableName: 'recebimentos',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "recebimentos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
