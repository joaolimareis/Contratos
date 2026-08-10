import express from "express"
import { getAllImovel, createImovel,updateImovel,getAllImovelById,deleteImovel } from "../controllers/imovelControllers.js";
import valiadeImoveis from "../middlewares/imoveisValidador.js";
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();
router.use(authMiddleware);


/**
 * @swagger
 * tags:
 *   name: Imoveis
 *   description: Imoveis management API
 */
/**
 * @swagger
 * /api/imoveis:
 *   get:
 *     summary: Retrieve all imoveis
 *     tags: [Imoveis]
 *     responses:
 *       200:
 *         description: List of all Imoveis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

router.get("/imoveis",getAllImovel)
/**
 * @swagger
 * /api/imoveis:
 *   post:
 *     summary: Create a new imovel
 *     tags: [Imoveis]
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
 *         description: Imoveis created successfully
 */
router.post("/imoveis",valiadeImoveis ,createImovel)

/**
 * @swagger
 * /api/imoveis/{id}:
 *   get:
 *     summary: Get a imovel by ID
 *     tags: [Imoveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Imoveis ID
 *     responses:
 *       200:
 *         description: Imovel data found
 *       404:
 *         description: Imovel not found
 */
router.get("/imoveis/:id",getAllImovelById)
/**
 * @swagger
 * /api/imoveis/{id}:
 *   put:
 *     summary: Update a imovel by ID
 *     tags: [Imoveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The imovel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Imovel updated successfully
 */
router.put("/imoveis/:id",updateImovel)
/**
 * @swagger
 * /api/imoveis/{id}:
 *   delete:
 *     summary: Delete a Imovel by ID
 *     tags: [Imoveis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The imovel ID
 *     responses:
 *       200:
 *         description: Imovel deleted successfully
 */
router.delete("/imoveis/:id",deleteImovel)

export default router