import express from "express";

import {
  createContratoController,
  getAllContratosController,
  getContratoByIdController,
  updateContratoController,
  deleteContratoController
} from "../controllers/contratosControllers.js";

import validateContratos from "../middlewares/contratosValidador.js";


const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: Contratos management API
 */


router.get(
  "/contratos",
  getAllContratosController
);


router.post(
  "/contratos",
  validateContratos,
  createContratoController
);


router.get(
  "/contratos/:id",
  getContratoByIdController
);


router.put(
  "/contratos/:id",
  updateContratoController
);


router.delete(
  "/contratos/:id",
  deleteContratoController
);


export default router;