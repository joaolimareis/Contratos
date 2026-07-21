import pool from "../config/db";

export const getAllUsuarios = async () =>{
  const result =  await pool.query("SELECT * FROM usuarios")
  return result.rows;
  
}

export const getUsusariosById = async (id) => {
  const result = await pool.query("SELECT * FROM usuarios where id =$1", [id])
  return result.rows[0]
}

export const createUsuarios = async (email, senha, status) => {
  const reuslt = await pool.query("INSERT INTO usuarios (email, senha, status) VALUES ($1, $2, $3) RETURNING *", [email, senha, status]) 

  return reuslt.rows[0] 


}
export const updateUsuarios = async (email, senha, status, id) => {
  const result = await pool.query("UPDATE usuarios SET email=$1, senha=$2, status=$3 WHERE id=$4  RETURNING *", [email, senha, status, id])
  return result.rows[0]


}
export const deleteUsuarios = async (id) => {
  const result = await pool.query("DELETE FROM usuarios WHERE id=$1 RETURNING * ",[id])
  return result.rows[0]

}
export default getAllUsuarios

