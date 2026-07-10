import express from 'express';
import 'dotenv/config';
import app from './src/app.js';
import db from './config/db.js';

const PORT = process.env.PORT || 8081;




async function startServer() {
  try {
    // Tenta fazer uma query simples antes de abrir o servidor
    await db.query('SELECT 1');
    console.log('✅ Banco de dados conectado.');

    // Só inicia o Express se o banco respondeu com sucesso
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor: erro de conexão com o banco.');
    console.error(error.message);
    process.exit(1); // Fecha a aplicação indicando que houve um erro
  }
}

startServer();


app.listen(process.env.PORT || 8081, () => {
    console.log('Server running at http://localhost:' + (process.env.PORT || 8081));
});
