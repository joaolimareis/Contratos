import express from "express";
import cors from "cors";
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
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CONTRATOS',
      version: '2.1.0',
      description: 'Documentação da API desenvolvida com Node.js e Express',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local (Desenvolvimento)',
      },
      {
        url: 'https://contratos-henna.vercel.app',
        description: 'Servidor de Produção (Vercel)',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', '*.js')], 
};


const specs = swaggerJsdoc(options);
const swaggerOptions = {
  customCssUrl: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui.min.css",
  ],
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.9.0/swagger-ui-standalone-preset.js",
  ],
  customCss: `
    .curl-command {
      display: none !important;
    }
  `,
};
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, swaggerOptions, {
    customCss: `
      .curl-command {
        display: none !important;
      }
    `,
  })
);
console.log("🔥 APP NOVA VERSAO CARREGADA");
app.get("/", (req, res) => {
  res.send("API Contratos v2");
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