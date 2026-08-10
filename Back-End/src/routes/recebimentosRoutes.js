import express from "express";
import {
  createRecebimento,
  getAllRecebimentos,
  getRecebimentoById,
  updateRecebimento,
  deleteRecebimento
} from "../controllers/recebimentosControllers.js";
import validateRecebimentos from "../middlewares/recebimentoValidador.js";
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Recebimentos
 *   description: Recebimentos management API
 */

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
router.get("/recebimentos", getAllRecebimentos);

/**
 * @swagger
 * /api/recebimentos:
 *   post:
 *     summary: Create a new recebimento
 *     tags: [Recebimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Recebimento created successfully
 */
router.post("/recebimentos", validateRecebimentos, createRecebimento);

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
router.get("/recebimentos/:id", getRecebimentoById);

/**
 * @swagger
 * /api/recebimentos/{id}:
 *   put:
 *     summary: Update a recebimento by ID
 *     tags: [Recebimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recebimento ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Recebimento updated successfully
 */
router.put("/recebimentos/:id", updateRecebimento);

/**
 * @swagger
 * /api/recebimentos/{id}:
 *   delete:
 *     summary: Delete a recebimento by ID
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
 *         description: Recebimento deleted successfully
 */
router.delete("/recebimentos/:id", deleteRecebimento);

export default router;