import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pool from "../src/config/db.js"
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