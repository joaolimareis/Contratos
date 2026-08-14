import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Imoveis extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    locador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locador',
        key: 'id'
      }
    },
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'imoveis',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "imoveis_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
