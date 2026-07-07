import { Sequelize as _Sequelize } from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('casas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    casa: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: "casas_endereco_key"
    },
    valor_aluguel: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: _Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'casas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "casas_endereco_key",
        unique: true,
        fields: [
          { name: "endereco" },
        ]
      },
      {
        name: "casas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
