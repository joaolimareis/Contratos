import db from '../../config/db.js';

// Sem (req, res) aqui! O model não lida com requisições HTTP.
const getAllCasas = async () => {
  try {
    const result = await db.query('SELECT c.* FROM public.casas AS c');
    return result.rows; // Apenas RETORNA as linhas do banco
  } catch (error) {
    console.error('Erro na query do banco:', error);
    throw error; // Joga o erro para o controller tratar
  }
};
const createCasa = async (casaData) => {
  try {
    const {casa, endereco, valor_aluguel, status, numero_casa  } = casaData;
    const result = await db.query(
      'INSERT INTO public.casas (casa, endereco, valor_aluguel, status, numero_casa) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [casa, endereco, valor_aluguel, status, numero_casa]
    );
    return result.rows[0]; // Retorna a casa recém-criada
  } catch (error) {
    console.error('Erro ao criar casa:', error);
    throw error; // Joga o erro para o controller tratar
  }
};

export default {
  getAllCasas,
  createCasa,
};  
