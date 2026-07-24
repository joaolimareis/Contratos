import pool from "../config/db.js";

export const createRecebimentoService = async (dadosCreate) => {
  const keys = Object.keys(dadosCreate);

  if (keys.length === 0) {
    throw new Error("Nenhum campo passado para criação.");
  }

  const columns = keys.join(", ");

  const placeholders = keys
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const values = [...Object.values(dadosCreate)];

  const queryText = `
    INSERT INTO recebimentos
    (${columns})
    VALUES
    (${placeholders})
    RETURNING *
  `;

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

export const getAllRecebimentosService = async () => {
  const result = await pool.query(`
    SELECT *
    FROM recebimentos
  `);

  return result.rows;
};

export const getRecebimentoByIdService = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM recebimentos
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

export const updateRecebimentoService = async (
  id,
  dadosAtualizados
) => {
  const keys = Object.keys(dadosAtualizados);

  if (keys.length === 0) {
    throw new Error(
      "Nenhum campo fornecido para atualização."
    );
  }

  const setClauses = keys.map(
    (key, index) => `${key} = $${index + 1}`
  );

  const queryText = `
    UPDATE recebimentos
    SET ${setClauses.join(", ")}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const values = [...Object.values(dadosAtualizados), id];

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

export const deleteRecebimentoService = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM recebimentos
      WHERE id = $1
      RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

export default {
  createRecebimentoService,
  getAllRecebimentosService,
  getRecebimentoByIdService,
  updateRecebimentoService,
  deleteRecebimentoService,
};