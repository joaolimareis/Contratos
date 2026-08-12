import app from "./app.js";
import sequelize from "../src/config/db.js";
import initModels from "./models/init-models.js"

const port = process.env.PORT || 3001;
const models = initModels(sequelize)

// app.get("/", async (req, res) => {

//     try {

//         const result = await pool.query(`
//             SELECT 
//                 current_database(), 
//                 inet_server_port(), 
//                 setting as data_directory 
//             FROM pg_settings 
//             WHERE name = 'data_directory'
//         `);


//         res.json({

//             mensagem:"Conectado com sucesso!",

//             banco: result.rows[0].current_database,

//             porta: result.rows[0].inet_server_port,

//             diretorio_dados: result.rows[0].data_directory

//         });


//     } catch(err){

//         res.status(500).json({
//             erro:err.message
//         });

//     }

// });

const  startServer = async () =>{
    try{
        await sequelize.authenticate()
        console.log("banco conectado")
        const { Usuarios } = initModels(sequelize)
        const usuarios = await Usuarios.findAll()
        //console.log(usuarios)
    }catch(error){
        console.error("Erro ao conectar com o banco", error);
        
    }
};
startServer()

app.listen(port,()=>{

    console.log(`Servidor rodando na porta ${port}`);

});

export default port;