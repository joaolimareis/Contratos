import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import usuariosRoutes from "./routes/usuariosRoutes.js";
import locatariosRoutes from "./routes/locatariosRotues.js";
import locadorRoutes from "./routes/locadorRoutes.js";
import imoveisRoutes from "./routes/imoveisRoutes.js";
import contratosRoutes from "./routes/contratosRoutes.js";
import recebimentosRoutes from "./routes/recebimentosRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

import errorHandling from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

console.log("🔥 APP NOVA VERSAO CARREGADA");

/*
|--------------------------------------------------------------------------
| Swagger
|--------------------------------------------------------------------------
*/

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Contratos v1",
      version: "1.0.0",
      description:
        "API para gerenciamento de contratos desenvolvida em Node.js.",
    },

    servers: [
      {
        url: process.env.API_URL || `http://localhost:${port}`,
        description: "Servidor da API",
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

/*
|--------------------------------------------------------------------------
| Middlewares globais
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/*
|--------------------------------------------------------------------------
| Swagger UI
|--------------------------------------------------------------------------
*/

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

/*
|--------------------------------------------------------------------------
| Rota principal
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.redirect("/api-docs/");
});

/*
|--------------------------------------------------------------------------
| Rotas da API
|--------------------------------------------------------------------------
*/

app.use("/api", usuariosRoutes);

app.use("/api", locatariosRoutes);

app.use("/api", locadorRoutes);

app.use("/api", imoveisRoutes);

app.use("/api", contratosRoutes);

app.use("/api", recebimentosRoutes);

app.use("/api", loginRoutes);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandling);

export default app;