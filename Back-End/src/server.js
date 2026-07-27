import app from "./app.js";
import pool from "../src/config/db.js";


const port = process.env.PORT || 3001;



app.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT 
                current_database(), 
                inet_server_port(), 
                setting as data_directory 
            FROM pg_settings 
            WHERE name = 'data_directory'
        `);


        res.json({

            mensagem:"Conectado com sucesso!",

            banco: result.rows[0].current_database,

            porta: result.rows[0].inet_server_port,

            diretorio_dados: result.rows[0].data_directory

        });


    } catch(err){

        res.status(500).json({
            erro:err.message
        });

    }

});



app.listen(port,()=>{

    console.log(`Servidor rodando na porta ${port}`);

});

export default port;