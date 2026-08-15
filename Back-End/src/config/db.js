import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        logging: process.env.NODE_ENV !== "production",
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: "postgres",
            logging: process.env.NODE_ENV !== "production",
        }
    );
export default sequelize;