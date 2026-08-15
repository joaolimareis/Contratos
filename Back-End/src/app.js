import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
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

const swaggersDocs = swaggerJSDoc(swaggerOptions);

// Middlewares essenciais
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Rota do Swagger restaurada com opções seguras para Serverless
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggersDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    }
  })
);

// Rota raiz redirecionando para o Swagger
app.get("/", (req, res) => {
  res.redirect("/api-docs/");
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