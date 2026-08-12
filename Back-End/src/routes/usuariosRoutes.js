import express from "express";
import {
  createUsuarios,
  getAllUsuariosController,
  getUsuariosById,
  updateUsuarios,
  deleteUsuarios,
  updateUsuariosParcial
} from "../controllers/usuariosControllers.js";
import validateUsuarios from "../middlewares/usuarioValidador.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Usuarios management API
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Retrieve all usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: List of all usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/usuarios", getAllUsuariosController);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Create a new usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       201:
 *         description: Usuario created successfully
 *       400:
 *         description: Validation error
 */
router.post("/usuarios", validateUsuarios, createUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Get a usuario by ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The usuario ID
 *     responses:
 *       200:
 *         description: Usuario data found
 *       404:
 *         description: Usuario not found
 */
router.get("/usuarios/:id", getUsuariosById);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Update a usuario by ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The usuario ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuario updated successfully
 */
router.put("/usuarios/:id", validateUsuarios, updateUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Delete a usuario by ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The usuario ID
 *     responses:
 *       200:
 *         description: Usuario deleted successfully
 */
router.delete("/usuarios/:id", deleteUsuarios);

router.patch("/usuarios/:id",updateUsuariosParcial)

export default router;