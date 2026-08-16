import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import sequelize from "./config/db.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

import usuariosRoutes from "./routes/usuariosRoutes.js";
import locatariosRoutes from "./routes/locatariosRotues.js";
import locadorRoutes from "./routes/locadorRoutes.js";
import imoveisRoutes from "./routes/imoveisRoutes.js";
import contratosRoutes from "./routes/contratosRoutes.js";
import recebimentosRoutes from "./routes/recebimentosRoutes.js";
// import loginRoutes from "./routes/loginRoutes.js";

import errorHandling from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
console.log("🔥 APP NOVA VERSAO CARREGADA");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Contratos v2",
      version: "1.0.0",
      description:
        "API para gerenciamento de contratos desenvolvida em Node.js.",
    },

    servers: [
      {
        url:
          process.env.API_URL ||
          `http://localhost:${port}`,

        description: "Servidor da API",
      },
    ],
  },

  apis: [
    path.join(__dirname, "routes", "*.js"),
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

/*
|--------------------------------------------------------------------------
| Middlewares
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
| Swagger JSON
|--------------------------------------------------------------------------
*/

app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerDocs);
});

/*
|--------------------------------------------------------------------------
| Swagger UI
|--------------------------------------------------------------------------
*/

app.get("/api-docs", (req, res) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <title>API Contratos - Swagger</title>

  <link
    rel="stylesheet"
    href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
  />
</head>

<body>

  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>

  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "/api-docs/swagger.json",

        dom_id: "#swagger-ui",

        deepLinking: true,

        presets: [
          SwaggerUIBundle.presets.apis
        ],

        layout: "BaseLayout"
      });
    };
  </script>

</body>

</html>
  `);
});

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api", usuariosRoutes);

app.use("/api", locatariosRoutes);

app.use("/api", locadorRoutes);

app.use("/api", imoveisRoutes);

app.use("/api", contratosRoutes);

app.use("/api", recebimentosRoutes);

// app.use("/api", loginRoutes);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandling);

export default app;