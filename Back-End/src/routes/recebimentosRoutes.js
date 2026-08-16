import express from "express";

import {
  createRecebimentoController,
  getAllRecebimentosController,
  getRecebimentoByIdController,
  updateRecebimentoController,
  deleteRecebimentoController
} from "../controllers/recebimentosControllers.js";

import validateRecebimentos from "../middlewares/recebimentoValidador.js";


const router = express.Router();


router.get(
  "/recebimentos",
  getAllRecebimentosController
);


router.post(
  "/recebimentos",
  validateRecebimentos,
  createRecebimentoController
);


router.get(
  "/recebimentos/:id",
  getRecebimentoByIdController
);


router.put(
  "/recebimentos/:id",
  updateRecebimentoController
);


router.delete(
  "/recebimentos/:id",
  deleteRecebimentoController
);


export default router;