import express from "express";
import cors from "cors";
import fs from 'node:fs';

import dotenv from "dotenv";
import sequelize from "./config/db.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import locatariosRoutes from "./routes/locatariosRotues.js";
import locadorRoutes from "./routes/locadorRoutes.js";
import imoveisRoutes from "./routes/imoveisRoutes.js";
import contratosRoutes from "./routes/contratosRoutes.js";
import recebimentosRoutes from "./routes/recebimentosRoutes.js";

import errorHandling from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

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
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CONTRATOS',
      version: '2.1.0',
      description: 'Documentação da API',
    },
    servers: isProduction
      ? [
          {
            url: 'https://contratos-henna.vercel.app',
            description: 'Servidor de Produção (Vercel)',
          },
        ]
      : [
          {
            url: 'http://localhost:3001',
            description: 'Servidor Local (Desenvolvimento)',
          },
        ],
  },
  // Caminho mais confiável
  apis: [
    path.join(__dirname, 'routes', '*.js').replaceAll('\\', '/'),
    // fallback caso a estrutura seja diferente
    path.join(process.cwd(), 'src', 'routes', '*.js').replaceAll('\\', '/'),
    path.join(process.cwd(), 'routes', '*.js').replaceAll('\\', '/'),
  ],
};

const specs = swaggerJsdoc(options);

// Logs só em desenvolvimento
if (!isProduction) {
  console.log('🔍 Specs geradas:', JSON.stringify(specs, null, 2));
}

// Só loga em desenvolvimento
if (!isProduction) {
  console.log('🔍 Specs geradas pelo Swagger:', JSON.stringify(specs, null, 2));
}

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none !important; }
    .curl-command { display: none !important; }
  `,
  // customCssUrl e customJs geralmente não são necessários
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
console.log("🔥 APP NOVA VERSAO CARREGADA");
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});





app.use("/api", usuariosRoutes);

app.use("/api", locatariosRoutes);

app.use("/api", locadorRoutes);

app.use("/api", imoveisRoutes);

app.use("/api", contratosRoutes);

app.use("/api", recebimentosRoutes);

// app.use("/api", loginRoutes);


app.use(errorHandling);

export default app;