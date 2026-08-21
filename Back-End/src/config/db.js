import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";

const isNeon = process.env.DB_PROVIDER === "neon" || process.env.DATABASE_URL?.includes("neon.tech");

const sequelize = isNeon
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectModule: pg,
      logging: false, // mude para console.log se quiser ver as queries
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
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        dialectModule: pg,
        logging: false,
        // dialectOptions: {
        //   ssl: {
        //     require: true,
        //     rejectUnauthorized: false,
        //   },
        // },
      }
    );

export default sequelize;