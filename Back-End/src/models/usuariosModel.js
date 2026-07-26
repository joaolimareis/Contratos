import pool from "../config/db.js";

export const getAllUsuariosModel = async () =>{
  const result =  await pool.query("SELECT * FROM usuarios")
  return result.rows;
  
}

export const getUsusariosByIdModel = async (id) => {
  const result = await pool.query("SELECT * FROM usuarios where id =$1", [id])
  return result.rows[0]
}

export const createUsuariosModel = async (email, senha) => {
  const reuslt = await pool.query("INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING *", [email, senha]) 

  return reuslt.rows[0] 


}
export const updateUsuariosModel = async (email, senha, status, id) => {
  const result = await pool.query("UPDATE usuarios SET email=$1, senha=$2, status=$3 WHERE id=$4  RETURNING *", [email, senha, status, id])
  return result.rows[0]


}
export const deleteUsuariosModel = async (id) => {
  const result = await pool.query("DELETE FROM usuarios WHERE id=$1 RETURNING * ",[id])
  return result.rows[0]

}
export default {createUsuariosModel, getAllUsuariosModel, getUsusariosByIdModel,updateUsuariosModel, deleteUsuariosModel}

