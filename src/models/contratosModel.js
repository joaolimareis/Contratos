import pool from "../config/db.js";

export const createContratoService = async (dadosCreate) => {
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
    INSERT INTO contratos
    (${columns})
    VALUES
    (${placeholders})
    RETURNING *
  `;

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

export const getAllContratosService = async () => {
  const result = await pool.query(`
    SELECT *
    FROM contratos
  `);

  return result.rows;
};

export const getContratoByIdService = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM contratos
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

export const updateContratoService = async (
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
    UPDATE contratos
    SET ${setClauses.join(", ")}
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const values = [...Object.values(dadosAtualizados), id];

  const result = await pool.query(queryText, values);

  return result.rows[0];
};

export const deleteContratoService = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM contratos
      WHERE id = $1
      RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

export default {
  createContratoService,
  getAllContratosService,
  getContratoByIdService,
  updateContratoService,
  deleteContratoService,
};