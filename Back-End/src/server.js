import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";

const port = process.env.PORT || 3001;

// Testa a conexão (opcional, mas ajuda a debugar)
sequelize.authenticate()
  .then(() => console.log("Conectado ao banco de dados com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao banco:", err));

// Se estiver rodando localmente (com Docker/npm run dev), usa o listen.
// No Vercel, o app é exportado para o roteador gerenciar.
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Servidor rodando localmente na porta ${port}`);
  });
}

export default app;