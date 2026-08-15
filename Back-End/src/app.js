import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

// Middlewares essenciais
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Rota raiz informando que a API está ativa
app.get("/", (req, res) => {
  res.json({
    status: "online",
    mensagem: "API de Contratos rodando com sucesso no Vercel!",
    versao: "1.0.0"
  });
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