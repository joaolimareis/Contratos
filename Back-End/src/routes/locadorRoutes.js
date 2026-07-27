import express from "express";
import { createLocador,
  getAllLocador,
  getLocadorById,
  updateLocador,
  deleteLocador} from  "../controllers/locadorControllers.js"
import validatelocador from "../middlewares/locadorValidador.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Locador
 *   description: locador management API
 */

/**
 * @swagger
 * /api/locador:
 *   get:
 *     summary: Retrieve all locador
 *     tags: [Locador]
 *     responses:
 *       200:
 *         description: List of all locador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

router.get("/locador", getAllLocador)

/**
 * @swagger
 * /api/locador:
 *   post:
 *     summary: Create a new contract
 *     tags: [Locador]
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
router.post("/locador",  validatelocador,createLocador)
/**
 * @swagger
 * /api/locador/{id}:
 *   get:
 *     summary: Get a contract by ID
 *     tags: [Locador]
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

router.get("/locador/:id", getLocadorById)
/**
 * @swagger
 * /api/locador/{id}:
 *   put:
 *     summary: Update a contract by ID
 *     tags: [Locador]
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
router.put("/locador/:id",  updateLocador)
/**
 * @swagger
 * /api/locador/{id}:
 *   delete:
 *     summary: Delete a contract by ID
 *     tags: [Locador]
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
router.delete("/locador/:id", deleteLocador)

export default router