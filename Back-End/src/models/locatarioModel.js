import pool from "../config/db.js"

export const getAllLocatariosModel = async () =>{
  const result = await pool.query("SELECT * FROM locatarios")
  console.log(result)
  return result.rows;
}

export const getAllLocatariosByIDModel = async (id) => {
  const result = await pool.query("SELECT * FROM WHERE id = $1", [id])
  return result.rows[0];
}

export const createLocatariosModel = async (dadosCreate) => {
  const keys = Object.keys(dadosCreate)
  
  if(keys.length === 0){
    throw new Error ("Nenhum campo passado para criação")
  }
  const columns = keys.join(", ")
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ")
  const values = [... Object.values(dadosCreate)]

  const queryText = `
  INSERT INTO locatarios
  (${columns})
  VALUES
  (${placeholders})
  RETURNING *;
  `
  const result = await pool.query(queryText, values)
  return result.rows[0]

}
export const updateLocatariosModel = async (id, dadosAtualizados) => {
  // 1. Extrai as chaves (nomes das colunas) e valores do objeto
  const keys = Object.keys(dadosAtualizados);
  
  if (keys.length === 0) {
    throw new Error("Nenhum campo fornecido para atualização.");
  }

  // 2. Monta as atribuições: ["nome_locatario = $1", "tel_locatario = $2", ...]
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
  
  // 3. Monta a SQL final dinamicamente
  const queryText = `
    UPDATE locatarios 
    SET ${setClauses.join(", ")} 
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

  // 4. Junta todos os valores e adiciona o 'id' como último parâmetro
  const values = [...Object.values(dadosAtualizados), id];

  // 5. Executa a query
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

export const deleteLocatariosModel = async (id) => {
  const result = await pool.query("DELETE FROM locatarios WHERE id=$1 RETURNING *", [id])
  return result.row[0]

}

export default {
  createLocatariosModel,
  getAllLocatariosByIDModel,
  getAllLocatariosModel,
  deleteLocatariosModel,
  updateLocatariosModel
}