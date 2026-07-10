import casasModel from "../models/casasModel.js";

// O controller sim recebe req e res da rota do Express
const getAllCasas = async (req, res) => {
  try {
    const casas = await casasModel.getAllCasas(); // Chama o model (que agora retorna os dados)
    res.json(casas); // O controller envia a resposta JSON
  } catch (error) {
    console.error('Erro ao buscar casas:', error);
    res.status(500).json({ error: 'Erro ao buscar casas' });
  }
};

const createCasa = async (req, res) => {
  try {
    const casaData = req.body; // Dados da casa enviados no corpo da requisição
    const newCasa = await casasModel.createCasa(casaData); // Chama o model para criar a casa
    res.status(201).json(newCasa); // Retorna a nova casa criada com status 201
  } catch (error) {
    console.error('Erro ao criar casa:', error);
    res.status(500).json({ error: 'Erro ao criar casa' });
  }
};  

export default {
  getAllCasas,
  createCasa,
};