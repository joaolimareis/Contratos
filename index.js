import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pool from "./src/config/db.js"
import usuariosRoutes from "./src/routes/usuariosRoutes.js"
import errorHandling from "./src/middlewares/errorHandler.js";
import createUsuariosTable from "./src/data/createUsuariosTable.js";
import locatariosRoutes from "./src/routes/locatariosRotues.js"
dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

//Middlewares
app.use(express.json())
app.use(cors())
// Routes
app.use("/api", usuariosRoutes)
app.use("/api", locatariosRoutes)
// Error handling middeleware
app.use(errorHandling)
// Create table before stating server
createUsuariosTable()
// Testing POSTGRES COnnection
app.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT current_database(), inet_server_port(), setting as data_directory 
            FROM pg_settings WHERE name = 'data_directory'
        `);
        
        res.json({
            mensagem: "Conectado com sucesso!",
            banco: result.rows[0].current_database,
            porta: result.rows[0].inet_server_port,
            diretorio_dados: result.rows[0].data_directory
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


// Server runnign
app.listen(port, () =>{
    console.log(`Server running in ${port}`)
})