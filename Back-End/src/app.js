import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pool from "../src/config/db.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import usuariosRoutes from "./routes/usuariosRoutes.js"
import errorHandling from "./middlewares/errorHandler.js";
import locatariosRoutes from "./routes/locatariosRotues.js"
import locadorRoutes from "./routes/locadorRoutes.js"
import imoveisRoutes from "./routes/imoveisRoutes.js"
import contratosRoutes from "./routes/contratosRoutes.js"
import recebimentosRoutes from "./routes/recebimentosRoutes.js"
import loginRoutes from "./routes/loginRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api Contratos v1',
      version: '1.0.0',
      description: 'A api for my project in node js, for Contratos maneger'
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${port}`

      },
    ],
  },
  apis: ['./app.js', './src/routes/*.js']
};

const swaggersDocs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggersDocs))
//Middlewares
app.use(express.json())
app.use(cors())
// Routes
app.use("/api", usuariosRoutes)
app.use("/api", locatariosRoutes)
app.use("/api", locadorRoutes)
app.use("/api", imoveisRoutes)
app.use("/api", contratosRoutes)
app.use("/api", recebimentosRoutes)
app.use("/api", loginRoutes)


// Error handling middeleware
app.use(errorHandling)
// Create table before stating server
// Testing POSTGRES COnnection



export default app