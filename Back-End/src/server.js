import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";

const port = process.env.PORT || 3001;

/*
|--------------------------------------------------------------------------
| Conexão com o banco
|--------------------------------------------------------------------------
*/

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
  });

/*
|--------------------------------------------------------------------------
| Servidor local
|--------------------------------------------------------------------------
|
| Na Vercel, o ambiente é production e o listen() não será executado.
| A própria Vercel gerencia o servidor HTTP.
|
*/

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Servidor rodando localmente na porta ${port}`);
  });
}

/*
|--------------------------------------------------------------------------
| Exportação
|--------------------------------------------------------------------------
*/

export default app;