import express from "express";
import {
  createContrato,
  getAllContratos,
  getContratoById,
  updateContrato,
  deleteContrato
} from "../controllers/contratosControllers.js";
import validateContratos from "../middlewares/contratosValidador.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: Contratos management API
 */

/**
 * @swagger
 * /api/contratos:
 *   get:
 *     summary: Retrieve all contracts
 *     tags: [Contratos]
 *     responses:
 *       200:
 *         description: List of all contracts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/contratos", getAllContratos);

/**
 * @swagger
 * /api/contratos:
 *   post:
 *     summary: Create a new contract
 *     tags: [Contratos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Add your contract properties here matching your validator/database schema
 *     responses:
 *       201:
 *         description: Contract created successfully
 */
router.post("/contratos", validateContratos, createContrato);

/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     summary: Get a contract by ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The contract ID
 *     responses:
 *       200:
 *         description: Contract data found
 *       404:
 *         description: Contract not found
 */
router.get("/contratos/:id", getContratoById);

/**
 * @swagger
 * /api/contratos/{id}:
 *   put:
 *     summary: Update a contract by ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The contract ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contract updated successfully
 */
router.put("/contratos/:id", updateContrato);

/**
 * @swagger
 * /api/contratos/{id}:
 *   delete:
 *     summary: Delete a contract by ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The contract ID
 *     responses:
 *       200:
 *         description: Contract deleted successfully
 */
router.delete("/contratos/:id", deleteContrato);

export default router;