import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";

const sequelize =
  process.env.DB_PROVIDER === "neon"
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectModule: pg,
        logging: console.log,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: "postgres",
          dialectModule: pg,
          logging: console.log,
        }
      );

export default sequelize;