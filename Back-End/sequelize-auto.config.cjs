require("dotenv").config();

module.exports = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  directory: "./src/models",
  tables: ["usuarios"],
  lang: "esm"
};