import pool from "../config/db.js";

export const createImovelModel =  async (dadosCreate) => {
    const keys = Object.keys(dadosCreate)

    if(keys.length === 0) return ("Nenhum campo passado para a criação")
    
      const columns = keys.join(", ")
      const placeholders = keys.map((_, index) => `$${index +1} `).join(", ")
      const values = [... Object.values(dadosCreate)]

      const queryText = `
      INSERT INTO imoveis
      (${columns})
      VALUES
      (${placeholders})
      RETURNING *      
      `
      const result = await pool.query(queryText, values)
      return result.rows[0]
    }

export const getAllImovelModel = async () => {
    const result = await pool.query("SELECT * FROM imoveis")
        
    return result.rows

}

export const getAllImovelByIdModel = async (id) => {
  const result = await pool.query("SELECT * FROM imoveis WHERE id=$1", [id])
  return result.rows[0]
  
}

export const updateImovelModel = async (id, dadosAtulizados) => {

  const keys = Object.keys(dadosAtulizados)
  if (keys.length === 0) {
    throw new Error("Nenhum campo fornecido para atualização.");
  }
  const setClauses = keys.map((key, index) => `${key} = $${index +1}` ) 

  const queryText = `
    UPDATE imoveis
    SET ${setClauses.join(", ")}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `
  const values = [... Object.values(dadosAtulizados), id]

  const result = await pool.query(queryText, values)
  return result.rows[0]
}
export const deleteImovelModel = async (id) =>{
  const result = await pool.query("DELETE FROM imoveis WHERE id=$1 RETURNING *", [id])
  return result.rows[0]
}

export default {
  createImovelModel,
  getAllImovelModel,
  getAllImovelByIdModel,
  updateImovelModel,
  deleteImovelModel

}