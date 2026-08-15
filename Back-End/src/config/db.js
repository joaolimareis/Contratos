import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        dialectModule: pg,
        logging: false,
    }
);

export default sequelize;