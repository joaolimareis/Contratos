import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pool from "./src/config/db.js"
dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

//Middlewares
app.use(express.json())
app.use(cors())

// Routes

// Error handling middeleware


// Testing POSTGRES COnnection
app.get("/", async(req, res)=>{
    console.log("Start")
    const result = await pool.query("SELECT current_database()")
    console.log("end")
    const dbName = result.rows[0]['current_database'];
    res.send(`The database name is : ${dbName}`);

})


// Server runnign
app.listen(port, () =>{
    console.log(`Server running in ${port}`)
})