import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Locatarios extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome_locatario: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    tel_locatario: {
      type: DataTypes.STRING(14),
      allowNull: false
    },
    rua_locatario: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    bairro_locatario: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cep_locatario: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cpf_locatario: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "locatarios_cpf_locatario_key"
    },
    rg_locatario: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "locatarios_rg_locatario_key"
    },
    uf_locatario: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'locatarios',
    schema: 'public',
    timestamps: false,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        name: "locatarios_cpf_locatario_key",
        unique: true,
        fields: [
          { name: "cpf_locatario" },
        ]
      },
      {
        name: "locatarios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "locatarios_rg_locatario_key",
        unique: true,
        fields: [
          { name: "rg_locatario" },
        ]
      },
    ]
  });
  }
  static associate(models) {

  Locatarios.hasMany(models.Contratos, {
    foreignKey: "locatario_id",
    as: "contratos"
  });

}
}
