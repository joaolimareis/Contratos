import { Model } from "sequelize";

export default class Usuarios extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          autoIncrementIdentity: true,
        },

        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },

        senha: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },

        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "usuarios",
        schema: "public",

        timestamps: true,

        createdAt: "created_at",
        updatedAt: false,

        indexes: [
          {
            name: "usuarios_email_key",
            unique: true,
            fields: ["email"],
          },
          {
            name: "usuarios_pkey",
            unique: true,
            fields: ["id"],
          },
        ],
      }
    );
  }
}