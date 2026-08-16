import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";

const port = process.env.PORT || 3001;

/*
|--------------------------------------------------------------------------
| Conexão com o banco
|--------------------------------------------------------------------------
*/

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
  });

/*
|--------------------------------------------------------------------------
| Servidor local
|--------------------------------------------------------------------------
|
| Na Vercel, o ambiente é production e o listen() não será executado.
| A própria Vercel gerencia o servidor HTTP.
|
*/

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Servidor rodando localmente na porta ${port}`);
  });
}

/*
|--------------------------------------------------------------------------
| Exportação
|--------------------------------------------------------------------------
*/

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
async function testeConnection() {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully')

    } catch (error){
        console.error('Unable to connect to the database: ', error)
    }
}
testeConnection()

app.listen(port,()=>{

    console.log(`Servidor rodando na porta ${port}`);

});

export default port;
