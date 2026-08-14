import express from "express";
import {   createLocadorController,
  getAllLocadorController,
  getLocadorByIdController,
  updateLocadorController,
  deleteLocadorController} from  "../controllers/locadorControllers.js"
import validatelocador from "../middlewares/locadorValidador.js";

const router = express.Router();
// router.use(authMiddleware);

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
router.get("/locador",  getAllLocadorController);
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
router.post("/locador",createLocadorController)
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

router.get("/locador/:id", getLocadorByIdController)
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
router.put("/locador/:id",  updateLocadorController)
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
router.delete("/locador/:id", deleteLocadorController)

export default router