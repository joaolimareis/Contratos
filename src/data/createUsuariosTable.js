import pool from "../config/db.js";
const createUsuariosTable = async () =>{
  
  try{
       const queryText = `
    CREATE TABLE IF NOT EXISTS usuarios(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    senha TEXT NOT NULL UNIQUE,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    create_at TIMESTAMP DEFAULT NOW()
);

  `
  pool.query(queryText)
  console.log("Usuarios table created if not exists")
  }catch(error) {
    console.log("Error creating usuarios table: ", error)


  }
  

}

export default createUsuariosTable