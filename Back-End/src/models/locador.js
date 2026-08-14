import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Locador extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome_locador: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    tel_locador: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rua_locador: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    bairro_locador: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    cep_locador: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cpf_locador: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: "locador_cpf_locador_key"
    },
    rg_locador: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "locador_rg_locador_key"
    },
    uf_locador: {
      type: DataTypes.CHAR(2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'locador',
    schema: 'public',
    timestamps: true,

        createdAt: "created_at",
        updatedAt: false,
    indexes: [
      {
        name: "locador_cpf_locador_key",
        unique: true,
        fields: [
          { name: "cpf_locador" },
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
        name: "locador_rg_locador_key",
        unique: true,
        fields: [
          { name: "rg_locador" },
        ]
      },
    ]
  });
  }
  static associate(models) {

  Locador.hasMany(models.Imoveis, {
    foreignKey: "locador_id",
    as: "imoveis"
  });

}
}
