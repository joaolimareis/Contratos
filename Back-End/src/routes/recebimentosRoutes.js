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
/**
 * @swagger
 * tags:  
 *  name: Recebimentos
 * description: Recebimentos management API
 */
/**
/**
 * @swagger
 * /api/recebimentos:
 *   get:
 *     summary: Retrieve all recebimentos
 *     tags: [Recebimentos]
 *     responses:
 *       200:
 *         description: List of all recebimentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get(
  "/recebimentos",
  getAllRecebimentosController
);


router.post(
  "/recebimentos",
  validateRecebimentos,
  createRecebimentoController
);

/**
 * @swagger
 * /api/recebimentos/{id}:
 *   get:
 *     summary: Get a recebimento by ID
 *     tags: [Recebimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recebimento ID
 *     responses:
 *       200:
 *         description: Recebimento data found
 *       404:
 *         description: Recebimento not found
 */
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