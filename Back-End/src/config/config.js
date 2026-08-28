import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

const isNeon = process.env.DB_PROVIDER === "neon";

export default {
  development: isNeon
    ? {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: true
          }
        }
      }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: "postgres"
      },

  test: isNeon
    ? {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: true
          }
        }
      }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: "postgres"
      },

  production: isNeon
    ? {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: true
          }
        }
      }
    : {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: "postgres"
      }
};