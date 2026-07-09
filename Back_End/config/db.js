import { Sequelize }from "sequelize";
import 'dotenv/config';


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
});

// sequelize.authenticate().then(() => {
//     console.log("Banco de dados conectado com sucesso!");
// }).catch((err) => {
//     console.error("Erro ao conectar ao banco de dados:", err);
// });

export default sequelize;