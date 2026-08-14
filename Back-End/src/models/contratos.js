import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Contratos extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    locatario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locatarios',
        key: 'id'
      }
    },
    imovel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'imoveis',
        key: 'id'
      }
    },
    data_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    data_fim: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valor: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'contratos',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "contratos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
