import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import locatariosRoutes from "./routes/locatariosRotues.js";
import locadorRoutes from "./routes/locadorRoutes.js";
import imoveisRoutes from "./routes/imoveisRoutes.js";
import contratosRoutes from "./routes/contratosRoutes.js";
import recebimentosRoutes from "./routes/recebimentosRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api Contratos v1',
      version: '1.0.0',
      description: 'A api for my project in node js, for Contratos manager'
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${port}`,
        description: "Servidor da API"
      },
    ],
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middlewares essenciais
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Rota que retorna apenas o JSON do Swagger
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Rota do Swagger UI usando CDN (Compatível com Serverless / Vercel)
app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Api Contratos v1 - Swagger UI</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
        .swagger-ui .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          window.ui = SwaggerUIBundle({
            url: "/swagger.json",
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout"
          });
        };
      </script>
    </body>
    </html>
  `);
});

// Rota raiz redirecionando para o Swagger
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Routes da aplicação
app.use("/api", usuariosRoutes);
app.use("/api", locatariosRoutes);
app.use("/api", locadorRoutes);
app.use("/api", imoveisRoutes);
app.use("/api", contratosRoutes);
app.use("/api", recebimentosRoutes);
app.use("/api", loginRoutes);

// Error handling middleware
app.use(errorHandling);

export default app;