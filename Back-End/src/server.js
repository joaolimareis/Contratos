import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Conectado ao banco de dados com sucesso!");

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Servidor rodando localmente na porta ${port}`);
      });
    }
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
}

startServer();

export default port;